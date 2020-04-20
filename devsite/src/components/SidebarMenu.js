import React, { useMemo } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'
import { childAnchors } from 'emotion-styled-utils'

const Container = styled.div`
  background-color: ${({ theme }) => theme.sidebarBgColor};
  border-radius: 5px;
  font-size: 1.5rem;
`

const MenuList = styled.ul`
  list-style: none;
  display: block;
  font-size: 1.1em;
  line-height: 1.2em;

  li {
    margin-bottom: 25px;
  }

  ${({ theme }) => childAnchors({
    textColor: theme.sidebarAnchorTextColor,
    hoverBgColor: theme.sidebarAnchorHoverBgColor,
  })};
`

const Menu = ({
  className,
  docs,
}) => (
  <MenuList className={className}>
    {docs.children.map(d => {
      return (
        <li key={d.urlPath}>
          <Link to={`/docs${d.urlPath}`}>{d.title}</Link>
          {d.children ? (
            <SubMenu docs={d} />
          ) : null}
        </li>
      )
    })}
  </MenuList>
)

const SubMenu = styled(Menu)`
  margin: 10px 0 25px 15px;
  font-size: 0.9em;
  li {
    margin-bottom: 10px;
  }
`

const DocsSidebar = ({ className }) => {
  const { toc: { content: data } } = useStaticQuery(graphql`
    query DocsMenuQuery {
      toc {
        content
      }
    }
  `)

  const dataParsed = useMemo(() => JSON.parse(data), [ data ])

  return (
    <Container className={className}>
      <Menu docs={dataParsed} />
    </Container>
  )
}

export default DocsSidebar