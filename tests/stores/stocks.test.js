import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useStocksStore } from '../../src/stores/stocks.js'

const valid = {
  kode: 'abcd1234', judul: 'Bahan Baru', Kategori: 'BMP', upbjj: 'Jakarta',
  lokasiRak: 'Rak Z-01', qty: 10, safety: 5, harga: 1000,
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('stocks store', () => {
  it('dimuat dari data awal (7 item)', () => {
    expect(useStocksStore().items).toHaveLength(7)
  })
  it('data lama tanpa field kode diganti data awal', () => {
    localStorage.setItem('ut_stocks', JSON.stringify([{ code: 'X', name: 'Lama', stock: 3 }]))
    setActivePinia(createPinia())
    expect(useStocksStore().items).toHaveLength(7)
  })
  it('JSON rusak memakai data awal', () => {
    localStorage.setItem('ut_stocks', '{bad')
    setActivePinia(createPinia())
    expect(useStocksStore().items).toHaveLength(7)
  })
  it('add menolak kode yang sudah ada tanpa peduli huruf besar/kecil', () => {
    const r = useStocksStore().add({ ...valid, kode: 'asip4301' })
    expect(r.ok).toBe(false)
    expect(r.errors.kode).toBe('Kode barang sudah terdaftar!')
  })
  it('add menolak format kode salah dan field wajib kosong', () => {
    const r = useStocksStore().add({ ...valid, kode: 'AB12', judul: '', harga: 0 })
    expect(r.ok).toBe(false)
    expect(r.errors.kode).toMatch(/Format kode/)
    expect(r.errors.judul).toBeDefined()
    expect(r.errors.harga).toBeDefined()
  })
  it('add menerima data valid, kode jadi huruf besar, ditaruh paling depan', () => {
    const s = useStocksStore()
    const r = s.add(valid)
    expect(r.ok).toBe(true)
    expect(s.items[0].kode).toBe('ABCD1234')
    expect(s.items).toHaveLength(8)
  })
  it('perubahan tersimpan ke ut_stocks', async () => {
    const s = useStocksStore()
    s.add(valid)
    await nextTick()
    expect(JSON.parse(localStorage.getItem('ut_stocks'))[0].kode).toBe('ABCD1234')
  })
  it('decrement menolak bila stok kurang dan tidak mengubah qty', () => {
    const s = useStocksStore()
    expect(s.decrement('BIOL4211', 1)).toBe(false)
    expect(s.items.find((i) => i.kode === 'BIOL4211').qty).toBe(0)
  })
  it('decrement mengurangi qty bila cukup', () => {
    const s = useStocksStore()
    expect(s.decrement('EKMA4310', 5)).toBe(true)
    expect(s.items.find((i) => i.kode === 'EKMA4310').qty).toBe(20)
  })
  it('decrement untuk kode tanpa entri stok (PKT-01) berhasil tanpa efek', () => {
    const s = useStocksStore()
    const before = JSON.stringify(s.items)
    expect(s.decrement('PKT-01', 1)).toBe(true)
    expect(JSON.stringify(s.items)).toBe(before)
  })
  it('statusOf: kosong, menipis, aman', () => {
    const s = useStocksStore()
    const by = (k) => s.items.find((i) => i.kode === k)
    expect(s.statusOf(by('BIOL4211'))).toBe('kosong')
    expect(s.statusOf(by('EKMA4310'))).toBe('menipis')
    expect(s.statusOf(by('ASIP4301'))).toBe('aman')
  })
  it('getter lowStock, empty, totalUnits', () => {
    const s = useStocksStore()
    expect(s.empty.map((i) => i.kode)).toEqual(['BIOL4211'])
    expect(s.lowStock.map((i) => i.kode)).toContain('EKMA4310')
    expect(s.totalUnits).toBe(548 + 392 + 25 + 0 + 204 + 85 + 12)
  })
  it('update dan remove', () => {
    const s = useStocksStore()
    s.update('ASIP4301', { qty: 1 })
    expect(s.items.find((i) => i.kode === 'ASIP4301').qty).toBe(1)
    s.remove('ASIP4301')
    expect(s.items.find((i) => i.kode === 'ASIP4301')).toBeUndefined()
  })
})
