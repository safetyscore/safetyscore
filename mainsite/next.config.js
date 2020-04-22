const withImages = require('next-images')

module.exports = withImages({
  env: require('./src/config')
})