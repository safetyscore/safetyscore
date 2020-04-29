import { opacify } from 'emotion-styled-utils'

const logoBlue = '#00A8FF'

// pallette: https://coolors.co/ff8abe-ffffff-0053b0-d4975f-00a8ff
const color1 = '#FF8ABE' // persian pink
const color2 = '#FFFFFF' // white
const color3 = '#0053B0' // sapphire
const color4 = '#D4975F'  // tan (crayola)
const color5 = '#00A8FF' // blue jeans

const anchorPrimaryColor = color1

// standard colours
const white = '#fff'
const black = '#000'
const darkGrey = '#666'
const red = '#f00'
const yellow = 'yellow'
const grey = '#999'
const lightGrey = '#ccc'
const lighterGrey = '#eee'
const transparent = 'transparent'

/**
 * Default theme.
 *
 * @type {Object}
 */
export default {
  // layout
  layoutBgColor: color5,
  layoutTextColor: white,
  // header component
  headerWrapperBgColor: transparent,
  headerWrapperFloatingBgColor: opacify(color5, 0.9),
  headerBgColor: transparent,
  headerTextColor: white,
  navAnchorTextColor: white,
  navAnchorHoverTextColor: white,
  navAnchorHoverBgColor: anchorPrimaryColor,
  navAnchorBorderBottomColor: transparent,
  mobileNavBoxShadow: darkGrey,
  mobileNavBgColor: white,
  mobileNavAnchorTextColor: anchorPrimaryColor,
  mobileNavAnchorHoverTextColor: white,
  mobileNavAnchorHoverBgColor: anchorPrimaryColor,
  mobileNavAnchorBorderBottomColor: transparent,
  // footer component
  footerAnchorTextColor: white,
  footerAnchorHoverTextColor: anchorPrimaryColor,
  footerAnchorHoverBgColor: white,
  footerAnchorBorderBottomColor: white,
  // content wrapper component
  contentWrapperBgColor: white,
  contentWrapperTextColor: black,
  contentWrapperAnchorTextColor: anchorPrimaryColor,
  contentWrapperAnchorHoverTextColor: white,
  contentWrapperAnchorHoverBgColor: anchorPrimaryColor,
  contentWrapperAnchorBorderBottomColor: transparent,
  // errorBox component
  errorBoxBgColor: red,
  errorBoxTextColor: white,
  errorBoxIconColor: yellow,
  // alertBox component
  alertBoxBgColor: opacify(color4, 0.3),
  alertBoxTextColor: black,
  alertBoxIconColor: color4,
  // button component
  buttonDisabledBgColor: grey,
  buttonDisabledTextColor: darkGrey,
  buttonDisabledBorderColor: grey,
  buttonBgColor: anchorPrimaryColor,
  buttonTextColor: white,
  buttonBorderColor: anchorPrimaryColor,
  buttonHoverBgColor: opacify(anchorPrimaryColor, 0.9),
  buttonHoverTextColor: white,
  buttonHoverBorderColor: anchorPrimaryColor,
  buttonShadowColor: darkGrey,
  // icon button component
  iconButtonBorderColor: anchorPrimaryColor,
  iconButtonBgColor: transparent,
  iconButtonTextColor: anchorPrimaryColor,
  iconButtonDisabledBorderColor: lightGrey,
  iconButtonDisabledBgColor: transparent,
  iconButtonDisabledTextColor: grey,
  iconButtonHoverBorderColor: anchorPrimaryColor,
  iconButtonHoverBgColor: anchorPrimaryColor,
  iconButtonHoverTextColor: white,
  iconButtonShadowColor: darkGrey,
  // input components general styles
  inputBorderColor: darkGrey,
  inputBgColor: white,
  inputErrorBorderColor: red,
  inputErrorBgColor: yellow,
  inputPlaceholderTextColor: lightGrey,
  // queryResult component
  queryResultLoadingTextColor: white,
  // fund us component
  fundUsBgColor: color3,
  fundUsProgressBarProgressColor: color2,
  // error page
  errorPageExplanationTextColor: darkGrey,
  errorPageStackBgColor: lightGrey,
  // home page: top block
  homePageHowItWorksNumberBorderColor: black,
  homePageHowItWorksSubDetailsBgColor: lighterGrey,
  homePageHowItWorksSubDetailsTextColor: grey,
  homePageTeamMemberPicBorderColor: grey,
  // fund page
  fundPagePaymentDisclaimerTextColor: lightGrey,
  fundPageCardEntryBgColor: lighterGrey,
}
