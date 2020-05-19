#! /usr/bin/env bash

FILENAME=safetyscore-draft-`date "+%Y-%m-%d"`.pdf

go run whitepaper.go
prince --javascript --script toc.js --style pdf.css pdf.html -o ${FILENAME}
pdfcpu pages remove -pages 1 ${FILENAME}
open $FILENAME
