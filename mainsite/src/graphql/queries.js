import gql from 'graphql-tag'

import {
  FundBalanceResultFragment,
} from './fragments'


export const GetFundBalanceQuery = gql`
  ${FundBalanceResultFragment}

  query GetFundBalance {
    result: getFundBalance {
      ...FundBalanceResultFragment
    }
  }
`

