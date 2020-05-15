import { opacify } from 'emotion-styled-utils'
import {
color2,
color3,
color4,
color5,
anchorPrimaryColor,
white,
black,
darkGrey,
red,
yellow,
grey,
lightGrey,
lighterGrey,
transparent,
} from './palette'

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
