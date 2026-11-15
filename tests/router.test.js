import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../src/router.js'
import { useAuthStore } from '../src/stores/auth.js'

async function go(path) {
  const r = createAppRouter(createMemoryHistory())
  await r.push(path)
  return r.currentRoute.value.path
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('router guard', () => {
  it('belum login ke /stok berakhir di /login', async () => {
    expect(await go('/stok')).toBe('/login')
  })
  it('mahasiswa ke /laporan dan /histori dialihkan ke /dashboard', async () => {
    useAuthStore().login('mahasiswa@ut.ac.id', 'mahasiswa123')
    expect(await go('/laporan')).toBe('/dashboard')
    expect(await go('/histori')).toBe('/dashboard')
  })
  it('admin ke /laporan tetap di /laporan', async () => {
    useAuthStore().login('admin@ut.ac.id', 'admin123')
    expect(await go('/laporan')).toBe('/laporan')
  })
  it('sudah login ke /login dialihkan ke /dashboard', async () => {
    useAuthStore().login('mahasiswa@ut.ac.id', 'mahasiswa123')
    expect(await go('/login')).toBe('/dashboard')
  })
  it('/ dan rute tak dikenal menuju /dashboard saat sudah login', async () => {
    useAuthStore().login('mahasiswa@ut.ac.id', 'mahasiswa123')
    expect(await go('/')).toBe('/dashboard')
    expect(await go('/tidak-ada')).toBe('/dashboard')
  })
})
