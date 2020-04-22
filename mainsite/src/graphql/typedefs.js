import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'
import gql from 'graphql-tag'

export const getTypeDefs = () => gql`
  scalar DateTime
  scalar JSON

  type ErrorDetails {
    code: String
    message: String
  }

  type Error {
    error: ErrorDetails
  }

  type Success {
    success: Boolean
  }

  type StripePaymentIntent {
    clientSecret: String!
  }

  input StripePaymentInput {
    amount: Int!
    email: String!
  }

  union RequestSlackInviteResult = Success | Error
  union CreateStripePaymentIntentResult = StripePaymentIntent | Error

  type Mutation {
    requestSlackInvite (email: String!): RequestSlackInviteResult!
    createStripePaymentIntent (payment: StripePaymentInput!): CreateStripePaymentIntentResult!
  }

  type Query {
    dummy: Boolean
  }
`

const UNIONS = [
  [ 'RequestSlackInviteResult', 'Success' ],
  [ 'CreateStripePaymentIntentResult', 'StripePaymentIntent' ],
]

export const getFragmentMatcherConfig = () => ({
  __schema: {
    types: UNIONS.map(([ ResultTypeDef, SuccessTypeDef ]) => ({
      kind: 'UNION',
      name: ResultTypeDef,
      possibleTypes: [
        {
          name: SuccessTypeDef
        },
        {
          name: 'Error'
        },
      ]
    }))
  }
})


export const getDefaultResolvers = () => ({
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  ...UNIONS.reduce((m, [ ResultTypeDef, SuccessTypeDef ]) => {
    m[ResultTypeDef] = {
      __resolveType: ({ error }) => {
        return error ? 'Error' : SuccessTypeDef
      }
    }
    return m
  }, {}),
})



