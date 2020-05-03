import gql from 'graphql-tag'

import {
  RequestSlackInviteResultFragment,
  CreateStripePaymentIntentFragment,
  RecordPaymentResultFragment,
} from './fragments'


export const RequestSlackInviteMutation = gql`
  ${RequestSlackInviteResultFragment}

  mutation RequestSlackInvite ($email: String!) {
    result: requestSlackInvite (email: $email) {
      ...RequestSlackInviteResultFragment
    }
  }
`

export const CreateStripePaymentIntentMutation = gql`
  ${CreateStripePaymentIntentFragment}

  mutation CreateStripePaymentIntent ($payment: StripePaymentInput!) {
    result: createStripePaymentIntent (payment: $payment) {
      ...CreateStripePaymentIntentFragment
    }
  }
`


export const RecordPaymentMutation = gql`
  ${RecordPaymentResultFragment}

  mutation RecordPayment ($paymentIntentId: String!) {
    result: recordPayment (paymentIntentId: $paymentIntentId) {
      ...RecordPaymentResultFragment
    }
  }
`

