module.exports = {
  outputDir: '../server/dist',
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/api*': {
        target: `http://${require('ip').address()}:5000/`
        // target: `http://${require('ip').address()}:5000/`
      }
    }
  },
  runtimeCompiler: true,
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
    // SVG Loader
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}
