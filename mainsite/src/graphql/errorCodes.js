export const UNKNOWN = 'UNKNOWN'
export const INVALID_INPUT = 'INVALID_INPUT'
export const SLACK_ERROR = 'SLACK_ERROR'
export const STRIPE_ERROR = 'STRIPE_ERROR'
export const FIRESTORE_ERROR = 'FIRESTORE_ERROR'

export const messages = {
  [UNKNOWN]: 'There was an unexpected error',
  [INVALID_INPUT]: 'Invalid input',
  [SLACK_ERROR]: 'Slack returned an error',
  [FIRESTORE_ERROR]: 'Firestore returned an error',
}
