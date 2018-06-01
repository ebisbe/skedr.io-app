module.exports = {
  chainWebpack: config => {
    config.module
      .rule('gql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag')
      .loader('graphql-tag/loader')
  }
}
