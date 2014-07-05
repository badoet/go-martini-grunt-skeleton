package main

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
)

func main() {
	// routing
	goji.Get("/", IndexPage)
	goji.Get("/echo/:name", hello)

	//serve static file from public folder
	goji.Get("/*", http.FileServer(http.Dir("./public")))

	defer goji.Serve()
}

func IndexPage(w http.ResponseWriter, r *http.Request) {
	if t, err := template.ParseFiles("public/index.html"); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		t.Execute(w, nil)
	}
}

func hello(c web.C, w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, %s!", c.URLParams["name"])
}
