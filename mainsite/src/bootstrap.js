import config from './config'
import { createMiddlewareWrapper } from './middleware'

export const doBootstrap = () => {
  const wrapMiddleware = createMiddlewareWrapper({ config })

  process.on('uncaughtExceptions', error => {
    console.error('Uncaught exception', error)
  })

  process.on('unhandledRejection', (reason, location) => {
    console.error(`Unhandled Rejection`, reason, location)
  })

  return { config, wrapMiddleware }
}
