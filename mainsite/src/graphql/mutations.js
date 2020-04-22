import gql from 'graphql-tag'

import {
  RequestSlackInviteFragment,
} from './fragments'


export const RequestSlackInviteMutation = gql`
  ${RequestSlackInviteFragment}

  mutation RequestSlackInvite ($email: String!) {
    result: requestSlackInvite (email: $email) {
      ...RequestSlackInviteFragment
    }
  }
`

