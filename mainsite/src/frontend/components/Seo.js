import React from 'react'
import { NextSeo } from 'next-seo'

const Seo = ({ title, description }) => (
  <NextSeo
    title={title || 'SafetyScore: A Permanent Solution to Pandemics'}
    titleTemplate='%s | SafetyScore'
    description={description || 'The team at SafetyScore are building a tool to save the world from going through lockdowns ever again.'}
    openGraph={{
      type: 'website',
      locale: 'en_GB',
      url: 'https://safetyscore.app/',
      site_name: 'SafetyScore',
      images: [
        {
          url: 'https://safetyscore.app/socialcard-bg.png',
          width: 560,
          height: 300,
          alt: 'SafetyScore',
        },
      ]
    }}
    twitter={{
      cardType: 'summary_large_image',
    }}
  />
)

export default Seo
