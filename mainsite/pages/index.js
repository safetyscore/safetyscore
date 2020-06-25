import React from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

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
  margin: 2rem;
  width: 100%;
  max-width: 300px;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    width: 25%;
  }
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
      <Seo />
      <TopBlock>
        <TagLine>
          A Permanent Solution to Pandemics.
        </TagLine>
      </TopBlock>
      <ContentBlock>
        <h2>Team</h2>
        <ItemList>
          <StyledTeamMember
            name="Tav Siva"
            pic="https://pbs.twimg.com/profile_images/1200123014119071744/QUPogTli_400x400.jpg"
            bio="Social entrepreneur, distributed systems engineer, open source developer."
            resume="Chainspace, UK Home Office, WikiHouse, Freenet."
            twitter="tav"
          />
          <StyledTeamMember
            name="Dr. Oliver Zahn"
            pic="https://ca.slack-edge.com/T02611AQD-U0118DUF325-14ae2ed0d7cd-512"
            bio="Ex-head of Data Science at Google, Tech Entrepreneur."
            resume="SpaceX, Impossible foods, UC Berkeley, Harvard."
            twitter="lvrzhn"
          />
          <StyledTeamMember
            name="Dr. Luke Robinson"
            pic="https://media-exp1.licdn.com/dms/image/C5603AQGNJP77TF3yWg/profile-displayphoto-shrink_200_200/0?e=1598486400&v=beta&t=Klg_aFS9QIFVEAo39XFeISHV6UxZhoIg902pJKPnRUk"
            bio="Deep-tech entrepreneur, quantum physicist."
            resume="Post Urban Ventures, Hazy, Alan Turing Institute, Cambridge."
          />
          <StyledTeamMember
            name="Alice Fung"
            pic="https://pbs.twimg.com/profile_images/845703224309026818/VJxnSxm9_400x400.jpg"
            bio="Director at Health Foundry. Top 100 Women in Social Enterprise."
            resume="Architect 00, Mayor's Design Advocate, Impact Hub."
            twitter="00alice"
          />
          <StyledTeamMember
            name="Tom Salfield"
            pic="https://media-exp1.licdn.com/dms/image/C4D03AQGLNp_0N-XIpg/profile-displayphoto-shrink_200_200/0?e=1598486400&v=beta&t=RsZSg9jZ_BE3_CIM4cAHa4ug6xvOxzr6iecCjZGsYtU"
            bio="Social-tech entepreneur, collaborative sytems designer."
            resume="Wikifactory, Impact Hub, Opencoin, Imperial, LSE."
            twitter="tsalfield"
          />
          <StyledTeamMember
            name="Huy Dinh"
            pic="https://media-exp1.licdn.com/dms/image/C4E03AQG_tyFx7csK3Q/profile-displayphoto-shrink_200_200/0?e=1598486400&v=beta&t=Z6z4xh2j3TbxX7gYMqx_xtacBySss0HcDfHaKFzO5xU"
            bio="Experienced CTO, scalable systems architect, app developer."
            resume="NTT Docomo, Guardian News, BBC Worldwide."
          />
          <StyledTeamMember
            name="Dr. Nina Fefferman"
            pic="https://sites.tufts.edu/naumovalabs/files/2019/10/peopleFefferman2-6.jpg"
            bio="Infectious diseases modelling expert. Professor in ecology, Evolution & Maths at UT Knoxville."
            resume="Rutgers, Tufts, Princeton."
          />
          <StyledTeamMember
            name="Dr. Laura Kahn"
            pic="https://media-exp1.licdn.com/dms/image/C5603AQGUEi9BcamjCw/profile-displayphoto-shrink_800_800/0?e=1598486400&v=beta&t=t6mTH0Y-azeO5apdrZUqR-s5y4APCRSD37vYhx2O3ec"
            bio="Co-founder at One Health Initiative. Public health expert, physician, science and global security scholar."
            resume="Princeton."
            twitter="laurakahn1"
          />
          <StyledTeamMember
            name="Krishna Kotecha"
            bio="Ex-iOS team lead at Babylon Health. Award-winning mobile developer."
            resume="Hailo, Deutsche Bank, Symbian."
          />
          <StyledTeamMember
            name="Anthony Leung"
            bio="Senior finance, treasury, and strategy executive."
            resume="Tesco, Credit Suisse, Morgan Stanley, LSE."
          />
          <StyledTeamMember
            name="Hinesh Mandalia"
            pic="https://d1hbpr09pwz0sk.cloudfront.net/profile_pic/hinesh-mandalia-ae111ea1"
            bio="Senior full-stack engineer, fintech."
            resume="G-Research, Lloyds Banking Group, Logica, Imperial."
            twitter="hineshmandalia"
          />
          <StyledTeamMember
            name="Alex McKinlay"
            pic="https://media-exp1.licdn.com/dms/image/C5603AQF9a1swWNJdcw/profile-displayphoto-shrink_800_800/0?e=1598486400&v=beta&t=bH55-bIQZNGK-iVK1iRPpErzheLdCdoJPJF5SWCbDwI"
            bio="Software engineer, distributed systems, fintech, smart contracts."
            resume="Refinitiv, TokenCard, Pantheon Ventures."
          />
          <StyledTeamMember
            name="Ramesh Nair"
            pic="https://pbs.twimg.com/profile_images/708314532678995970/8dI12aDO_400x400.jpg"
            bio="Full-stack polyglot engineer, blockchain enthusiast."
            resume="Nayms, Tokencard, Ethereum Foundation, Imperial."
            twitter="hiddentao"
          />
          <StyledTeamMember
            name="Seyi Ogunyemi"
            bio="Senior full-stack engineer, graphic designer, UX specialist, fintech."
            resume="Civic, Espians, Coca-Cola, Daigeo."
            twitter="micrypt"
          />
          <StyledTeamMember
            name="William Pritchard"
            pic="https://media-exp1.licdn.com/dms/image/C5603AQFC5UR453U1sw/profile-displayphoto-shrink_800_800/0?e=1598486400&v=beta&t=mX1KUdezqB_l5572362a1CQSrGMBuk2tdrKFvwBR-sQ"
            bio="Senior QA engineer, automation tester, data security, AI."
            resume="Genomics England, UK Cabinet Office, Capgemini."
          />
          <StyledTeamMember
            name="Imtiaz Shams"
            pic="https://ca.slack-edge.com/T02611AQD-U010JKBQCJ0-6cbf2b336a3b-512"
            bio="AI entrepreneur, non-profit builder, fundraising."
            resume="Post Urban Ventures, Charities: Think & Faith to Fathless, LSE."
            twitter='imtishams'
          />
          <StyledTeamMember
            name="Dr. David Spergel"
            pic="https://media-exp1.licdn.com/dms/image/C4E03AQGC0hAb_6tM2A/profile-displayphoto-shrink_800_800/0?e=1598486400&v=beta&t=aSdB4hTKqrBpJYe71rPq2PID3KaLZb3hG6DsQ2IIgsk"
            bio="Director at Simons Foundation. Computational astrophysicist. Breakthrough prize winner."
            resume="Princeton, NASA, Harvard."
            twitter="davidspergel"
          />
        </ItemList>
      </ContentBlock>
    </Layout>
  )
}

export default withApollo(HomePage)


