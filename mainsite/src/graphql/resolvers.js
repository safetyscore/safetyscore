import validator from 'validator'
import _ from 'lodash'
import bent from 'bent'
import formUrlEncoded from 'form-urlencoded'

import { getDefaultResolvers } from './typedefs'
import { createErrorResponse } from './errors'
import { UNKNOWN, SLACK_ERROR, INVALID_INPUT } from './errorCodes'


const _call = fn => async (root, params, ctx) => {
  try {
    return fn(root, params, ctx)
  } catch (err) {
    return createErrorResponse(err.code || UNKNOWN, err.message)
  }
}


export default ({ config }) => {
  const callSlackApi = bent('https://slack.com/api', 'POST', 'json', 200, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })

  return {
    Query: {
      dummy: _call(async () => {
        return true
      })
    },
    Mutation: {
      requestSlackInvite: _call(async (_ignore, { email }) => {
        if (!validator.isEmail(email)) {
          return createErrorResponse(INVALID_INPUT, 'Email invalid')
        }

        const ret = await callSlackApi('/users.admin.invite', formUrlEncoded({
          token: config.SLACK_TOKEN,
          email,
          resend: true,
        }))

        if (!ret.ok) {
          const errMsg = _.get(ret, 'error')

          if (errMsg === 'already_in_team') {
            return createErrorResponse(SLACK_ERROR, 'Looks like you have already joined!')
          } else {
            return createErrorResponse(SLACK_ERROR, errMsg)
          }
        }

        return { success: true }
      }),
    },
    ...getDefaultResolvers(),
  }
}


