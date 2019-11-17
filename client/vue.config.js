module.exports = {
  outputDir: '../server/dist',
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/api*': {
        target: 'http://localhost:5000/'
      }
    }
  }
}
