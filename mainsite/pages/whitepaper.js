import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'

import { content, images } from '../docs/whitepaper'
import { withApollo } from '../src/frontend/hoc'
import Layout from '../src/frontend/components/Layout'
import Markdown from '../src/frontend/components/Markdown'
import FundUs from '../src/frontend/components/FundUs'
import Seo from '../src/frontend/components/Seo'
import ContentWrapper from '../src/frontend/components/ContentWrapper'


const WhitepaperPage = () => {
  const getImage = useCallback(f => {
    const pos = f.lastIndexOf('/')
    const fn = (0 > pos ? f : f.substr(pos + 1))
    return images[fn] || f
  }, [])

  return (
    <Layout>
      <Seo title='Whitepaper'/>
      <FundUs />
      <ContentWrapper>
        <Markdown getImage={getImage}>{content}</Markdown>
      </ContentWrapper>
    </Layout>
  )
}

export default withApollo(WhitepaperPage)


