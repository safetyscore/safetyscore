import React, { useState, useCallback } from 'react'
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from '@emotion/styled'
import { font, flex, childAnchors, boxShadow } from 'emotion-styled-utils'

import Button from './Button'
import Icon from './Icon'

export const headerHeight = '75px'

const Container = styled.header`
  height: ${headerHeight};
  background: ${({ theme }) => theme.headerBgColor};
  color: ${({ theme }) => theme.headerTextColor};
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
  padding: 0 1rem;
  overflow: visible;
`

const Brand = styled.div`
  display: block;
  ${font('header', 'thin')};
  color: ${({ theme }) => theme.headerTextColor};
  font-size: 1.5rem;
  cursor: pointer;
`

const DesktopNav = styled.ul`
  display: none;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    display: block;
    list-style: none;
    ${flex({ direction: 'row', basis: 0 })};

    ${({ theme }) => childAnchors({
      textColor: theme.navAnchorTextColor,
      hoverTextColor: theme.navAnchorHoverTextColor,
      hoverBgColor: theme.navAnchorHoverBgColor,
      borderBottomColor: theme.navAnchorBorderBottomColor
    })};
  }
`

const MobileNav = styled.ul`
  list-style: none;
  ${flex({ direction: 'column', basis: 0 })}
  z-index: 5;
  position: fixed;
  top: ${headerHeight};
  right: 10px;
  min-width: 9rem;
  border-radius: 5px;
  ${({ theme }) => boxShadow({ color: theme.mobileNavBoxShadow })};
  background-color: ${({ theme }) => theme.mobileNavBgColor};

  ${({ theme }) => childAnchors({
    textColor: theme.mobileNavAnchorTextColor,
    hoverTextColor: theme.mobileNavAnchorHoverTextColor,
    hoverBgColor: theme.mobileNavAnchorHoverBgColor,
    borderBottomColor: theme.mobileNavAnchorBorderBottomColor
  })};

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    display: none;
  }
`

const NavLi = styled.li`
  display: block;
  border-bottom: 1px solid ${({ theme }) => theme.mobileNavAnchorTextColor};
  width: 100%;

  &:last-child {
    border-bottom: none;
  }

  a {
    display: block;
    font-size: 0.9rem;
    padding: 0.7rem 1rem;
    white-space: nowrap;
  }

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    border-bottom: none;
    width: auto;

    a {
      display: inline-block;
      padding: 0.5rem 1rem;
    }
  }
`

const MobileNavButton = styled(Button)`
  display: block;
  padding: 0.5em;
  border: none;
  transform: rotate(${({ open }) => open ? '90deg' : '0deg'});
  transition: all 0.2s linear;

  background-color: transparent;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    display: none;
  }
`


export default ({ className }) => {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
      allMenuItemsJson {
        edges {
          node {
            name
            link
          }
        }
      }
    }
  `)

  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const toggleMobileMenu = useCallback(() => setMobileNavOpen(!mobileNavOpen), [mobileNavOpen])

  const navLinks = data.allMenuItemsJson.edges.map(({ node: { name, link } }) => (
    <NavLi key={name}><Link to={link}>{name}</Link></NavLi>
  ))

  return (
    <Container className={className}>
      <Link to='/'><Brand>{data.site.siteMetadata.title}</Brand></Link>
      <DesktopNav>{navLinks}</DesktopNav>
      <MobileNavButton open={mobileNavOpen} onClick={toggleMobileMenu}><Icon name='bars' /></MobileNavButton>
      {mobileNavOpen ? (
        <MobileNav>{navLinks}</MobileNav>
      ) : null}
    </Container>
  )
}
