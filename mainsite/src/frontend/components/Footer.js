import React from 'react'
import styled from '@emotion/styled'
import { flex, childAnchors } from 'emotion-styled-utils'

import {
  HomeLink,
  JoinLink,
} from './Link'
import { scrollToTop } from '../utils/functions'

const Container = styled.footer`
  color: ${({ theme }) => theme.footerTextColor};
  padding: 1.5rem;

  & > div {
    margin-bottom: 2rem;

    &:last-child {
      margin: 0;
    }

    li {
      line-height: 2em;
    }
  }

  ${({ theme }) => childAnchors({
    textColor: theme.footerAnchorTextColor,
    hoverTextColor: theme.footerAnchorHoverTextColor,
    hoverBgColor: theme.footerAnchorHoverBgColor,
    borderBottomColor: theme.footerAnchorBorderBottomColor
  })};

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    ${flex({ direction: 'row', justify: 'space-between', align: 'flex-start' })};
    padding: 3rem 1.5rem 2rem;

    & > div {
      margin: 0;
    }
  }
`

const Menu = styled.div`
  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    ${flex({ direction: 'row', justify: 'flex-start', align: 'flex-start' })};
  }
`

const MenuColumn = styled.ul`
  display: block;

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    padding-right: 3rem;
  }
`

const MenuNavLink = styled.li`
  display: block;
`


const Footer = ({ className }) => {
  return (
    <Container className={className}>
      <Menu>
        <MenuColumn>
          <MenuNavLink><HomeLink>Home</HomeLink></MenuNavLink>
        </MenuColumn>
        <MenuColumn>
          <MenuNavLink><JoinLink>Join us</JoinLink></MenuNavLink>
        </MenuColumn>
      </Menu>
      <div>
        <a onClick={scrollToTop}>⇧ Back to top</a>
      </div>
    </Container>
  )
}

export default Footer
