import { InMemoryCache } from 'apollo-cache-inmemory/lib/index'
import { HttpLink } from 'apollo-link-http/lib/index'
import { ApolloClient } from 'apollo-client/index'
import VueApollo from 'vue-apollo'
import Vue from 'vue'

import exports from './aws-exports'
const uri = exports.aws_cloud_logic_custom.filter(({ name }) => name === process.env.VUE_APP_API_NAME).pop().endpoint

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: uri + '/graphql'
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

// Install the vue plugin
Vue.use(VueApollo)

export default apolloProvider
