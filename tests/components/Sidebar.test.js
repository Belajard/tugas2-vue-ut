import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../../src/router.js'
import { useAuthStore } from '../../src/stores/auth.js'
import Sidebar from '../../src/components/Sidebar.vue'

async function render(email, password) {
  const pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore().login(email, password)
  const router = createAppRouter(createMemoryHistory())
  await router.push('/dashboard')
  await router.isReady()
  return mount(Sidebar, { global: { plugins: [pinia, router] } })
}

beforeEach(() => localStorage.clear())

describe('Sidebar', () => {
  it('mahasiswa tidak melihat Laporan Masalah dan Histori Pengiriman', async () => {
    const w = await render('mahasiswa@ut.ac.id', 'mahasiswa123')
    expect(w.text()).toContain('Pesanan')
    expect(w.text()).not.toContain('Laporan Masalah')
    expect(w.text()).not.toContain('Histori Pengiriman')
  })
  it('admin melihat semua menu', async () => {
    const w = await render('admin@ut.ac.id', 'admin123')
    expect(w.text()).toContain('Laporan Masalah')
    expect(w.text()).toContain('Histori Pengiriman')
  })
  it('tombol logout menghapus sesi', async () => {
    const w = await render('admin@ut.ac.id', 'admin123')
    await w.find('[data-test="logout"]').trigger('click')
    expect(useAuthStore().isLoggedIn).toBe(false)
  })
})
