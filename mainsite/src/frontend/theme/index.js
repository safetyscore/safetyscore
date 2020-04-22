import { Themes } from 'emotion-styled-utils'

import defaultTheme from './default'

export const setupThemes = breakpoints => {
  const themes = new Themes({}, breakpoints)

  themes.add('default', defaultTheme)

  return themes
}
