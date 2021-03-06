import { ApolloClient } from 'apollo-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { makeExecutableSchema } from 'graphql-tools'

import { getTypeDefs, getFragmentMatcherConfig } from './typedefs'
import createLinks from './links'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: getFragmentMatcherConfig()
})

export const createSchema = resolvers => {
  return makeExecutableSchema({
    typeDefs: getTypeDefs(),
    resolvers,
  })
}

export const createApolloClient = ({ endpoint, name, initialState = {} }) => {
  const cache = new InMemoryCache({ fragmentMatcher }).restore(initialState)

  const client = new ApolloClient({
    name,
    cache,
    typeDefs: getTypeDefs(),
    link: createLinks({ cache, endpoint }),
  })

  return client
}
