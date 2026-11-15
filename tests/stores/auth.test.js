import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../src/stores/auth.js'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('auth store', () => {
  it('login admin berhasil dan Administrator disimpan sebagai Admin', () => {
    const s = useAuthStore()
    expect(s.login('admin@ut.ac.id', 'admin123')).toBe(true)
    expect(s.user.role).toBe('Admin')
    expect(s.isAdmin).toBe(true)
    expect(localStorage.getItem('userRole')).toBe('Admin')
    expect(localStorage.getItem('userName')).toBe('Admin SITTA')
  })
  it('password salah mengembalikan false dan tidak login', () => {
    const s = useAuthStore()
    expect(s.login('admin@ut.ac.id', 'salah')).toBe(false)
    expect(s.isLoggedIn).toBe(false)
  })
  it('email tidak peka huruf besar/kecil', () => {
    expect(useAuthStore().login('ADMIN@UT.AC.ID', 'admin123')).toBe(true)
  })
  it('mahasiswa bukan admin dan menyimpan nim', () => {
    const s = useAuthStore()
    s.login('mahasiswa@ut.ac.id', 'mahasiswa123')
    expect(s.isAdmin).toBe(false)
    expect(s.user.nim).toBe('052664742')
  })
  it('logout menghapus sesi', () => {
    const s = useAuthStore()
    s.login('admin@ut.ac.id', 'admin123')
    s.logout()
    expect(s.isLoggedIn).toBe(false)
    expect(localStorage.getItem('userName')).toBeNull()
  })
  it('memulihkan sesi dari localStorage', () => {
    localStorage.setItem('userName', 'Rina Wulandari')
    localStorage.setItem('userRole', 'UPBJJ-UT')
    setActivePinia(createPinia())
    const s = useAuthStore()
    expect(s.isLoggedIn).toBe(true)
    expect(s.isAdmin).toBe(true)
  })
})
