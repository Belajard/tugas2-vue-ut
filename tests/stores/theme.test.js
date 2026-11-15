import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '../../src/stores/theme.js'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  setActivePinia(createPinia())
})

describe('theme store', () => {
  it('toggle menyimpan tema dan mengatur kelas dark', () => {
    const t = useThemeStore()
    t.init()
    t.toggle()
    expect(t.isDark).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    t.toggle()
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
  it('init memulihkan tema gelap yang tersimpan', () => {
    localStorage.setItem('theme', 'dark')
    const t = useThemeStore()
    t.init()
    expect(t.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
