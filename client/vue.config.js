module.exports = {
  outputDir: '../server/dist',
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/api*': {
        // target: `http://${require('ip').address()}:5000/`
        target: `http://localhost:5000/`
      }
    }
  },
  runtimeCompiler: true,
}
