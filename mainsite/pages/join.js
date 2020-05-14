import React, { useState, useCallback } from 'react'
import validator from 'validator'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import { RequestSlackInviteMutation } from '../src/graphql/mutations'
import { withApollo } from '../src/frontend/hoc'
import { useSafeMutation } from '../src/frontend/hooks'
import Layout from '../src/frontend/components/Layout'
import Image from '../src/frontend/components/Image'
import Seo from '../src/frontend/components/Seo'
import FundUs from '../src/frontend/components/FundUs'
import ContentWrapper from '../src/frontend/components/ContentWrapper'
import QueryResult from '../src/frontend/components/QueryResult'
import AlertBox from '../src/frontend/components/AlertBox'
import Button from '../src/frontend/components/Button'
import { OutlinedInput, FormControl, InputLabel } from '@material-ui/core'

const Container = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'center' })};
`

const SlackLogoImage = styled(Image)`
  width: 128px;
  height: auto;
  margin-bottom: 2rem;
`

const H1 = styled.h1`
  margin-bottom: 3rem;
`

const Form = styled.form`
  ${flex({ direction: 'row', justify: 'center', align: 'center' })};
  margin-bottom: 0.2rem;

  input {
    margin-right: 1rem;
  }
`
// && { } is required to override styles inherited from material-ui
const EmailFormControl = styled(FormControl)`
  && {
    ${flex({ direction: 'column', justify: 'flex-start', align: 'stretch' })};
    margin: 0 1rem;
  }
`

const StyledQueryResult = styled(QueryResult)`
  width: 80%;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    max-width: 400px;
  }
`

const Finished = styled(AlertBox)`
`

const SlackPage = () => {
  const [finished, setFinished] = useState(false)
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [doRequest, result] = useSafeMutation(RequestSlackInviteMutation)

  const updateEmail = useCallback(e => {
    const newEmail = e.target.value;
    if (newEmail !== email) {
      setEmail(newEmail)
      setIsValid(validator.isEmail(newEmail))
    }
  }, [email])

  const submitForm = useCallback(async e => {
    e.preventDefault()

    if (!isValid) {
      return
    }

    const ret = await doRequest({
      variables: {
        email,
      }
    })

    if (_.get(ret, 'data.result.success')) {
      setEmail('')
      setFinished(true)
    }
  }, [email, isValid, doRequest])

  return (
    <Layout>
      <Seo title='Join our Slack' />
      <FundUs />
      <ContentWrapper>
        <Container>
          <SlackLogoImage name='slack' />
          <H1>Join us on Slack</H1>
          {finished ? (
            <Finished>Thank you! Please check your email for your Slack invitation.</Finished>
          ) : (
            <React.Fragment>
                <Form onSubmit={submitForm}>
                <EmailFormControl fullWidth variant='outlined'>
                  <InputLabel htmlFor="outlined-adornment-email">Your email address</InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-email'
                    type='email'
                    value={email}
                    onChange={updateEmail}
                    placeholder='Enter your email...'
                    labelWidth={150}
                  />
                  </EmailFormControl>
                  <Button
                    loading={result.loading}
                    disabled={!isValid}
                    onClick={submitForm}
                  >
                    Start
                </Button>
              </Form>
              <StyledQueryResult {...result} hideLoading={true} />
            </React.Fragment>
          )}
        </Container>
      </ContentWrapper>
    </Layout>
  )
}

export default withApollo(SlackPage)


