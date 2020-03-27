package template

import (
	"html/template"
	"io/ioutil"
	"net/http"
	"sync"

	"github.com/espians/viraltracing/website/asset"
	"github.com/espians/viraltracing/website/web"
)

var (
	cache = map[string]*template.Template{}
	mu    sync.RWMutex
)

var funcs = template.FuncMap{
	"asset": asset.Path,
}

// Get instantiates a template with the given name and the default functions. On
// production environments, it returns a previously cached template one if it
// exists.
func Get(name string) (*template.Template, error) {
	if web.IsDev {
		src, err := ioutil.ReadFile("template/" + name + ".tmpl")
		if err != nil {
			return nil, err
		}
		return template.New(name).Funcs(funcs).Parse(string(src))
	}
	mu.RLock()
	tmpl, ok := cache[name]
	mu.RUnlock()
	if ok {
		return tmpl, nil
	}
	src, err := ioutil.ReadFile("template/" + name + ".tmpl")
	if err != nil {
		return nil, err
	}
	tmpl, err = template.New(name).Funcs(funcs).Parse(string(src))
	if err != nil {
		return nil, err
	}
	mu.Lock()
	cache[name] = tmpl
	mu.Unlock()
	return tmpl, nil
}

// MustGet tries to get the template with the given name, and if that fails
// writes a 500 status code on the http response and returns nil instead.
func MustGet(name string, w http.ResponseWriter) *template.Template {
	tmpl, err := Get(name)
	if err != nil {
		web.InternalServerError(w, err)
		return nil
	}
	return tmpl
}
