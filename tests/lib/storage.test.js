import { describe, it, expect, beforeEach } from 'vitest'
import { load, save } from '../../src/lib/storage.js'

beforeEach(() => localStorage.clear())

describe('storage', () => {
  it('mengembalikan fallback bila JSON rusak', () => {
    localStorage.setItem('x', '{bad')
    expect(load('x', [])).toEqual([])
  })
  it('mengembalikan fallback bila kunci tidak ada', () => {
    expect(load('nope', { a: 1 })).toEqual({ a: 1 })
  })
  it('save lalu load mengembalikan nilai yang sama', () => {
    save('k', [{ a: 1 }])
    expect(load('k', [])).toEqual([{ a: 1 }])
  })
})
