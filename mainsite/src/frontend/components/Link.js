import React, { useMemo, } from 'react'
import DefaultLink from 'next/link'
import url from 'url'

const wrapInAnchor = children => {
  let gotAnchor = false

  React.Children.forEach(children, c => {
    if (c.type === 'a' || c.__emotion_base === 'a') {
      gotAnchor = true
    }
  })

  return (gotAnchor ? children : <a>{children}</a>)
}

export const Link = ({ href, as, query = {}, children, ...props }) => {
  const finalHref = useMemo(() => url.format({ pathname: href, query }), [ href, query ])
  const external = useMemo(() => !!href.startsWith('http'), [ href ])

  return (
    <DefaultLink
      href={finalHref}
      {...(as ? { as } : null)}
      {...(external ? { prefetch: false } : null)}
      {...props}
    >
      {wrapInAnchor(children)}
    </DefaultLink>
  )
}

const NamedLink = ({ href, children }) => (
  <Link href={href} scroll={true}>{children}</Link>
)

export const HomeLink = props => <NamedLink href='/' {...props} />
export const WhitepaperLink = props => <NamedLink href='/whitepaper' {...props} />
export const JoinLink = props => <NamedLink href='/join' {...props} />
export const FundLink = props => <NamedLink href='/fund' {...props} />
export const SimulationLink = props => <NamedLink href='https://simulation.safetyscore.app' {...props} />
