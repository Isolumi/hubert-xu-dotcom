/** @jest-environment node */

import { metadata } from '../layout'
import * as openGraphImage from '../opengraph-image'
import * as twitterImage from '../twitter-image'

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
    })
    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Hubert Xu',
      description: 'Software engineer and builder.',
    })
  })

  it.each([
    ['Open Graph', openGraphImage],
    ['X', twitterImage],
  ])('%s generates a large PNG preview with Lumi alt text', (_name, imageRoute) => {
    expect(imageRoute.alt).toBe('lumi')
    expect(imageRoute.size).toEqual({ width: 1200, height: 630 })
    expect(imageRoute.contentType).toBe('image/png')
    expect(imageRoute.default()).toBeInstanceOf(Response)
  })
})
