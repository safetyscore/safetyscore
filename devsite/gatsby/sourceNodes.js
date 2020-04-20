const { TOC } = require('./toc')

module.exports = exports.sourceNodes = ({ actions, createContentDigest }) => {
  const { createNode } = actions

  const content = JSON.stringify(TOC)

  createNode({
    id: `docs-toc`,
    parent: null,
    children: [],
    content,
    internal: {
      type: `toc`,
      mediaType: `application/json`,
      content,
      contentDigest: createContentDigest(content)
    }
  })
}
