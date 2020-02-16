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
        // target: `http://${require('ip').address()}:5000/`
      }
    }
  },
  transpileDependencies: [
    /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/
  ],
  configureWebpack: {
    plugins: [
      // CKEditor needs its own plugin to be built using webpack.
      new CKEditorWebpackPlugin({
        // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
        language: 'ko'
      })
    ]
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
    // CKE Loader
    config.module
      .rule('cke-svg')
      .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
      .use('raw-loader')
      .loader('raw-loader')

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

    // SVG Loader
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'))
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}
