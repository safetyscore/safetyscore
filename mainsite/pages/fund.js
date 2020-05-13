import React, { useMemo, useState, useCallback } from 'react'
import validator from 'validator'
import styled from '@emotion/styled'
import { flex, font, childAnchors } from 'emotion-styled-utils'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

import { getAppConfig } from '../src/frontend/appConfig'
import { CreateStripePaymentIntentMutation, RecordPaymentMutation } from '../src/graphql/mutations'
import { withApollo } from '../src/frontend/hoc'
import { useSafeMutation } from '../src/frontend/hooks'
import Layout from '../src/frontend/components/Layout'
import Seo from '../src/frontend/components/Seo'
import ContentWrapper from '../src/frontend/components/ContentWrapper'
import QueryResult from '../src/frontend/components/QueryResult'
import ErrorBox from '../src/frontend/components/ErrorBox'
import AlertBox from '../src/frontend/components/AlertBox'
import Button from '../src/frontend/components/Button'
import { FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, OutlinedInput, InputAdornment } from '@material-ui/core';
import _ from 'lodash'


const Container = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'flex-start' })};

  p {
    margin: 1rem 0;
  }
`

const H1 = styled.h1``

const PaymentDisclaimer = styled.div`
  margin-top: 3.5rem;
  color: ${({ theme }) => theme.fundPagePaymentDisclaimerTextColor};
  font-size: 0.8rem;

  ${({ theme }) => childAnchors({
    textColor: theme.fundPagePaymentDisclaimerTextColor,
    hoverTextColor: theme.fundPagePaymentDisclaimerTextColor,
  })};

  a {
    ${font('body', 'bold')};
  }
`

const Form = styled.form`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'stretch' })};
  width: 90%;
  max-width: 500px;
  margin-top: 1rem;
`

const CustomAmountFormControl = styled(FormControl)`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'stretch' })};
  && {  max-width: 500px;
        margin-top: 1rem;
  }
`

const CardFormControl = styled(FormControl)`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'stretch' })};
  && {  max-width: 500px;
        margin-top: 1rem;
        background: ${({ theme }) => theme.fundPageCardEntryBgColor};
  }
`

const EmailFormControl = styled(FormControl)`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'stretch' })};
  && {  max-width: 500px;
        margin-top: 1rem;
  }
`

const PayButton = styled(Button)`
  && {  align-self: flex-start;
        margin: 1rem 0 0;
      }
`

const StyledQueryResult = styled(QueryResult)`
  width: 80%;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    max-width: 400px;
  }
`

const Finished = styled(AlertBox)`
  margin: 0.5rem 0;
`

const AMOUNTS = ['5', '10']


const FundPageContent = () => {
  const elements = useElements()
  const stripe = useStripe()

  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [stripeError, setStripeError] = useState(null)
  const [amount, setAmount] = useState(AMOUNTS[AMOUNTS.length - 1])
  const [customValue, setCustomValue] = useState('')
  const [email, setEmail] = useState('')
  const [createStripePaymentIntent, paymentIntentResult] = useSafeMutation(CreateStripePaymentIntentMutation)
  const [recordPayment, recordPaymentResult] = useSafeMutation(RecordPaymentMutation)

  const resetResults = useCallback(() => {
    setFinished(false)
    setStripeError(false)
  }, [])

  const onChangeCustomValue = useCallback(e => {
    setAmount('custom')
    setCustomValue(e.target.value)
  }, [])

  const onChangeEmail = useCallback(e => {
    setEmail(e.target.value)
  }, [])

  const allAmounts = useMemo(() => [...AMOUNTS, 'custom'], [])

  const selectAmount = useMemo(() => {
    return allAmounts.map(a => () => {
      resetResults()
      setAmount(a)
    })
  }, [allAmounts ])

  const amountAsInt = useMemo(() => {
    return parseInt((amount === 'custom' ? customValue : amount), 10)
  }, [ amount, customValue ])

  const isValid = useMemo(() => {
    // must be a non-floating point number >= 1
    let valid = !Number.isNaN(amountAsInt) && 1 <= amountAsInt && (amountAsInt % 1 === 0)
    // email must be valid
    valid = valid && validator.isEmail(email)
    // stripe
    valid = valid && !!stripe && !!elements
    return valid
  }, [ amountAsInt, email, stripe, elements ])

  const handleSubmit = useCallback(async e => {
    e.preventDefault()

    if (!isValid) {
      return
    }

    resetResults()
    setLoading(true)

    try {
      const ret1 = await createStripePaymentIntent({
        variables: {
          payment: {
            email,
            amount: amountAsInt,
          }
        }
      })

      const { clientSecret } = _.get(ret1, 'data.result', {})

      if (!clientSecret) {
        setLoading(false)
        return
      }

      const ret2 = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (ret2.error) {
        throw ret2.error
      } else {
        const ret3 = await recordPayment({ variables: { paymentIntentId: ret2.paymentIntent.id } })

        if (ret3.error) {
          throw ret3.error
        } else {
          setFinished(true)
        }
      }
    } catch (err) {
      setStripeError(err)
    }

    setLoading(false)
  }, [elements, stripe, isValid, amountAsInt, email])

  return (
    <Layout>
      <Seo title='Fund us' />
      <ContentWrapper>
        <Container>
          <H1>Fund us</H1>
          <p>By funding us you will help us to get the app out sooner.</p>
          <Form onSubmit={handleSubmit}>
          <RadioGroup aria-label='Amounts' value={amount}>
            {allAmounts.map((a, idx) => (
            <FormControlLabel key={a} value={a} control={<Radio />} label={!!isNaN(a) ? a : `$${a}`} onClick={selectAmount[idx]} />
            ))}
          </RadioGroup>
          <CustomAmountFormControl fullWidth variant='outlined'>
            <InputLabel htmlFor="outlined-adornment-amount">Custom Amount</InputLabel>
            <OutlinedInput
              disabled={amount !== 'custom'}
              type='number'
              min='0'
              id='outlined-adornment-amount'
              value={customValue}
              onChange={onChangeCustomValue}
              placeholder='Enter an amount'
              startAdornment={<InputAdornment position='start'>$</InputAdornment>}
              labelWidth={120}
            />
          </CustomAmountFormControl>
          <CardFormControl fullWidth variant='outlined'>
              <InputLabel htmlFor="outlined-adornment-card">Your card details</InputLabel>
              <OutlinedInput
                id='outlined-adornment-card'
                labelWidth={160}
                inputComponent={CardElement}
              />
            </CardFormControl>
            <EmailFormControl fullWidth variant='outlined'>
              <InputLabel htmlFor="outlined-adornment-email">Your email address</InputLabel>
              <OutlinedInput
                id='outlined-adornment-email'
                type='email'
                value={email}
                onChange={onChangeEmail}
                placeholder='Enter your email...'
                labelWidth={160}
              />
            </EmailFormControl>
            <PayButton type="submit" disabled={!isValid} loading={loading}>Pay</PayButton>
          </Form>
          {finished ? (
            <Finished>Thank you for funding us! You wil shortly receive a payment confirmation by email.</Finished>
          ) : null}
          {stripeError ? <ErrorBox error={stripeError} /> : null}
          <StyledQueryResult {...paymentIntentResult} hideLoading={true} />
          <StyledQueryResult {...recordPaymentResult} hideLoading={true} />
          <PaymentDisclaimer>Payments are handled by <a href="https://stripe.com">Stripe</a>. We never see or store your card info.</PaymentDisclaimer>
        </Container>
      </ContentWrapper>
    </Layout>
  )
}

const { STRIPE_PUBLIC_KEY } = getAppConfig()

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

const FundPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <FundPageContent />
    </Elements>
  )
}

export default withApollo(FundPage)


