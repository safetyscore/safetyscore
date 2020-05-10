import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import { buttonStyles } from 'emotion-styled-utils'
import MuiButton from '@material-ui/core/Button'

import LoadingIcon from './LoadingIcon'

const StyledButton = styled(MuiButton)`
  && { border-radius: 5px;
    ${({ theme, disabled }) => buttonStyles({
      disabled,
      buttonDisabledBgColor: theme.buttonDisabledBgColor,
      buttonDisabledTextColor: theme.buttonDisabledTextColor,
      buttonBgColor: theme.buttonBgColor,
      buttonTextColor: theme.buttonTextColor,
      buttonHoverBgColor: theme.buttonHoverBgColor,
      buttonHoverTextColor: theme.buttonHoverTextColor,
    })};
  }
`

const StyledLoadingIcon = styled(LoadingIcon)`
  color: ${({ theme }) => theme.buttonTextColor};
`

/**
 * Render a button.
 * @return {ReactElement}
 */
const Button = forwardRef(({ loading, children, onClick, ...props }, ref) => (
  <StyledButton {...props} onClick={loading ? null : onClick} ref={ref}>
    {loading ? (
      <StyledLoadingIcon />
    ) : (
        children
      )}
  </StyledButton>
))

export default Button
