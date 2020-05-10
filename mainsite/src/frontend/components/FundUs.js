import React, { useMemo } from 'react'
import _ from 'lodash'
import { Line as ProgressLine } from 'rc-progress'
import styled from '@emotion/styled'
import { useTheme } from 'emotion-theming'
import { flex } from 'emotion-styled-utils'

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

const ProgressContainer = styled.div`
  ${flex({ direction: 'column', justify: 'space-between', align: 'flex-start', basis: 0 })};
  margin-right: 2rem;
  p {
    margin-top: 20px;
  }
`

const StyledProgressLine = styled(ProgressLine)`
  width: 150px;
  height: 10px;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    width: 300px;
  }
`

const StyledButton = styled(Button)`
  && { font-size: 1.6rem;
  padding: 0.6rem 0.8rem;
  }
`

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatCurrency = v => {
  const r = currencyFormatter.format(v)
  return r.substr(0, r.length - 3)
}

const FundUs = ({ className }) => {
  const theme = useTheme()
  const query = useSafeQuery(GetFundBalanceQuery, { fetchPolicy: 'cache-and-network' })
  const raised = useMemo(() => _.get(query, 'data.result.amount', 0), [ _.get(query, 'data.result.amount') ])
  const formattedUsd = useMemo(() => formatCurrency(raised / 100), [ raised ])

  return (
    <Container className={className}>
      <ProgressContainer>
        <StyledProgressLine
          percent={~~(raised / 360000000 /* 3.6m USD */ * 100)}
          strokeWidth="2"
          strokeColor={theme.fundUsProgressBarProgressColor}
        />
        <p>{formattedUsd} raised</p>
      </ProgressContainer>
      <FundLink><StyledButton>Fund Us</StyledButton></FundLink>
    </Container>
  )
}

export default FundUs
