import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../src/router.js'
import { useAuthStore } from '../src/stores/auth.js'

export const MAHASISWA = ['mahasiswa@ut.ac.id', 'mahasiswa123']
export const ADMIN = ['admin@ut.ac.id', 'admin123']

export async function mountView(Component, { as, path = '/dashboard' } = {}) {
  localStorage.clear()
  const pinia = createPinia()
  setActivePinia(pinia)
  if (as) useAuthStore().login(...as)
  const router = createAppRouter(createMemoryHistory())
  await router.push(path)
  await router.isReady()
  const wrapper = mount(Component, { global: { plugins: [pinia, router] }, attachTo: document.body })
  await flushPromises()
  return { wrapper, router, pinia }
}

export { flushPromises }
