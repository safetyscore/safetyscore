import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import _ from 'lodash'
import { font } from 'emotion-styled-utils'
import parse from 'remark-parse'
import unified from 'unified'
import frontmatter from 'remark-frontmatter'
import parseFrontmatter from 'front-matter'
import footnotes from 'remark-footnotes'
import remark2react from 'remark-react'

import { Link } from './Link'

const Container = styled.div`
  ${font('body')};
  font-size: 1rem;
  line-height: 1.5em;

  h2 {
    ${font('header')};
    margin-top: 2.5rem;
  }

  strong, b {
    font-weight: bolder;
  }

  sup {
    display: inline-block;
    font-size: 70%;
    vertical-align: top;
    margin-top: -0.3em;
  }

  em, i {
    font-style: italic;
  }

  ol, ul {
    margin: 1rem 0 1.5rem 1rem;
    list-style-type: disc;

    li {
      margin: 0.5rem 0;
    }
  }

  ol {
    list-style-type: decimal;
  }

  img {
    max-width: 100%;
    border: 1px solid ${({ theme }) => theme.markdownContentImageBorderColor};
  }

  pre {
    font-size: 1em;
  }
`

const CodeSpan = styled.span`
  font-family: monospace;
`

const P = styled.p`
  margin: 1rem 0;

  &:first-of-type {
    margin-top: 0;
  }
`

const ImgDiv = styled.div`
  margin: 2rem 0;
  text-align: center;

  & > img, & > div {
    display: block;
    margin: 0;
  }

  em {
    margin-top: 0.2rem;
    font-size: 90%;
  }
`

const RenderCode = ({ children }) => {
  return <CodeSpan>{children}</CodeSpan>
}

const RenderParagraph = ({ children }) => {
  const imgSrc = _.get(children, '0.props.src', '')
  const dotPos = imgSrc.lastIndexOf('.')
  const ext = (dotPos ? imgSrc.substring(dotPos + 1) : '').toLowerCase()

  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png':
    case 'bmp':
      return <ImgDiv>{children}</ImgDiv>
    default:
      return <P>{children}</P>
  }
}

const RenderImage = getImage => arg => {
  const { src, alt, title } = arg

  const finalSrc = (getImage ? getImage(src) : src)

  return <img src={finalSrc} alt={alt} title={title} />
}



const generateRenderAnchor = transformLink => anchor => {
  const { href, title, children } = anchor

  const c = (Array.isArray(children) ? children.join(', ') : children)

  // footnoes and external image links should be rendered using normal anchor tag
  if (!href || href.startsWith('http') || href.startsWith('#')) {
    return <a href={href} title={title}>{c}</a>
  }
  // internal links to elsewhere in website
  else {
    const attrs = (transformLink ? transformLink({ href, title }) : { href, title })
    return <Link {...attrs}><a>{c}</a></Link>
  }
}

const RenderListItem = props => {
  const { id, children, ...otherProps } = props

  if (id) {
    const fnPos = id.indexOf('-fn-')

    if (fnPos) {
      const footnoteId = id.substr(fnPos + 1) // e.g. fn-ssl16
      return <li id={footnoteId} {...otherProps}>{children}</li>
    }
  }

  return <li {...props} />
}


const sanitizeHeadingTitle = c => {
  return c.map(child => {
    if (typeof child === 'string') {
      const metaPos = child.indexOf('{.no-subsection}')

      if (metaPos) {
        child = child.substr(0, metaPos)
      }
    }
    return child
  })
}

const RenderH1 = ({ children, ...props }) => <h1 {...props}>{sanitizeHeadingTitle(children)}</h1>
const RenderH2 = ({ children, ...props }) => <h2 {...props}>{sanitizeHeadingTitle(children)}</h2>
const RenderH3 = ({ children, ...props }) => <h3 {...props}>{sanitizeHeadingTitle(children)}</h3>
const RenderH4 = ({ children, ...props }) => <h4 {...props}>{sanitizeHeadingTitle(children)}</h4>

const Markdown = ({ children: markdown, className, getImage, transformLink }) => {
  const { content, meta } = useMemo(() => {
    return {
      meta: _.get(parseFrontmatter(markdown), 'attributes', {}),
      content: unified()
        .use(parse)
        .use(frontmatter, ['yaml'])
        .use(footnotes, { inlineNotes: true })
        .use(remark2react, {
          remarkReactComponents: {
            p: RenderParagraph,
            img: RenderImage(getImage),
            a: generateRenderAnchor(transformLink),
            code: RenderCode,
            li: RenderListItem,
            h1: RenderH1,
            h2: RenderH2,
            h3: RenderH3,
            h4: RenderH4,
          }
        })
        .processSync(markdown).result
    }
  }, [markdown, getImage, transformLink])

  return (
    <Container className={className}>
      {meta.title ? <h1>{meta.title}</h1> : null}
      {meta.authors ? <em>Authors: {meta.authors}</em> : null}
      {content}
    </Container>
  )
}

export default Markdown