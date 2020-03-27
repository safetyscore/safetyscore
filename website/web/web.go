package web

import (
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/espians/viraltracing/website/secret"
	"goji.io"
	"goji.io/pat"
	"goji.io/pattern"
)

const (
	noCache cacheType = iota + 1
	privateCache
	publicCache
)

// IsDev indicates whether we're running on a dev machine.
var IsDev bool

// Mux is the root Mux for handling requests.
var Mux *goji.Mux

var contextXSRF = struct{}{}

// Option represents a middleware option.
type Option func(*cfg)

type cacheType int

type cfg struct {
	cacheDuration time.Duration
	cacheType     cacheType
	xsrf          bool
}

// responseCacher adds cache headers to all 2xx and 3xx responses.
type responseCacher struct {
	http.ResponseWriter
	cache  string
	status int
	typ    cacheType
}

func (r *responseCacher) Write(p []byte) (int, error) {
	if r.status == 0 || (r.status >= 200 && r.status < 400) {
		hdr := r.ResponseWriter.Header()
		hdr.Set("Cache-Control", r.cache)
		switch r.typ {
		case noCache:
			hdr.Set("Expires", "Fri, 31 December 1999 23:59:59 GMT")
			hdr.Set("Pragma", "no-cache")
		case publicCache:
			hdr.Set("Pragma", "Public")
		}
	}
	return r.ResponseWriter.Write(p)
}

func (r *responseCacher) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}

// EnsureHost checks the request headers to ensure that it's an HTTPS request to
// the specified host. If not, it'll redirect the request to the same path on
// the specified host and using HTTPS. The check will also add the HSTS header
// for valid requests.
//
// This function will do nothing when running on a dev machine.
func EnsureHost(host string) {
	if IsDev || os.Getenv("SKIP_ENSURE_HOST") != "" {
		return
	}
	Mux.Use(func(inner http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Host != host || r.Header.Get("X-Forwarded-Proto") != "https" {
				url := r.URL
				url.Host = host
				url.Scheme = "https"
				http.Redirect(w, r, url.String(), http.StatusMovedPermanently)
				return
			}
			w.Header().Set("Strict-Transport-Security", "max-age=31536000")
			inner.ServeHTTP(w, r)
		})
	})
}

// GetSignedCookieValue checks that the given string is appropriately signed
// with the secret.CookieSigningKey, that it is still valid, and returns the
// unpacked value.
func GetSignedCookieValue(s string) string {
	idx := strings.LastIndex(s, ":")
	if idx < 0 {
		return ""
	}
	ts, err := strconv.ParseInt(s[idx+1:], 10, 64)
	if err != nil {
		return ""
	}
	expiry := time.Unix(ts, 0)
	if time.Since(expiry) > 0 {
		return ""
	}
	value := s[:idx]
	idx = strings.LastIndex(s, ":")
	if idx < 0 {
		return ""
	}
	expected := signCookieValue(value, expiry)
	if subtle.ConstantTimeCompare([]byte(s), []byte(expected)) != 1 {
		return ""
	}
	return value
}

// GetXSRF returns the XSRF value from the given request. It returns an
// empty string if the value doesn't exist or is invalid.
func GetXSRF(r *http.Request) string {
	v := r.Context().Value(contextXSRF)
	if v != nil {
		return v.(string)
	}
	c, err := r.Cookie("xsrf")
	if err != nil {
		return ""
	}
	return GetSignedCookieValue(c.Value)
}

// HandleGet adds a new GET route to the root Mux.
func HandleGet(pattern string, h func(http.ResponseWriter, *http.Request), opts ...Option) {
	var handler http.Handler = http.HandlerFunc(h)
	c := &cfg{}
	for _, opt := range opts {
		opt(c)
	}
	if c.cacheType > 0 {
		handler = cacheHandler(handler, c)
	}
	if c.xsrf {
		handler = xsrfGetHandler(handler)
	}
	Mux.Handle(pat.Get(pattern), handler)
}

// HandlePost adds a new POST route to the root Mux.
func HandlePost(pattern string, h func(http.ResponseWriter, *http.Request), opts ...Option) {
	var handler http.Handler = http.HandlerFunc(h)
	c := &cfg{}
	for _, opt := range opts {
		opt(c)
	}
	if c.xsrf {
		handler = xsrfPostHandler(handler)
	}
	Mux.Handle(pat.Post(pattern), handler)
}

// InternalServerError sets the http 500 status code.
func InternalServerError(w http.ResponseWriter, err error) {
	log.Printf("ERROR: %s\n", err)
	http.Error(w, "500 internal server error", http.StatusInternalServerError)
}

// NoCache will set clearing cache headers on a successful response.
func NoCache(duration time.Duration) Option {
	return func(c *cfg) {
		c.cacheDuration = duration
		c.cacheType = noCache
	}
}

// PrivateCache will set private cache headers on a successful response.
func PrivateCache(duration time.Duration) Option {
	return func(c *cfg) {
		c.cacheDuration = duration
		c.cacheType = privateCache
	}
}

// PublicCache will set public cache headers on a successful response.
func PublicCache(duration time.Duration) Option {
	return func(c *cfg) {
		c.cacheDuration = duration
		c.cacheType = publicCache
	}
}

// Wildcard returns the matched wildcard component of the route.
func Wildcard(r *http.Request) string {
	path := pattern.Path(r.Context())
	if len(path) > 1 && path[0] == '/' {
		return path[1:]
	}
	return path
}

// XSRF will set an XSRF cookie header on GET requests and check it against
// form data on POST requests.
func XSRF() Option {
	return func(c *cfg) {
		c.xsrf = true
	}
}

func cacheHandler(inner http.Handler, c *cfg) http.Handler {
	cache := ""
	switch c.cacheType {
	case noCache:
		cache = "no-store, must-revalidate"
	case privateCache:
		cache = fmt.Sprintf("private, max-age=%d;", c.cacheDuration/time.Second)
	case publicCache:
		cache = fmt.Sprintf("public, max-age=%d;", c.cacheDuration/time.Second)
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w = &responseCacher{
			ResponseWriter: w,
			cache:          cache,
			typ:            c.cacheType,
		}
		inner.ServeHTTP(w, r)
	})
}

func signCookieValue(value string, expiry time.Time) string {
	ts := expiry.Unix()
	h := hmac.New(sha256.New, secret.CookieSigningKey)
	fmt.Fprintf(h, "%s:%d", value, ts)
	mac := base64.RawURLEncoding.EncodeToString(h.Sum(nil))
	return fmt.Sprintf("%s:%s:%d", value, mac, ts)
}

func xsrfGetHandler(inner http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := GetXSRF(r)
		if token == "" {
			buf := make([]byte, 32)
			if _, err := rand.Read(buf); err != nil {
				InternalServerError(w, err)
				return
			}
			token = hex.EncodeToString(buf)
			signed := signCookieValue(token, time.Now().Add(10*24*time.Hour))
			http.SetCookie(w, &http.Cookie{
				MaxAge: 10 * 86400,
				Name:   "xsrf",
				Secure: true,
				Value:  signed,
			})
		}
		r = r.WithContext(context.WithValue(r.Context(), contextXSRF, token))
		inner.ServeHTTP(w, r)
	})
}

func xsrfPostHandler(inner http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := GetXSRF(r)
		if token == "" {
			http.Error(w, "403 forbidden", http.StatusForbidden)
			return
		}
		form := r.FormValue("xsrf")
		if form == "" {
			http.Error(w, "403 forbidden", http.StatusForbidden)
			return
		}
		if subtle.ConstantTimeCompare([]byte(token), []byte(form)) != 1 {
			http.Error(w, "403 forbidden", http.StatusForbidden)
			return
		}
		inner.ServeHTTP(w, r)
	})
}

func init() {
	IsDev = os.Getenv("GAE_INSTANCE") == ""
	Mux = goji.NewMux()
}
