import gql from 'graphql-tag'

import {
  RequestSlackInviteResultFragment,
  CreateStripePaymentIntentFragment,
} from './fragments'


export const RequestSlackInviteMutation = gql`
  ${RequestSlackInviteResultFragment}

  mutation RequestSlackInvite ($email: String!) {
    result: requestSlackInvite (email: $email) {
      ...RequestSlackInviteResultFragment
    }
  }
`

export const CreateStripePaymentIntent = gql`
  ${CreateStripePaymentIntentFragment}

  mutation CreateStripePaymentIntent ($payment: StripePaymentInput!) {
    result: createStripePaymentIntent (payment: $payment) {
      ...CreateStripePaymentIntentFragment
    }
  }
`

