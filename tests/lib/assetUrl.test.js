import { describe, it, expect } from 'vitest'
import { assetUrl } from '../../src/lib/assetUrl.js'

describe('assetUrl', () => {
  it('menghapus slash awal dan tidak menghasilkan // ganda', () => {
    const url = assetUrl('/assets/logo_ut.png')
    expect(url.endsWith('assets/logo_ut.png')).toBe(true)
    expect(url.replace('://', '')).not.toContain('//')
  })

  it('mengembalikan URL http(s) apa adanya', () => {
    expect(assetUrl('https://images.unsplash.com/x')).toBe('https://images.unsplash.com/x')
  })
})
