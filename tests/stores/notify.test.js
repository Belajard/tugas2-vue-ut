import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotifyStore } from '../../src/stores/notify.js'

beforeEach(() => {
  vi.useFakeTimers()
  setActivePinia(createPinia())
})

describe('notify store', () => {
  it('toast tampil lalu hilang setelah 3 detik', () => {
    const n = useNotifyStore()
    n.toast('Halo')
    expect(n.visible).toBe(true)
    expect(n.message).toBe('Halo')
    vi.advanceTimersByTime(3001)
    expect(n.visible).toBe(false)
  })
})

describe('notify store: daftar notifikasi', () => {
  it('addNotification menaruh yang terbaru di depan; clearNotifications mengosongkan', () => {
    const n = useNotifyStore()
    n.addNotification('satu')
    n.addNotification('dua')
    expect(n.notifications.map((x) => x.text)).toEqual(['dua', 'satu'])
    n.clearNotifications()
    expect(n.notifications).toEqual([])
  })
})
