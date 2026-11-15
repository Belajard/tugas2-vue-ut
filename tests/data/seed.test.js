import { describe, it, expect } from 'vitest'
import { initialStocks, initialOrders, dataPengguna, upbjjList, paket, ADMIN_ROLES } from '../../src/data/seed.js'

describe('seed', () => {
  it('berisi 7 stok awal dengan model stok lengkap', () => {
    expect(initialStocks).toHaveLength(7)
    expect(initialStocks[0]).toMatchObject({ kode: 'ASIP4301', judul: 'Pengantar Ilmu Komunikasi', Kategori: 'BMP', upbjj: 'Jakarta', qty: 548, safety: 100, harga: 45000 })
  })
  it('berisi 5 UPBJJ, 4 paket, 6 pengguna, 5 pesanan awal', () => {
    expect(upbjjList).toHaveLength(5)
    expect(paket).toHaveLength(4)
    expect(dataPengguna).toHaveLength(6)
    expect(initialOrders).toHaveLength(5)
  })
  it('pesanan awal memakai doNum dan total dari data tracking', () => {
    const o = initialOrders.find((x) => x.doNum === 'DO2026-001')
    expect(o).toMatchObject({ studentName: 'Amir Nasution', moduleCode: 'PKT-01', status: 'Finished', total: 'Rp 150.000' })
  })
  it('ADMIN_ROLES sesuai spec', () => {
    expect(ADMIN_ROLES).toEqual(['Admin', 'UPBJJ-UT', 'Puslaba', 'Fakultas', 'Administrator'])
  })
})
