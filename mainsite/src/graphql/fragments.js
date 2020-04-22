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


export const RequestSlackInviteFragment = gql`
  ${SuccessFragment}
  ${ErrorFragment}

  fragment RequestSlackInviteFragment on RequestSlackInviteResult {
    ...on Success {
      ...SuccessFragment
    }
    ...on Error {
      ...ErrorFragment
    }
  }
`