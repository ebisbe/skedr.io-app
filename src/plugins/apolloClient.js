import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import 'unfetch/polyfill'
import { Auth } from 'aws-amplify'
import exports from './aws-exports'

const httpLink = createHttpLink({
  uri: exports.aws_appsync_graphqlEndpoint
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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    $query: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  }
})

export default client
