const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SentryPlugin = require('@sentry/webpack-plugin')

const plugins = [new ContextReplacementPlugin(/moment[/\\]locale$/, /en/)]

const { NODE_ENV, npm_config_report, COMMIT_REF } = process.env
if (npm_config_report) {
  plugins.push(new BundleAnalyzerPlugin())
}
if (NODE_ENV === 'production' && COMMIT_REF) {
  plugins.push(
    new SentryPlugin({
      release: COMMIT_REF,
      include: './dist'
    })
  )
  process.env.VUE_APP_REVISION = COMMIT_REF
}

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
  },
  devServer: {
    host: 'localhost'
  }
}
