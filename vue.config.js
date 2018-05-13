// process.env.BOOK_DEV = true
// const webpack = require('webpack')
module.exports = {
  lintOnSave: true,
  devServer: {
    port: process.env.PORT || 8000
  }
}