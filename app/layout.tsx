import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hubert Xu',
  description: 'Personal website of Hubert Xu — software engineer and student',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
