import _ from 'lodash'

import { middleware as ErrorMiddleware } from './error'

export const createMiddlewareWrapper = args => endpoint => {
  return _.flowRight(
    ErrorMiddleware(args),
  )(endpoint)
}
