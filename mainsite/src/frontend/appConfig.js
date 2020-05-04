/* eslint-disable no-undef */
export const isBrowser = !!process.browser

export const getAppConfig = () => ({
  // NOTE: next.js env var processor requires us to write "process.env.<...>" syntax in full
  APP_MODE: (isBrowser ? window.appConfig.APP_MODE : process.env.APP_MODE),
  SUPPORT_EMAIL: (isBrowser ? window.appConfig.SUPPORT_EMAIL : process.env.SUPPORT_EMAIL),
  STRIPE_PUBLIC_KEY: (isBrowser ? window.appConfig.STRIPE_PUBLIC_KEY : process.env.STRIPE_PUBLIC_KEY),
})

export const isProduction = () => (getAppConfig().APP_MODE === 'live')
