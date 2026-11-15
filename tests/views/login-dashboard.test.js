import { describe, it, expect } from 'vitest'
import { mountView, flushPromises, MAHASISWA, ADMIN } from '../helpers.js'
import { useNotifyStore } from '../../src/stores/notify.js'
import { useAuthStore } from '../../src/stores/auth.js'
import { useReportsStore } from '../../src/stores/reports.js'
import LoginView from '../../src/views/LoginView.vue'
import DashboardView from '../../src/views/DashboardView.vue'

async function submitLogin(wrapper, email, password) {
  await wrapper.find('input[type="email"]').setValue(email)
  await wrapper.find('input[type="password"]').setValue(password)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
}

describe('LoginView', () => {
  it('akun salah: toast dan tetap di /login', async () => {
    const { wrapper, router } = await mountView(LoginView, { path: '/login' })
    await submitLogin(wrapper, 'x@ut.ac.id', 'salah')
    expect(useNotifyStore().message).toBe('Email atau Password salah!')
    expect(router.currentRoute.value.path).toBe('/login')
  })
  it('akun benar: login dan menuju /dashboard', async () => {
    const { wrapper, router } = await mountView(LoginView, { path: '/login' })
    await submitLogin(wrapper, ...MAHASISWA)
    expect(useAuthStore().isLoggedIn).toBe(true)
    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
  it('tab peran mengubah label dan placeholder email', async () => {
    const { wrapper } = await mountView(LoginView, { path: '/login' })
    expect(wrapper.text()).toContain('Email Mahasiswa')
    await wrapper.find('[data-test="tab-admin"]').trigger('click')
    expect(wrapper.text()).toContain('Administrator ID')
    expect(wrapper.find('input[type="email"]').attributes('placeholder')).toBe('admin@ut.ac.id')
  })
  it('?logout=true menampilkan toast keluar', async () => {
    await mountView(LoginView, { path: '/login?logout=true' })
    expect(useNotifyStore().message).toBe('Anda telah sukses keluar sistem.')
  })
})

describe('DashboardView', () => {
  it('admin melihat 4 statistik dari store', async () => {
    const { wrapper } = await mountView(DashboardView, { as: ADMIN })
    const v = (t) => wrapper.find(`[data-test="${t}"]`).text()
    expect(v('stat-total')).toBe('5')
    expect(v('stat-pending')).toBe('1')
    expect(v('stat-shipping')).toBe('2')
    expect(v('stat-reports')).toBe('0')
    expect(wrapper.find('[data-test="stock-card"]').exists()).toBe(true)
  })
  it('mahasiswa tidak melihat kartu stok maupun statistik; hanya pesanannya', async () => {
    const { wrapper } = await mountView(DashboardView, { as: MAHASISWA })
    expect(wrapper.find('[data-test="stock-card"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="stat-total"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Histori Pesanan Saya')
    expect(wrapper.text()).toContain('Belum ada aktivitas pesanan.')
  })
  it('admin melihat 5 pesanan terbaru di tabel', async () => {
    const { wrapper } = await mountView(DashboardView, { as: ADMIN })
    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
  })
  it('cari DO yang tidak ada: toast; yang ada: ke /tracking?do=', async () => {
    const { wrapper, router } = await mountView(DashboardView, { as: ADMIN })
    const input = wrapper.find('[data-test="search-do"]')
    await input.setValue('DO9999-999')
    await wrapper.find('[data-test="search-do-btn"]').trigger('click')
    expect(useNotifyStore().message).toBe('Nomor DO tidak ditemukan.')
    await input.setValue('do2026-001')
    await wrapper.find('[data-test="search-do-btn"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe('/tracking?do=DO2026-001')
  })
  it('mahasiswa mengirim laporan kendala lewat modal', async () => {
    const { wrapper } = await mountView(DashboardView, { as: MAHASISWA })
    await wrapper.find('[data-test="open-report"]').trigger('click')
    await wrapper.find('[data-test="report-detail"]').setValue('Modul basah')
    await wrapper.find('[data-test="report-form"]').trigger('submit')
    const reports = useReportsStore()
    expect(reports.items).toHaveLength(1)
    expect(reports.items[0].studentName).toBe('Dija Arrahmah')
    expect(useNotifyStore().message).toBe('Laporan masalah Anda telah terkirim.')
  })
})
