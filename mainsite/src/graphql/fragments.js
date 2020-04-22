import gql from 'graphql-tag'

export const ErrorFragment = gql`
  fragment ErrorFragment on Error {
    error {
      code
      message
    }
  }
`


export const SuccessFragment = gql`
  fragment SuccessFragment on Success {
    success
  }
`


export const RequestSlackInviteResultFragment = gql`
  ${SuccessFragment}
  ${ErrorFragment}

  fragment RequestSlackInviteResultFragment on RequestSlackInviteResult {
    ...on Success {
      ...SuccessFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`


export const StripePaymentIntentFragment = gql`
  fragment StripePaymentIntentFragment on StripePaymentIntent {
    clientSecret
  }
`


export const CreateStripePaymentIntentFragment = gql`
  ${StripePaymentIntentFragment}
  ${ErrorFragment}

  fragment CreateStripePaymentIntentFragment on CreateStripePaymentIntentResult {
    ...on StripePaymentIntent {
      ...StripePaymentIntentFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`
