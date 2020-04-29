import React from 'react'
import styled from '@emotion/styled'
import { flex, font } from 'emotion-styled-utils'

import { withApollo } from '../src/frontend/hoc'
import { headerHeight } from '../src/frontend/components/Header'
import Layout from '../src/frontend/components/Layout'
import Seo from '../src/frontend/components/Seo'
import ContentWrapper from '../src/frontend/components/ContentWrapper'
import FundUs from '../src/frontend/components/FundUs'
import TeamMember from '../src/frontend/components/page/home/TeamMember'

const TopBlock = styled.div`
  height: calc(80vh - ${headerHeight});
  ${flex({ direction: 'column', justify: 'center', align: 'center' })};
  padding: 1rem;
`

const TagLine = styled.p`
  font-size: 3.5rem;
  text-align: center;
  line-height: 1.2em;
  padding: 0 2rem;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    font-size: 4rem;
  }
`

const ContentBlock = styled(ContentWrapper)`
  h2 {
    text-align: center;
    margin: 1rem 0 2rem;
    font-size: 3rem;
  }
`

const ItemList = styled.div`
  ${flex({ direction: 'row', justify: 'space-around', align: 'flex-start', wrap: 'wrap' })};
`

const StyledTeamMember = styled(TeamMember)`
  margin-top: 1rem;
  width: 40%;
`

// const StyledHowItWorks = styled(HowItWorks)`
//   margin: 2rem 0;
//   width: 80%;

//   ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
//     margin: 2rem 1rem;
//     max-width: 300px;
//   }
// `

// const InterimBlock = styled(MaxContentWidth)``
// const InterimBlockInner = styled.div`
//   width: 80%;
//   margin: 0 auto;
//   text-align: center;
//   padding: 2rem 0;

//   h2 {
//     margin-top: 0;
//   }
// `

const HomePage = () => {
  return (
    <Layout>
      <Seo title='Home' />
      <TopBlock>
        <TagLine>
          Getting the World out of Lockdown.
        </TagLine>
      </TopBlock>
      <FundUs />
      <ContentBlock>
        <h2>Team</h2>
        <ItemList>
          <StyledTeamMember
            name="Tav"
            pic="https://pbs.twimg.com/profile_images/1200123014119071744/QUPogTli_400x400.jpg"
            title="Project lead"
            twitter="tav"
          />
          <StyledTeamMember
            name="Ram"
            pic="https://pbs.twimg.com/profile_images/708314532678995970/8dI12aDO_400x400.jpg"
            title="Developer"
            twitter="hiddentao"
          />
        </ItemList>
      </ContentBlock>
    </Layout>
  )
}

export default withApollo(HomePage)


