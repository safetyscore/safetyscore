import validator from 'validator'
import setupStripe from 'stripe'
import _ from 'lodash'
import bent from 'bent'
import formUrlEncoded from 'form-urlencoded'

import { getDefaultResolvers } from './typedefs'
import { createErrorResponse } from './errors'
import { UNKNOWN, SLACK_ERROR, INVALID_INPUT, STRIPE_ERROR } from './errorCodes'


const _call = fn => async (root, params, ctx) => {
  try {
    return fn(root, params, ctx)
  } catch (err) {
    return createErrorResponse(err.code || UNKNOWN, err.message)
  }
}


export default ({ config }) => {
  const slackApi = bent('https://slack.com/api', 'POST', 'json', 200, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })

  const stripe = setupStripe(config.STRIPE_PRIVATE_KEY)

  return {
    Query: {
      getFundBalance: _call(async () => {
        return {
          amount: 210000
        }
      })
    },
    Mutation: {
      createStripePaymentIntent: _call(async (_ignore, { payment }) => {
        const amount = _.get(payment, 'amount')

        try {
          if (!amount) {
            return createErrorResponse(INVALID_INPUT, 'Invalid amount')
          }

          const { client_secret: clientSecret } = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            description: 'SafetyScore - Getting the World out of Lockdown.',
            receipt_email: payment.email,
          })

          return {
            clientSecret
          }
        } catch (err) {
          return createErrorResponse(STRIPE_ERROR, err.message)
        }
      }),
      requestSlackInvite: _call(async (_ignore, { email }) => {
        if (!validator.isEmail(email)) {
          return createErrorResponse(INVALID_INPUT, 'Email invalid')
        }

        const ret = await slackApi('/users.admin.invite', formUrlEncoded({
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


