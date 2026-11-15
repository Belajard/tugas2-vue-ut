import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useReportsStore } from '../../src/stores/reports.js'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('reports store', () => {
  it('awal kosong; add menaruh laporan baru di depan dengan status New', () => {
    const r = useReportsStore()
    expect(r.items).toEqual([])
    r.add({ doNum: 'DO2026-001', category: 'Barang Rusak', description: 'a', studentName: 'X' })
    const second = r.add({ doNum: '-', category: 'Lainnya', description: 'b', studentName: 'Y' })
    expect(r.items[0].id).toBe(second.id)
    expect(second.status).toBe('New')
    expect(second.id).toMatch(/^REP-\d{4}$/)
  })
  it('setStatus dan remove', () => {
    const r = useReportsStore()
    const rep = r.add({ doNum: '-', category: 'c', description: 'd', studentName: 'X' })
    r.setStatus(rep.id, 'Resolved')
    expect(r.items[0].status).toBe('Resolved')
    r.remove(rep.id)
    expect(r.items).toHaveLength(0)
  })
})
