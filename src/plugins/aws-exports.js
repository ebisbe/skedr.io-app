const awsmobile = {
  aws_cloud_logic: 'enable',
  aws_cloud_logic_custom: [
    {
      id: process.env.VUE_APP_API_ID,
      name: 'production-skedr-api',
      description: '',
      endpoint: `https://${process.env.VUE_APP_API_ID}.execute-api.eu-west-1.amazonaws.com/${
        process.env.VUE_APP_STAGE
      }`,
      region: 'eu-west-1',
      paths: ['/oauth', '/oauth/callback', '/oauth/user']
    },
    {
      name: 'test',
      endpoint: 'http://localhost:1337'
    }
  ],
  aws_project_id: '1bc53697-6f29-4e1f-a894-60ab870247a3',
  aws_project_name: 'skedr.io-dev',
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id: process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: 'eu-west-1',
  aws_user_pools: 'enable',
  aws_user_pools_id: process.env.VUE_APP_POOL_ID,
  aws_user_pools_web_client_id: process.env.VUE_APP_POOL_WEB_CLIENT_ID,
  aws_appsync_graphqlEndpoint: `https://${process.env.VUE_APP_APPSYNC}.appsync-api.eu-west-1.amazonaws.com/graphql`
}

export default awsmobile
