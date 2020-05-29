import React, { useMemo, useState, useCallback } from 'react'
import slugify from 'slugify'
import styled from '@emotion/styled'
import _ from 'lodash'
import { flex, font, childAnchors } from 'emotion-styled-utils'
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
  max-width: 100%;
  overflow-y: scroll;

  h2 {
    ${font('header')};
    margin-top: 2.5rem;
  }

  h1, h2, h3, h4 {
    ${childAnchors({
      textColor: 'inherit',
      hoverTextColor: 'inherit',
      hoverBgColor: 'inherit',
      borderBottomColor: 'transparent'
    })};

    a {
      border-bottom: none;
    }
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
    margin: 1rem 0 1.5rem 2rem;
    list-style-type: disc;

    li {
      margin: 0.5rem 0;
    }
  }

  ol {
    list-style-type: decimal;
  }

  img {
    display: block;
    max-width: 100%;
    margin: 2rem auto;

    ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
      max-width: 800px;
    }
  }

  pre {
    font-size: 1em;
    max-width: 100%;
    overflow-y: scroll;
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



const RenderAnchor = ({ transformLink, footnoteStats }) => anchor => {
  const { href, title, children } = anchor

  let c = (Array.isArray(children) ? children.join(', ') : children)

  // footnotes and external image links should be rendered using normal anchor tag
  if (!href || href.startsWith('http') || href.startsWith('#')) {
    const extraProps = {}

    // if in-page link (i.e. footnote link or the return link from the footnote back to the content point)
    if (href.startsWith('#')) {
      // name the forward link so that the return link in the footnote works
      if (c !== '↩') {
        extraProps.name = href.substr(1).replace('fn-', 'fnref-')
        c = footnoteStats.nextIndex++ // show numbers for footnotes intead of the original text
      }
    }

    return <a href={href} title={title} {...extraProps}>{c}</a>
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


const HeadingAnchor = styled.a`
  display: block;
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })};
`

const PermalinkSymbol = styled.span`
  font-size: 0.8rem;
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.permalinkSymbolTextColor};
`

const Heading = ({ level, children, numberedSubHeadings, ...props }) => {
  const [ showPermalink, setShowPermalink ] = useState(false)
  const togglePermalink = useCallback(() => setShowPermalink(!showPermalink), [ showPermalink ])

  const { title, sanitizedKids } = useMemo(() => {
    let title = ''

    const sanitizedKids = children.map(child => {
      if (typeof child === 'string') {
        const metaPos = child.indexOf('{.no-subsection}')

        if (0 < metaPos) {
          child = child.substr(0, metaPos)
        }

        title = `${title} ${child}`
      }
      return child
    })

    // add numbering if level > 1 (i.e. for headings smaller than <H1 />)
    if (numberedSubHeadings && 1 < level) {
      const levelIdx = level - 2
      numberedSubHeadings[levelIdx]++
      sanitizedKids.unshift(`${numberedSubHeadings.slice(0, levelIdx + 1).join('.')} `)
      // reset numbering for all smaller headings
      for (let i = levelIdx + 1; numberedSubHeadings.length > i; i += 1) {
        numberedSubHeadings[i] = 0
      }
    }

    return { title, sanitizedKids }
  }, [level, children, numberedSubHeadings])

  const slug = useMemo(() => slugify(title.toLowerCase()), [title])

  const content = useMemo(() => (
    <HeadingAnchor href={`#${slug}`} onMouseOver={togglePermalink} onMouseOut={togglePermalink}>
      {sanitizedKids}
      {showPermalink ? <PermalinkSymbol>¶</PermalinkSymbol> : null}
    </HeadingAnchor>
  ), [ slug, sanitizedKids, showPermalink ])

  return React.createElement(
    `h${level}`,
    { ...props, id: slug },
    content,
  )
}

const RenderH1 = options => props => <Heading level={1} {...props} {...options} />
const RenderH2 = options => props => <Heading level={2} {...props} {...options} />
const RenderH3 = options => props => <Heading level={3} {...props} {...options} />
const RenderH4 = options => props => <Heading level={4} {...props} {...options} />

const Markdown = ({
  children: markdown,
  className,
  getImage,
  transformLink,
  enableNumberedSubHeadings,
}) => {
  const { content, meta } = useMemo(() => {
    const numberedSubHeadings = enableNumberedSubHeadings
      ? [0, 0, 0, 0, 0]
      : null

    const footnoteStats = { nextIndex: 1 }

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
            a: RenderAnchor({ transformLink, footnoteStats }),
            code: RenderCode,
            li: RenderListItem,
            h1: RenderH1(),
            h2: RenderH2({ numberedSubHeadings }),
            h3: RenderH3({ numberedSubHeadings }),
            h4: RenderH4({ numberedSubHeadings }),
          }
        })
        .processSync(markdown).result
    }
  }, [markdown, getImage, transformLink, enableNumberedSubHeadings])

  return (
    <Container className={className}>
      {meta.title ? <h1>{meta.title}</h1> : null}
      {meta.authors ? <em>Authors: {meta.authors}</em> : null}
      {content}
    </Container>
  )
}

export default Markdown