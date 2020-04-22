import React from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import Button from './Button'
import { FundLink } from './Link'

const Container = styled.div`
  ${flex({ direction: 'row', justify: 'center', align: 'center' })};
  background: ${({ theme }) => theme.fundUsBgColor};
  width: 100%;
  min-height: 60px;
  padding: 1rem 0;

  p {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
`

const StyledButton = styled(Button)`
  font-size: 1.6rem;
  padding: 0.6rem 0.8rem;
`

const FundUs = ({ className }) => {
  return (
    <Container className={className}>
      <p>You can help to fund our efforts!</p>
      <FundLink><StyledButton>Donate</StyledButton></FundLink>
    </Container>
  )
}

export default FundUs
