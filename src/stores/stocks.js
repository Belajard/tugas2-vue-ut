import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { load, save } from '../lib/storage.js'
import { initialStocks } from '../data/seed.js'

const KEY = 'ut_stocks'
const CODE_PATTERN = /^[A-Z]{4}\d{4}$/
const DEFAULT_FOTO = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop'

function loadItems() {
  const data = load(KEY, null)
  const valid = Array.isArray(data) && data.length > 0 && data.every((i) => i && typeof i.kode === 'string')
  return valid ? data : structuredClone(initialStocks)
}

export function validateStock(input, existing = []) {
  const errors = {}
  const kode = String(input.kode ?? '').trim()
  if (!kode) errors.kode = 'Kode barang wajib diisi.'
  else if (!CODE_PATTERN.test(kode.toUpperCase())) errors.kode = 'Format kode harus 4 huruf + 4 angka (contoh: ASIP4301).'
  else if (existing.some((s) => s.kode.toUpperCase() === kode.toUpperCase())) errors.kode = 'Kode barang sudah terdaftar!'
  if (!String(input.judul ?? '').trim()) errors.judul = 'Nama bahan ajar wajib diisi.'
  if (!input.Kategori) errors.Kategori = 'Kategori wajib dipilih.'
  if (!input.upbjj) errors.upbjj = 'UT-Daerah wajib dipilih.'
  if (!String(input.lokasiRak ?? '').trim()) errors.lokasiRak = 'Lokasi Rak wajib diisi.'
  if (input.qty === null || input.qty === undefined || input.qty === '' || input.qty < 0) errors.qty = 'Jumlah stok tidak boleh kosong atau < 0.'
  if (input.safety === null || input.safety === undefined || input.safety === '' || input.safety < 0) errors.safety = 'Batas safety stok tidak boleh kosong atau < 0.'
  if (input.harga === null || input.harga === undefined || input.harga === '' || input.harga <= 0) errors.harga = 'Harga satuan harus > 0.'
  return errors
}

export const useStocksStore = defineStore('stocks', () => {
  const items = ref(loadItems())
  watch(items, (v) => save(KEY, v), { deep: true })

  const statusOf = (item) => (item.qty === 0 ? 'kosong' : item.qty < item.safety ? 'menipis' : 'aman')
  const lowStock = computed(() => items.value.filter((i) => statusOf(i) === 'menipis'))
  const empty = computed(() => items.value.filter((i) => statusOf(i) === 'kosong'))
  const totalUnits = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))

  function add(input) {
    const errors = validateStock(input, items.value)
    if (Object.keys(errors).length) return { ok: false, errors }
    items.value.unshift({
      kode: String(input.kode).toUpperCase().trim(),
      judul: input.judul.trim(),
      Kategori: input.Kategori,
      upbjj: input.upbjj,
      lokasiRak: input.lokasiRak.trim(),
      qty: parseInt(input.qty) || 0,
      safety: parseInt(input.safety) || 0,
      harga: parseFloat(input.harga) || 0,
      catatanHTML: input.catatanHTML ? input.catatanHTML.trim() : 'Tersedia',
      foto: input.foto || DEFAULT_FOTO,
    })
    return { ok: true }
  }

  function update(kode, patch) {
    const idx = items.value.findIndex((i) => i.kode === kode)
    if (idx === -1) return false
    items.value[idx] = { ...items.value[idx], ...patch }
    return true
  }

  function remove(kode) {
    items.value = items.value.filter((i) => i.kode !== kode)
  }

  function decrement(kode, qty) {
    const item = items.value.find((i) => i.kode === kode)
    if (!item) return true
    if (item.qty < qty) return false
    item.qty -= qty
    return true
  }

  return { items, statusOf, lowStock, empty, totalUnits, add, update, remove, decrement }
})
