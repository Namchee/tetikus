const path = require('path');

module.exports = {
  css: {
    extract: false,
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      }
    }
  }
}