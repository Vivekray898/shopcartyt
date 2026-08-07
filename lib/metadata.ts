// lib/metadata.ts
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fundgrube-bestpreis.de'
const SITE_NAME = 'FundGrube BestPreis'
const DEFAULT_IMAGE = '/social/og-image.png'

interface MetadataProps {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const metaDescription = description || 'FundGrube BestPreis – Ihr zuverlässiger Partner für Markenprodukte'
  const metaImage = image || DEFAULT_IMAGE
  const metaUrl = url || SITE_URL

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates: {
      canonical: metaUrl,
    },
  }
}