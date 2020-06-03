import React from 'react'
import { PrismLight as Highlighter } from "react-syntax-highlighter"

const { registerLanguage } = Highlighter

const rust = require('react-syntax-highlighter/dist/cjs/languages/prism/rust').default
registerLanguage('rust', rust)

const prism = require('react-syntax-highlighter/dist/cjs/styles/prism/prism').default

const SyntaxHighlighter = ({ language, children }) => (
  <Highlighter language={language} style={prism}>{children}</Highlighter>
)

export default SyntaxHighlighter
