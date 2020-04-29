import React from 'react'
import { NextSeo } from 'next-seo'

const Seo = ({ title }) => (
  <NextSeo
    title={title || 'SafetyScore: A Permanent Solution to Pandemics'}
    titleTemplate='%s | SafetyScore'
    description='The team at SafetyScore are building a much-needed solution to safely get the world out of lockdown by the end of Summer.'
    openGraph={{
      type: 'website',
      locale: 'en_GB',
      url: 'https://safetyscore.app/',
      site_name: 'SafetyScore',
    }}
  />
)

export default Seo
