import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://hubert-xu.com'),
  title: 'Hubert Xu',
  description: 'Software engineer and builder.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hubert Xu',
    description: 'Software engineer and builder.',
    url: '/',
    siteName: 'Hubert Xu',
    locale: 'en_CA',
    type: 'website',
    images: [{
      url: '/social-card.png',
      width: 1200,
      height: 630,
      alt: 'lumi',
      type: 'image/png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hubert Xu',
    description: 'Software engineer and builder.',
    images: [{
      url: '/social-card.png',
      width: 1200,
      height: 630,
      alt: 'lumi',
    }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
