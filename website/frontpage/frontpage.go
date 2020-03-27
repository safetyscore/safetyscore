package frontpage

import (
	"net/http"

	"github.com/espians/viraltracing/website/site"
	"github.com/espians/viraltracing/website/web"
)

// RegisterHandlers registers package-specific handlers on the root Mux.
func RegisterHandlers() {
	web.HandleGet("/", handle)
}

func handle(w http.ResponseWriter, r *http.Request) {
	site.Render(w, &site.PageInfo{
		Title: "Contain the virus. Not people",
	})
}
