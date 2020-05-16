import React from 'react'
import PropTypes from 'prop-types'
import { useSpring, animated } from 'react-spring'
import styled from '@emotion/styled'

const Main = styled.div`
    position: relative;
    width: 50%;
    max-width: 300px;
    height: 48px;
    background: ${({ theme }) => theme.fundUsProgressBarProgressBackgroundColor};
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid white;
    overflow: hidden;
    margin-right: 1rem;
  `
  
  const Fill = styled(animated.div)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.fundUsProgressBarProgressColor};
`
  
const Content = styled(animated.div)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
  `

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatCurrency = v => {
    const r = currencyFormatter.format(v)
    return r.substr(0, r.length - 3)
}

const FundProgressBar = ({target, current}) => {
  const props = useSpring({ width: `${(current / target) * 100}%`,
    from: {width: `0%`}, 
    config: {tension: 100, friction: 100, precision: 0.01}})

  return (
    <Main>
      <Fill style={props} />
      <Content>{props.width.interpolate(x => 
        `${formatCurrency(~~((parseFloat(x) / 100) * target))} raised`)}
      </Content>
    </Main>
  )
}

FundProgressBar.propTypes = {
    target: PropTypes.number,
    current: PropTypes.number
}

export default FundProgressBar