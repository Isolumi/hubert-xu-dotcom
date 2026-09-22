/** @jest-environment node */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { metadata } from '../layout'

const socialCardPath = join(process.cwd(), 'public', 'social-card.png')

describe('site metadata', () => {
  it('gives link previews the public site identity', () => {
    expect(metadata.metadataBase?.toString()).toBe('https://hubert-xu.com/')
    expect(metadata.title).toBe('Hubert Xu')
    expect(metadata.description).toBe('Software engineer and builder.')
    expect(metadata.alternates).toEqual({ canonical: '/' })
    expect(metadata.openGraph).toEqual({
      title: 'Hubert Xu',
      description: 'Software engineer and builder.',
      url: '/',
      siteName: 'Hubert Xu',
      locale: 'en_CA',
      type: 'website',
      images: [{
        url: '/social-card.png?v=2',
        width: 1200,
        height: 630,
        alt: 'lumi',
        type: 'image/png',
      }],
    })
    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Hubert Xu',
      description: 'Software engineer and builder.',
      images: [{
        url: '/social-card.png?v=2',
        width: 1200,
        height: 630,
        alt: 'lumi',
      }],
    })
  })

  it('ships the social card as a static 1200 by 630 PNG', () => {
    const socialCardExists = existsSync(socialCardPath)

    expect(socialCardExists).toBe(true)
    if (!socialCardExists) return

    const socialCard = readFileSync(socialCardPath)
    expect(socialCard.subarray(1, 4).toString()).toBe('PNG')
    expect(socialCard.readUInt32BE(16)).toBe(1200)
    expect(socialCard.readUInt32BE(20)).toBe(630)
  })
})
