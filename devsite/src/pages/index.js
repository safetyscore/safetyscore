import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'

import Layout from '../components/Layout'
import Seo from "../components/Seo"

const Content = styled.div`
  p {
    margin: 1rem 0;
  }

  ul {
    list-style: disc;
    margin-left: 2rem;

    li {
      margin-left: 0.5rem;
    }
  }
`

const IndexPage = () => {
  return (
    <Layout>
      <Seo title='Welcome'/>
      <Content>
        <p>Welcome to the SafetyScore Developer website.</p>
        <ul>
          <li><Link to='/docs/getting-started'>Getting started</Link></li>
        </ul>
      </Content>
    </Layout>
  )
}

export default IndexPage
