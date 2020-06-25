import React from 'react'
import { NextSeo } from 'next-seo'

const Seo = ({ title, description }) => (
  <NextSeo
    title={title || 'SafetyScore: A Permanent Solution to Pandemics'}
    titleTemplate='%s | SafetyScore'
    description={description || 'The team at SafetyScore are building a much-needed solution for the post-Covid era.'}
    openGraph={{
      type: 'website',
      locale: 'en_GB',
      url: 'https://safetyscore.app/',
      site_name: 'SafetyScore',
      images: [
        {
          url: 'https://safetyscore.app/socialcard-bg.png',
          width: 422,
          height: 77,
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
