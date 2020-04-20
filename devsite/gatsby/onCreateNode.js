const path = require('path')
const { DEVSITE_DOCS_DIR } = require('./constants')

const { TOC, findMatchingNode } = require('./toc')

module.exports = exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    if (node.fileAbsolutePath.startsWith(DEVSITE_DOCS_DIR)) {
      const urlPath = path.dirname(node.fileAbsolutePath.substr(DEVSITE_DOCS_DIR.length))

      createNodeField({
        node,
        name: `urlPath`,
        value: urlPath,
      })

      if (urlPath !== '/') {
        const { current, prev, next } = findMatchingNode(TOC, urlPath, 'urlPath')

        // only if it was specified in the TOC do the rest...
        if (current) {
          createNodeField({
            node,
            name: `title`,
            value: current.title,
          })

          createNodeField({
            node,
            name: `next`,
            value: next ? next.urlPath : '',
          })

          createNodeField({
            node,
            name: `prev`,
            value: prev ? prev.urlPath : '',
          })
        }
      }
    }
  }
}