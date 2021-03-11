import exports from './aws-exports'
const uri = exports.aws_appsync_graphqlEndpoint

import Vue from 'vue'

import AWSAppSyncClient from 'aws-appsync'
import VueApollo from 'vue-apollo'
import { Auth } from 'aws-amplify'
import { InMemoryCache } from 'apollo-cache-inmemory/lib/index'

const config = {
  disableOffline: true,
  url: uri,
  region: 'eu-west-1',
  auth: {
    type: 'AMAZON_COGNITO_USER_POOLS',
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  cacheOptions: {
    dataIdFromObject: object => {
      switch (object.__typename) {
        case 'GroupTag':
          return `${object.userId}-${object.groupId}`
        case 'ScheduledPhoto':
          return `${object.groupId}-${object.photoId}`
        default:
          return object.id || object._id
      }
    }
  }
}
const options = {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
}

const client = new AWSAppSyncClient(config, options)

const apolloProvider = new VueApollo({
  defaultClient: client
})

Vue.use(VueApollo)

export default apolloProvider
