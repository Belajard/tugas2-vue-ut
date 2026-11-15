import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrdersStore, STATUS_FLOW } from '../../src/stores/orders.js'
import { useStocksStore } from '../../src/stores/stocks.js'

const base = {
  nim: '052664742', studentName: 'Dija Arrahmah', moduleCode: 'EKMA4310',
  moduleName: 'Kepemimpinan', qty: 5, address: 'Jl. Uji', ekspedisi: 'JNE Regular', total: 'Rp 55.000',
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('orders store', () => {
  it('dimuat dari data awal (5 pesanan); JSON rusak memakai data awal', () => {
    expect(useOrdersStore().items).toHaveLength(5)
    localStorage.setItem('ut_orders', '{bad')
    setActivePinia(createPinia())
    expect(useOrdersStore().items).toHaveLength(5)
  })
  it('STATUS_FLOW sesuai spec', () => {
    expect(STATUS_FLOW).toEqual(['Pending Approval', 'Confirmed', 'In Transit', 'Delivered', 'Finished'])
  })
  it('generateDoNumber tidak bentrok dengan nomor yang ada dan naik berurutan', () => {
    const o = useOrdersStore()
    const year = new Date().getFullYear()
    const n1 = o.generateDoNumber()
    expect(n1).toMatch(new RegExp(`^DO${year}-\\d{3}$`))
    expect(o.items.some((x) => x.doNum === n1)).toBe(false)
    o.create(base)
    const n2 = o.generateDoNumber()
    expect(n2).not.toBe(n1)
  })
  it('create membuat pesanan Pending Approval dengan id = doNum', () => {
    const o = useOrdersStore()
    const order = o.create(base)
    expect(order.status).toBe('Pending Approval')
    expect(order.id).toBe(order.doNum)
    expect(o.findByDo(order.doNum.toLowerCase())).toBeDefined()
  })
  it('Confirmed ditolak bila qty melebihi stok; stok tetap', () => {
    const o = useOrdersStore()
    const stocks = useStocksStore()
    const order = o.create({ ...base, qty: 30 })
    const r = o.setStatus(order.id, 'Confirmed')
    expect(r.ok).toBe(false)
    expect(r.message).toBe('Gagal! Stok EKMA4310 tidak mencukupi.')
    expect(stocks.items.find((i) => i.kode === 'EKMA4310').qty).toBe(25)
    expect(o.items.find((x) => x.id === order.id).status).toBe('Pending Approval')
  })
  it('Confirmed mengurangi stok; status berikutnya tidak mengurangi lagi', () => {
    const o = useOrdersStore()
    const stocks = useStocksStore()
    const order = o.create({ ...base, qty: 5 })
    expect(o.setStatus(order.id, 'Confirmed').ok).toBe(true)
    expect(stocks.items.find((i) => i.kode === 'EKMA4310').qty).toBe(20)
    o.setStatus(order.id, 'In Transit')
    expect(stocks.items.find((i) => i.kode === 'EKMA4310').qty).toBe(20)
  })
  it('modul paket (PKT-01) dikonfirmasi tanpa mengubah stok', () => {
    const o = useOrdersStore()
    const stocks = useStocksStore()
    const before = stocks.totalUnits
    const order = o.create({ ...base, moduleCode: 'PKT-01' })
    expect(o.setStatus(order.id, 'Confirmed').ok).toBe(true)
    expect(stocks.totalUnits).toBe(before)
  })
  it('byStudent dan remove', () => {
    const o = useOrdersStore()
    const order = o.create(base)
    expect(o.byStudent('Dija Arrahmah').map((x) => x.id)).toContain(order.id)
    o.remove(order.id)
    expect(o.findByDo(order.doNum)).toBeUndefined()
  })
})
