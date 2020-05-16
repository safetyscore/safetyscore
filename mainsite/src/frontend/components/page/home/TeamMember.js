import React from 'react'
import styled from '@emotion/styled'
import { flex, font } from 'emotion-styled-utils'

const Container = styled.div`
  ${flex({ direction: 'column', justify: 'center', align: 'center' })};
  text-align: center;
`

const Pic = styled.img`
  width: 124px;
  height: 124px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.homePageTeamMemberPicBorderColor};
`

const Name = styled.div`
  ${font('header')}
  font-size: 2rem;
  margin-top: 1rem;
`

const TwitterLink = styled.a`
  display: block;
  margin-top: 0.5rem;
`


const HowItWorks = ({ className, name, pic, title, twitter }) => {
  return (
    <Container className={className}>
      <Pic src={pic} />
      <Name>{name}</Name>
      <TwitterLink href={`https://twitter.com/${twitter}`}>@{twitter}</TwitterLink>
    </Container>
  )
}

export default HowItWorks
