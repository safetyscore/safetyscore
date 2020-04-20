const fs = require('fs-extra')
const path = require('path')
const unified = require('unified')
const markdown = require('remark-parse')

const { DEVSITE_DOCS_DIR } = require('./constants')

const _readFile = f => {
  if (!fs.existsSync(f)) {
    throw new Error(`File not found: ${f}`)
  }

  return fs.readFileSync(f).toString('utf8')
}

const _getItemChild = (item, t) => (item.children || []).find(({ type }) => type === t)

const _getItemTitle = item => {
  return item.children[0].children[0].value
}

const _getItemPath = item => {
  const r = item.children[0].url
  return r.startsWith('./') ? r.substr(1) : r
}

const _constructTocItemForDocPage = item => {
  const title = _getItemTitle(item)
  const urlPath = _getItemPath(item)
  const contentExists = fs.existsSync(path.join(DEVSITE_DOCS_DIR, urlPath, 'README.md'))

  return {
    title,
    // page only accessible if there is content, otherwise see below...
    urlPath: contentExists ? urlPath : null,
  }
}

const _processList = list => {
  const finalRet = []

  list.forEach(topLevelItem => {
    const titleItem = _getItemChild(topLevelItem, 'paragraph')
    const ret = _constructTocItemForDocPage(titleItem)

    const sublist = _getItemChild(topLevelItem, 'list')
    if (sublist) {
      ret.children = _processList(sublist.children)
      // ...it's URL will be that of it's closest descendant which has content
      if (!ret.urlPath) {
        ret.urlPath = ret.children[0].urlPath
      }
    }

    finalRet.push(ret)
  })

  return finalRet
}

const { children: [{ children: list }] } = unified()
  .use(markdown, { commonmark: true })
  .parse(_readFile(path.join(DEVSITE_DOCS_DIR, 'README.md')))

exports.TOC = { children: _processList(list) }

const DEFAULT_MATCHER = (h, n) => h === n

exports.findMatchingNode = (tree, needle, prop, matcher = DEFAULT_MATCHER) => {
  let ret = {
    current: null, prev: null, next: null,
  }

  if (!tree) {
    return ret
  }

  // could it be this one? we'll still check the children since
  // some parents have a urlPath equal to their descendants (see above)
  const couldBeThisOne = (tree[prop] && matcher(tree[prop], needle, tree))

  if (tree.children) {
    tree.children.find((a, index) => {
      ret = exports.findMatchingNode(a, needle, prop, matcher)

      if (ret.current) {
        if (!ret.prev) {
          if (0 < index) {
            ret.prev = tree.children[index - 1]
          }
        }

        if (!ret.next) {
          if (tree.children.length - 1 > index) {
            ret.next = tree.children[index + 1]
          }
        }
      }

      return (!!ret.current)
    })
  }

  // it wasn't a descendant and it could be this one -> so it MUST be this one
  if (!ret.current && couldBeThisOne) {
    ret.current = tree
  }

  return ret
}
