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
import { CreateStripePaymentIntent } from '../src/graphql/mutations'
import { withApollo } from '../src/frontend/hoc'
import { useSafeMutation } from '../src/frontend/hooks'
import Layout from '../src/frontend/components/Layout'
import Seo from '../src/frontend/components/Seo'
import ContentWrapper from '../src/frontend/components/ContentWrapper'
import QueryResult from '../src/frontend/components/QueryResult'
import TextInput from '../src/frontend/components/TextInput'
import ErrorBox from '../src/frontend/components/ErrorBox'
import AlertBox from '../src/frontend/components/AlertBox'
import Button from '../src/frontend/components/Button'

const { STRIPE_PUBLIC_KEY } = getAppConfig()

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

const Container = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'center' })};

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

const Amounts = styled.ul`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'flex-start' })};
`

const Amount = styled.li`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};
  margin: 1rem 0;
  font-size: 1.2rem;
`

const CustomAmountContainer = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};

  input {
    margin-left: 0.3em;
    font-size: 90%;
    padding: 0.2em;
  }
`

const Form = styled.form`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'stretch' })};
  width: 90%;
  max-width: 500px;
  margin-top: 1rem;
`

const CardContainer = styled.div`
  background: ${({ theme }) => theme.fundPageCardEntryBgColor};
  padding: 1rem;
  border-radius: 5px;
`


const PayButton = styled(Button)`
  margin: 1rem auto 0;
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


const CheckoutForm = ({ fetchPaymentIntent, onSuccess, onError, disabled }) => {
  const elements = useElements()
  const stripe = useStripe()

  const handleSubmit = useCallback(async e => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    onError(null)

    try {
      const intent = await fetchPaymentIntent()

      if (!intent) {
        return
      }

      const { clientSecret } = intent

      const ret = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (ret.error) {
        throw ret.error
      } else {
        onSuccess(ret)
      }
    } catch (err) {
      onError(err)
    }
  }, [ elements, stripe ])

  return (
    <Form onSubmit={handleSubmit}>
      <CardContainer>
        <CardElement />
      </CardContainer>
      <PayButton type="submit" disabled={disabled || !stripe}>Pay</PayButton>
    </Form>
  )
}

const FundPage = () => {
  const [finished, setFinished] = useState(false)
  const [stripeError, setStripeError] = useState(null)
  const [amount, setAmount] = useState(AMOUNTS[AMOUNTS.length - 1])
  const [customValue, setCustomValue] = useState('')
  const [doRequest, result] = useSafeMutation(CreateStripePaymentIntent)

  const resetResults = useCallback(() => {
    setFinished(false)
    setStripeError(false)
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
    return !Number.isNaN(amountAsInt) && 1 <= amountAsInt && (amountAsInt % 1 === 0)
  }, [ amountAsInt ])

  const fetchPaymentIntent = useCallback(async () => {
    resetResults()

    const ret = await doRequest({
      variables: {
        payment: {
          amount: amountAsInt,
        }
      }
    })

    return _.get(ret, 'data.result')
  }, [ amountAsInt ])

  const onSuccess = useCallback(() => {
    setFinished(true)
  }, [])

  return (
    <Layout>
      <Seo title='Fund us' />
      <ContentWrapper>
        <Container>
          <H1>Fund us</H1>
          <p>By funding us you will help us to get the app out sooner.</p>
          <Amounts>
            {allAmounts.map((a, idx) => (
              <Amount key={a}>
                <input type="radio" name="amount" checked={amount === a} onClick={selectAmount[idx]} />
                {a === 'custom' ? (
                  <CustomAmountContainer>
                    $<TextInput onChange={setCustomValue} value={customValue} placeholder='Enter an amount' />
                  </CustomAmountContainer>
                ) : (
                  <span>${a}</span>
                )}
              </Amount>
            ))}
          </Amounts>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              fetchPaymentIntent={fetchPaymentIntent}
              onSuccess={onSuccess}
              onError={setStripeError}
              disabled={!isValid}
            />
          </Elements>
          {finished ? (
            <Finished>Thank you for funding us! You wil shortly receive a payment confirmation by email.</Finished>
          ) : null}
          {stripeError ? <ErrorBox error={stripeError} /> : null}
          <StyledQueryResult {...result} hideLoading={true} />
          <PaymentDisclaimer>Payments are handled by <a href="https://stripe.com">Stripe</a>. We never see or store your card info.</PaymentDisclaimer>
        </Container>
      </ContentWrapper>
    </Layout>
  )
}

export default withApollo(FundPage)


