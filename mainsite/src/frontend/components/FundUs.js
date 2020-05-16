import React, { useMemo } from 'react'
import _ from 'lodash'
import styled from '@emotion/styled'
import { useTheme } from 'emotion-theming'
import { flex } from 'emotion-styled-utils'
import FundProgressBar from './FundProgressBar'

import { useSafeQuery } from '../hooks'
import { GetFundBalanceQuery } from '../../graphql/queries'
import Button from './Button'
import { FundLink } from './Link'

const Container = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center' })};
  background: ${({ theme }) => theme.fundUsBgColor};
  width: 100%;
  min-height: 60px;
  padding: 1rem 0;
`

const StyledButton = styled(Button)`
  font-size: 1.4rem;
  padding: 0.7rem 0.9rem;
`

const FundUs = ({ className }) => {
  const theme = useTheme()
  const query = useSafeQuery(GetFundBalanceQuery, { fetchPolicy: 'cache-and-network' })
  const raised = useMemo(() => _.get(query, 'data.result.amount', 0), [ _.get(query, 'data.result.amount') ])

  return (
    <Container className={className}>
      <FundProgressBar current={raised} target={1000000}/>
      <FundLink><StyledButton>FUND US</StyledButton></FundLink>
    </Container>
  )
}

export default FundUs
