import { createMuiTheme } from '@material-ui/core/styles'
import { anchorPrimaryColor, color3 } from './palette'

export default createMuiTheme({
    palette: {
        primary: {
            main: color3
        },
        secondary: {
            main: anchorPrimaryColor
        }
    }
})