const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SentryPlugin = require('@sentry/webpack-plugin')

const plugins = [
  new ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  new SentryPlugin({
    release: process.env.COMMIT_REF,
    include: './dist'
  })
]

if (process.env.npm_config_report) {
  plugins.push(new BundleAnalyzerPlugin())
}
if (process.env.COMMIT_REF) {
  process.env.VUE_APP_REVISION = process.env.COMMIT_REF
}

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
plugins.push(new VuetifyLoaderPlugin())

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('gql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag')
      .loader('graphql-tag/loader')
  },
  configureWebpack: {
    plugins,
    devtool: 'source-map',
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all'
      }
    }
  }
}
