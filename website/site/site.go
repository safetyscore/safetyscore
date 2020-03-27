package site

import (
	"bytes"
	"fmt"
	stdtemplate "html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/espians/viraltracing/website/markdown"
	"github.com/espians/viraltracing/website/template"
	"github.com/espians/viraltracing/website/web"
	"goji.io/pat"
	"gopkg.in/yaml.v3"
)

var (
	frontmatterStart = []byte("---\n")
	frontmatterEnd   = []byte("\n---\n")
	pages            = map[string][]byte{}
)

// PageInfo specifies the configurable parameters for rendering with the site
// template.
type PageInfo struct {
	Content stdtemplate.HTML
	Title   string
}

// RegisterHandlers registers package-specific handlers on the root Mux.
func RegisterHandlers() {
	if web.IsDev {
		web.HandleGet("/site/:page", serveDevPage)
	} else {
		web.HandleGet("/site/:page", servePage)
	}
}

// Render emits the rendered output.
func Render(w http.ResponseWriter, info *PageInfo) {
	out, err := renderSite(info)
	if err != nil {
		web.InternalServerError(w, err)
		return
	}
	w.Write(out)
}

func renderPage(src []byte) ([]byte, error) {
	src = bytes.TrimSpace(src)
	title := ""
	if bytes.HasPrefix(src, frontmatterStart) {
		src = bytes.TrimPrefix(src, frontmatterStart)
		split := bytes.SplitN(src, frontmatterEnd, 2)
		if len(split) != 2 {
			return nil, fmt.Errorf("site: could not find the closing delimeter for the frontmatter")
		}
		fields := map[string]interface{}{}
		if err := yaml.Unmarshal(split[0], fields); err != nil {
			return nil, fmt.Errorf("site: could not decode the frontmatter: %s", err)
		}
		val, ok := fields["title"]
		if ok {
			val, ok := val.(string)
			if ok {
				title = val
			}
		}
		src = bytes.TrimSpace(split[1])
	}
	out, err := markdown.Render(src)
	if err != nil {
		return nil, fmt.Errorf("site: could not process the markdown: %s", err)
	}
	out, err = renderSite(&PageInfo{
		Content: stdtemplate.HTML(out),
		Title:   title,
	})
	if err != nil {
		return nil, fmt.Errorf("site: could not render the site template: %s", err)
	}
	return out, nil
}

func renderSite(info *PageInfo) ([]byte, error) {
	tmpl, err := template.Get("site")
	if err != nil {
		return nil, err
	}
	buf := &bytes.Buffer{}
	if err := tmpl.Execute(buf, info); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func serveDevPage(w http.ResponseWriter, r *http.Request) {
	page := pat.Param(r, "page")
	data, err := ioutil.ReadFile("page/" + page + ".md")
	if err != nil {
		if os.IsNotExist(err) {
			http.NotFound(w, r)
			return
		}
		web.InternalServerError(w, err)
		return
	}
	out, err := renderPage(data)
	if err != nil {
		web.InternalServerError(w, fmt.Errorf("failed to process page %q: %s", page, err))
		return
	}
	w.Write(out)
}

func servePage(w http.ResponseWriter, r *http.Request) {
	page := pat.Param(r, "page")
	content, ok := pages[page]
	if !ok {
		http.NotFound(w, r)
		return
	}
	w.Write(content)
}

func init() {
	if web.IsDev {
		return
	}
	root := "page"
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if !strings.HasSuffix(path, ".md") {
			return nil
		}
		filename := filepath.Base(path)
		page := filename[:len(filename)-3]
		data, err := ioutil.ReadFile(path)
		out, err := renderPage(data)
		if err != nil {
			return fmt.Errorf("failed to process page %q: %s", path, err)
		}
		pages[page] = out
		return nil
	})
	if err != nil {
		log.Fatalf("Unable to init site pages: %s", err)
	}
}
