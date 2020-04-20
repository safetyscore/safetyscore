import React, { useState, useCallback, useEffect } from "react"
import styled from '@emotion/styled'
import { Link, graphql } from "gatsby"
import { boxShadow } from 'emotion-styled-utils'

import Layout from "../components/layout"
import { headerHeight } from '../components/Header'
import Seo from "../components/Seo"
import SidebarMenu from '../components/SidebarMenu'
import Button from '../components/Button'

const sidebarWidth = '200px'

const StyledSidebarMenu = styled(SidebarMenu)`
  display: block;
  width: auto;
  font-size: 0.9rem;
  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    width: ${sidebarWidth};
    margin-right: 1rem;
  }
`

const MobileSidebarMenu = styled(StyledSidebarMenu)`
  padding: 1rem;
  max-height: 400px;
  overflow: scroll;
`

const DesktopSidebarMenu = styled(StyledSidebarMenu)``

const MobileSidebar = styled.div`
  display: block;
  position: fixed;
  top: ${headerHeight};
  left: 0;
  z-index: 4;
  background: ${({ theme }) => theme.docsMobileSidebarBgColor};
  ${({ theme }) => boxShadow({ color: theme.docsMobileSidebarShadowColor })};
  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    display: none;
  }
`

const DesktopSidebar = styled.div`
  display: none;
  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    display: block;
  }
`

const MobileSidebarButton = styled(Button)`
  padding: 0.1rem 0.2rem;
  font-size: 1.5rem;
`

const BottomNav = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 0;
  border-top: 1px dashed ${({ theme }) => theme.pageBottomNavBorderColor};
  border-bottom: 1px dashed ${({ theme }) => theme.pageBottomNavBorderColor};
  font-size: 0.8rem;
  line-height: 1rem;
  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    li {
      max-width: 40%;
      a {
        margin: 0 0.5em;
      }
    }
  }
`

const PageBottomNavItemLink = ({ fields: { title, urlPath } }) => {
  return (
    <Link to={`/docs${urlPath}`}>{title}</Link>
  )
}

const PageBottomNav = ({ next, prev }) => {
  if (!next && !prev) {
    return null
  }

  return (
    <BottomNav>
      <ul>
        <li>
          {next ? (
            <React.Fragment>
              ⇦<PageBottomNavItemLink item={next} />
            </React.Fragment>

          ) : null}
        </li>
        <li>
          {prev ? (
            <React.Fragment>
              <PageBottomNavItemLink item={prev} />⇨
            </React.Fragment>
          ) : null}
        </li>
      </ul>
    </BottomNav>
  )
}

const Page = ({ current, ...nav }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = useCallback(() => setMenuOpen(!menuOpen), [menuOpen])
  useEffect(() => { setMenuOpen(false) }, [ current ])

  const { html, fields: { title } } = current

  return (
    <Layout>
      <Seo title={title} />
      <MobileSidebar>
        <MobileSidebarButton onClick={toggleMenu}>{menuOpen ? '«' : '»'}</MobileSidebarButton>
        {menuOpen ? (
          <MobileSidebarMenu />
        ) : null}
      </MobileSidebar>
      <DesktopSidebar>
        <DesktopSidebarMenu />
      </DesktopSidebar>
      <div>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <PageBottomNav {...nav} />
    </Layout>
  )
}

export default function Template({ data }) {
  return (
    <Page
      current={data.current}
      newer={data.newer}
      older={data.older}
    />
  )
}

export const pageQuery = graphql`
  fragment MarkdownRemarkFields on MarkdownRemark {
    html
    fields {
      title
      urlPath
    }
  }

  query($id: String!, $nextUrlPath: String!, $prevUrlPath: String!) {
    current: markdownRemark(id: { eq: $id }) {
      ...MarkdownRemarkFields
    }
    next: markdownRemark(fields: {urlPath: {eq: $nextUrlPath}}) {
      ...MarkdownRemarkFields
    }
    prev: markdownRemark(fields: {urlPath: {eq: $prevUrlPath}}) {
      ...MarkdownRemarkFields
    }
  }
`