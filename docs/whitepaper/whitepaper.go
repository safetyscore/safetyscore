package main

import (
	"bytes"
	"html/template"
	"io/ioutil"
	"log"

	codefmt "github.com/alecthomas/chroma/formatters/html"
	"github.com/yuin/goldmark"
	code "github.com/yuin/goldmark-highlighting"
	frontmatter "github.com/yuin/goldmark-meta"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

var tmpl = template.Must(template.New("pdf.html").Parse(`<!doctype html>
<meta charset="utf-8">
<div class="blank"></div>
<div id="whitepaper">
<div id="frontpage">
<h1>{{.Title}}</h1>
<div class="authors">{{.Authors}}</div>
<div class="contact"><a href="mailto:{{.Contact}}">{{.Contact}}</a></div>
{{.Content}}
</div>`))

func main() {
	// Convert text to Markdown.
	ctx := parser.NewContext()
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.Typographer,
			extension.Footnote,
			frontmatter.Meta,
			code.NewHighlighting(
				code.WithStyle("monokai"),
				code.WithFormatOptions(
					codefmt.WithClasses(true),
				),
			),
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
			parser.WithHeadingAttribute(),
		),
		goldmark.WithRendererOptions(
			html.WithUnsafe(),
		),
	)
	src, err := ioutil.ReadFile("whitepaper.md")
	if err != nil {
		log.Fatalf("Unable to read whitepaper.md: %s", err)
	}
	buf := &bytes.Buffer{}
	if err := md.Convert(src, buf, parser.WithContext(ctx)); err != nil {
		log.Fatalf("Unable to process whitepaper.md: %s", err)
	}
	// Generate pdf.html
	meta := frontmatter.Get(ctx)
	wbuf := &bytes.Buffer{}
	if tmpl.Execute(wbuf, map[string]interface{}{
		"Authors": meta["authors"],
		"Contact": meta["contact"],
		"Content": template.HTML(buf.String()),
		"Title":   meta["title"],
	}); err != nil {
		log.Fatalf("Unable to generate pdf.html: %s", err)
	}
	if err := ioutil.WriteFile("pdf.html", wbuf.Bytes(), 0644); err != nil {
		log.Fatalf("Unable to write pdf.html: %s", err)
	}
}
