#! /usr/bin/env bash

FILENAME=safetyscore-draft-v0.0.6.pdf

go run whitepaper.go
prince -s pdf.css pdf.html -o ${FILENAME}
pdfcpu pages remove -pages 1 ${FILENAME}
