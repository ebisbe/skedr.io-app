import exports from './aws-exports'
const uri = exports.aws_appsync_graphqlEndpoint

import Vue from 'vue'

import AWSAppSyncClient from 'aws-appsync'
import { createAppSyncLink } from 'aws-appsync'
import VueApollo from 'vue-apollo'
import { Auth } from 'aws-amplify'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory/lib/index'

const fetcher = (...args) => {
  return window.fetch(...args)
}

const config = {
  //Solves doble update on mutations
  disableOffline: true,
  region: 'eu-west-1',
  auth: {
    type: 'AMAZON_COGNITO_USER_POOLS',
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  complexObjectsCredentials: async () => await Auth.currentCredentials(),
  resultsFetcherLink: createHttpLink({
    uri: uri,
    fetch: fetcher
  })
}

const client = new AWSAppSyncClient(
  {},
  {
    link: createAppSyncLink(config)
    // cache: new InMemoryCache({
    //   dataIdFromObject: object => {
    //     switch (object.__typename) {
    //       case 'GroupTag':
    //         return `${object.userId}-${object.groupId}`
    //       case 'ScheduledPhoto':
    //         return `${object.groupId}-${object.photoId}`
    //       default:
    //         return object.id || object._id
    //     }
    //   }
    // })
  }
)

const apolloProvider = new VueApollo({
  defaultClient: client,
  defaultOptions: {
    $query: {
      fetchPolicy: 'cache-and-network'
    }
  }
})

// Install the vue plugin
Vue.use(VueApollo)

export default apolloProvider
