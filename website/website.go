package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/espians/viraltracing/website/asset"
	"github.com/espians/viraltracing/website/frontpage"
	"github.com/espians/viraltracing/website/site"
	"github.com/espians/viraltracing/website/web"
)

func setupHandlers() {
	web.EnsureHost("viraltracing.app")
	asset.RegisterHandlers()
	frontpage.RegisterHandlers()
	site.RegisterHandlers()
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	setupHandlers()
	if web.IsDev {
		log.Printf("Listening on http://localhost:%s\n", port)
	}
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), web.Mux))
}
