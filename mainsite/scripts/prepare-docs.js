#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')

const SRC_FOLDER = path.resolve(path.join(__dirname, '..', '..', 'docs', 'whitepaper'))
const DST_FOLDER = path.resolve(path.join(__dirname, '..', 'docs', 'whitepaper'))

async function init () {
  fs.mkdirpSync(DST_FOLDER)

  console.log('Copying over images ...')

  fs.emptyDirSync(DST_FOLDER)
  fs.copySync(path.join(SRC_FOLDER, 'image'), DST_FOLDER)

  console.log('Construct index.js ...')

  let str = glob.sync(path.join(DST_FOLDER, '*.*')).map(f => {
    const n = path.basename(f)
    return `"${n}":require('./${n}')`
  }).join(`,\n`)

  str = `exports.images = {\n${str}\n};`

  const md = fs.readFileSync(path.join(SRC_FOLDER, 'whitepaper.md')).toString('utf8')

  str = `${str}; exports.content = \`${md.replace(/`/igm, '\\`')}\`;`

  fs.writeFileSync(path.join(DST_FOLDER, 'index.js'), str, 'utf8')
}

init().catch(err => {
  console.error(chalk.red(err))
  process.exit(-1)
})