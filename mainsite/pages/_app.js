import React from 'react'
import App from 'next/app'
import Router from 'next/router'
import { ThemeProvider } from 'emotion-theming'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import GlobalStyles from '../src/frontend/components/GlobalStyles'
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles'
import { setupThemes } from '../src/frontend/theme'

// always scroll to top on route change
Router.events.on('routeChangeComplete', () => { window.scrollTo(0, 0) })

const themes = setupThemes({
  width: {
    mobile: '950px',
    desktop: '1280px',
  },
  height: {
    tall: '800px',
  }
})

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props

    return (
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={themes.get('muiTheme')}>
          <ThemeProvider theme={themes.get('default')}>
            <GlobalStyles />
            <ToastContainer
              autoClose={3000}
              closeButton={false}
              draggable={false}
              hideProgressBar={true}
              pauseOnFocusLoss={false}
              newestOnTop={true}
              closeOnClick={true}
            />
            <Component {...pageProps} />
          </ThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    )
  }
}
