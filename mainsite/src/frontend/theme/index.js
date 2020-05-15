import { Themes } from 'emotion-styled-utils'

import defaultTheme from './default'
import muiTheme from './muiTheme'

export const setupThemes = breakpoints => {
  const themes = new Themes({}, breakpoints)

  themes.add('default', defaultTheme)
  themes.add('muiTheme', muiTheme)

  return themes
}
