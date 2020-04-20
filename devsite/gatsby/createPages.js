const path = require("path")

const { TOC } = require('./toc')

const docsPageTemplate = path.resolve(path.join(__dirname, '..', 'src', 'templates', 'docsPageTemplate.js'))

const _setupRedirects = (node, createRedirect) => {
  if (node.children && node.children.length) {
    createRedirect({ fromPath: `docs${node.urlPath}`, toPath: `docs${node.children[0].urlPath}`, isPermanent: true })
  }
}

module.exports = exports.createPages = async ({ actions, graphql }) => {
  const { createPage, createRedirect } = actions

  // get docs TOC page
  const result = await graphql(`
    {
      allMarkdownRemark(filter: {fields: {urlPath: {ne: "/"}}}) {
        nodes {
          id
          fields {
            next
            prev
            urlPath
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.nodes.forEach(({ id, fields: { urlPath, next, prev } }) => {
    createPage({
      path: `/docs${urlPath}`,
      component: docsPageTemplate,
      context: {
        id,
        nextUrlPath: next,
        prevUrlPath: prev,
      },
    })
  })

  _setupRedirects(TOC, createRedirect)
}