import React from 'react'
import styled from '@emotion/styled'
import { flex, font } from 'emotion-styled-utils'

import { withApollo } from '../src/frontend/hoc'
import { headerHeight } from '../src/frontend/components/Header'
import Layout from '../src/frontend/components/Layout'
import Seo from '../src/frontend/components/Seo'
import ContentWrapper from '../src/frontend/components/ContentWrapper'
import DownloadAppBlock from '../src/frontend/components/DownloadAppBlock'
import HowItWorks from '../src/frontend/components/page/home/HowItWorks'
import MaxContentWidth from '../src/frontend/components/MaxContentWidth'

const TopBlock = styled.div`
  height: calc(100vh - ${headerHeight});
  ${flex({ direction: 'column', justify: 'center', align: 'center' })};
  padding: 1rem;
`

const TagLine = styled.p`
  font-size: 3.5rem;
  text-align: center;
  line-height: 1.2em;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    font-size: 4rem;
  }
`

const StyledDownloadAppBlock = styled(DownloadAppBlock)`
  margin: 0 auto;
`

const FirstDownloadAppBlock = styled(StyledDownloadAppBlock)`
  width: 80%;
  margin: 4rem auto 0;
`

const ContentBlock = styled(ContentWrapper)`
  min-height: 100vh;

  h2 {
    text-align: center;
    margin: 1rem 0 2rem;
    font-size: 3rem;
  }

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    min-height: auto;
  }
`

const ItemList = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'center' })};

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    ${flex({ direction: 'row', justify: 'space-around', align: 'flex-start' })};
  }
`

const StyledHowItWorks = styled(HowItWorks)`
  margin: 2rem 0;
  width: 80%;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    margin: 2rem 1rem;
    max-width: 300px;
  }
`

const InterimBlock = styled(MaxContentWidth)``
const InterimBlockInner = styled.div`
  width: 80%;
  margin: 0 auto;
  text-align: center;
  padding: 2rem 0;

  h2 {
    margin-top: 0;
  }
`

const HomePage = () => {
  return (
    <Layout>
      <Seo title='Home' />
      <TopBlock>
        <TagLine>
          Getting the World out of Lockdown.
        </TagLine>
        <FirstDownloadAppBlock />
      </TopBlock>
      <ContentBlock>
        <h2>How it works</h2>
        <ItemList>
          <StyledHowItWorks
            number={1}
            details='Coming soon...'
            subdetails='Coming soon...'
          />
          <StyledHowItWorks
            number={2}
            details='Coming soon...'
            subdetails='Coming soon...'
          />
          <StyledHowItWorks
            number={3}
            details='Coming soon...'
            subdetails='Coming soon...'
          />
        </ItemList>
      </ContentBlock>
      <InterimBlock>
        <InterimBlockInner>
          <h2>Download the app</h2>
          <StyledDownloadAppBlock />
        </InterimBlockInner>
      </InterimBlock>
    </Layout>
  )
}

export default withApollo(HomePage)


