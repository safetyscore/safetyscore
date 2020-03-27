package asset

import (
	"crypto/sha256"
	"encoding/hex"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/espians/viraltracing/website/web"
	"goji.io/pat"
)

const root = "file"

var ctypes = map[string]string{
	".css":   "text/css",
	".eot":   "application/vnd.ms-fontobject",
	".ico":   "image/vnd.microsoft.icon",
	".jpeg":  "image/jpeg",
	".jpg":   "image/jpeg",
	".js":    "text/javascript",
	".json":  "application/json",
	".otf":   "font/otf",
	".pdf":   "application/pdf",
	".png":   "image/png",
	".svg":   "image/svg+xml",
	".ttf":   "font/ttf",
	".txt":   "text/plain; charset=utf-8",
	".woff":  "font/woff",
	".woff2": "font/woff2",
}

var files = map[string]*file{}

type file struct {
	ctype  string
	data   []byte
	digest string
}

// Path returns the URL path for the given asset file.
func Path(src string) string {
	if web.IsDev {
		return "/asset/file/" + src
	}
	file, ok := files[src]
	if !ok {
		return ""
	}
	return "/asset/hashed/" + file.digest + "/" + src
}

// RegisterHandlers registers package-specific handlers on the root Mux.
func RegisterHandlers() {
	if web.IsDev {
		web.HandleGet("/asset/file/*", serveDevFile)
	} else {
		web.HandleGet("/asset/file/*", serveFile)
	}
	web.HandleGet("/asset/hashed/:digest/*", serveHashed, web.PublicCache(240*time.Hour))
}

func getContentType(path string) string {
	ctype, ok := ctypes[filepath.Ext(path)]
	if ok {
		return ctype
	}
	return "application/octet-stream"
}

func serveDevFile(w http.ResponseWriter, r *http.Request) {
	path := web.Wildcard(r)
	data, err := ioutil.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			http.NotFound(w, r)
			return
		}
		web.InternalServerError(w, err)
		return
	}
	w.Header().Set("Content-Type", getContentType(path))
	w.Write(data)
}

func serveFile(w http.ResponseWriter, r *http.Request) {
	path := web.Wildcard(r)
	file, ok := files[path]
	if !ok {
		http.NotFound(w, r)
		return
	}
	http.Redirect(w, r, "/asset/hashed/"+file.digest+"/"+path, http.StatusFound)
}

func serveHashed(w http.ResponseWriter, r *http.Request) {
	digest := pat.Param(r, "digest")
	path := web.Wildcard(r)
	file, ok := files[path]
	if !ok || digest != file.digest {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", file.ctype)
	w.Write(file.data)
}

func init() {
	if web.IsDev {
		return
	}
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		data, err := ioutil.ReadFile(path)
		if err != nil {
			return err
		}
		raw := sha256.Sum256(data)
		digest := hex.EncodeToString(raw[:])
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		files[rel] = &file{
			ctype:  getContentType(path),
			data:   data,
			digest: digest,
		}
		return nil
	})
	if err != nil {
		log.Fatalf("Unable to init asset root %q: %s", root, err)
	}
}
