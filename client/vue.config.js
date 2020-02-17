const path = require('path')
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin')
const { styles } = require('@ckeditor/ckeditor5-dev-utils')

module.exports = {
  outputDir: '../server/dist',
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/api*': {
        target: `http://${require('ip').address()}:5000/`
      },
      '/playground*': {
        target: `http://${require('ip').address()}:455/`
      }
    }
  },
  transpileDependencies: [
    /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/
  ],
  configureWebpack: {
    plugins: [
      new CKEditorWebpackPlugin({
        language: 'ko'
      })
    ]
  },
  runtimeCompiler: true,
  chainWebpack: config => {
    // SVG Loader
    config.module
      .rule('cke-svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.exclude.add(path.join(__dirname, '..', 'node_modules', '@ckeditor'))
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()

    config.module
      .rule('cke-css')
      .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
      .use('postcss-loader')
      .loader('postcss-loader')
      .tap(() => {
        return styles.getPostCssConfig({
          themeImporter: {
            themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
          },
          minify: true
        })
      })

    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
  }
}
