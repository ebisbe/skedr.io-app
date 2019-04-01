import { InMemoryCache } from 'apollo-cache-inmemory/lib/index'
import { HttpLink } from 'apollo-link-http/lib/index'
import { setContext } from 'apollo-link-context'
import { ApolloClient } from 'apollo-client/index'
import VueApollo from 'vue-apollo'
import Vue from 'vue'
import Auth from '@aws-amplify/auth'
import exports from './aws-exports'
const uri = exports.aws_appsync_graphqlEndpoint

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri
})

const authLink = setContext(async (_, { headers }) => {
  const token = (await Auth.currentAuthenticatedUser()).signInUserSession.accessToken.jwtToken
  return {
    headers: {
      ...headers,
      authorization: token ? token : ''
    }
  }
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      loadingKey: 'loading',
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  }
})

// Install the vue plugin
Vue.use(VueApollo)

export default apolloProvider
