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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hubert Xu',
    description: 'Software engineer and builder.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
