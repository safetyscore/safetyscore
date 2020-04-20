/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import { buttonStyles } from 'emotion-styled-utils'

const StyledButton = styled.button`
  ${({ theme, disabled }) => buttonStyles({
    disabled,
    buttonDisabledBgColor: theme.buttonDisabledBgColor,
    buttonDisabledTextColor: theme.buttonDisabledTextColor,
    buttonDisabledBorderColor: theme.buttonDisabledBorderColor,
    buttonBgColor: theme.buttonBgColor,
    buttonTextColor: theme.buttonTextColor,
    buttonBorderColor: theme.buttonBorderColor,
    buttonHoverBgColor: theme.buttonHoverBgColor,
    buttonHoverTextColor: theme.buttonHoverTextColor,
    buttonHoverBorderColor: theme.buttonHoverBorderColor,
    buttonShadowColor: theme.buttonShadowColor,
  })};
  border-radius: 5px;
`

const Button = forwardRef(({ children, ...props }, ref) => (
  <StyledButton {...props} ref={ref}>
    {children}
  </StyledButton>
))

export default Button
