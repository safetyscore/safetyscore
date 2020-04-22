import React from 'react'
import styled from '@emotion/styled'

import images from '../images'

const Img = styled.img`
  width: 100%;
  height: 100%;
`

const Image = ({ name, className }) => (
  <Img className={className} src={images[name]} />
)

export default Image
