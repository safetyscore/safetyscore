const envalid = require('envalid')

const { str, num, bool } = envalid

const VARS = {
  APP_MODE: str({ default: 'development' }),
  SUPPORT_EMAIL: str({ default: 'support@safetyscore.app' }),
  STRIPE_PUBLIC_KEY: str(),
  STRIPE_PRIVATE_KEY: str(),
  SLACK_TOKEN: str(),
}

const allEnv = envalid.cleanEnv(process.env, VARS, {
  dotEnvPath: (process.env.NODE_ENV === 'production' ? '.env.live' : '.env')
})

const env = Object.keys(VARS).reduce((m, k) => {
  m[k] = allEnv[k]
  return m
}, {})

// eslint-disable-next-line import/no-dynamic-require
const modeConfig = require(`./${env.APP_MODE}`)

module.exports = Object.freeze({
  ...modeConfig,
  ...env,
})


