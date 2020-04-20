import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import Headroom from 'react-headroom'
import { ThemeProvider } from 'emotion-theming'
import { Themes } from 'emotion-styled-utils'

import GlobalStyles from './GlobalStyles'
import Header, { headerHeight } from './Header'
import THEME from '../theme'

const themes = new Themes({}, {
  width: {
    mobile: '950px',
    desktop: '1280px',
  },
  height: {
    tall: '800px',
  }
})
themes.add('default', THEME)

const Container = styled.div`
  padding: 2rem;
  min-height: calc(100vh - ${headerHeight});
`

const HeaderWrapper = styled.div`
  background: ${({ floating, theme }) => (floating ? theme.headerWrapperFloatingBgColor : theme.headerWrapperBgColor)};
  transition: all 0.3s linear;
`

const Layout = ({ children }) => {
  const [floatingHeader, setFloatingHeader] = useState(false)

  const onHeaderFloat = useCallback(() => {
    setFloatingHeader(true)
  }, [])

  const onHeaderUnfloat = useCallback(() => {
    setFloatingHeader(false)
  }, [])

  return (
    <ThemeProvider theme={themes.get('default')}>
      <GlobalStyles />
      <Headroom onPin={onHeaderFloat} onUnfix={onHeaderUnfloat}>
        <HeaderWrapper floating={!!floatingHeader}>
          <Header />
        </HeaderWrapper>
      </Headroom>
      <Container>{children}</Container>
    </ThemeProvider>
  )
}

export default Layout