import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { load, save } from '../lib/storage.js'
import { initialOrders } from '../data/seed.js'
import { useStocksStore } from './stocks.js'

const KEY = 'ut_orders'
export const STATUS_FLOW = ['Pending Approval', 'Confirmed', 'In Transit', 'Delivered', 'Finished']

function loadItems() {
  const data = load(KEY, null)
  return Array.isArray(data) ? data : structuredClone(initialOrders)
}

export const useOrdersStore = defineStore('orders', () => {
  const items = ref(loadItems())
  watch(items, (v) => save(KEY, v), { deep: true })

  function generateDoNumber() {
    const prefix = `DO${new Date().getFullYear()}-`
    let max = 0
    for (const o of items.value) {
      if (o.doNum && o.doNum.startsWith(prefix)) {
        const n = parseInt(o.doNum.split('-')[1]) || 0
        if (n > max) max = n
      }
    }
    return prefix + String(max + 1).padStart(3, '0')
  }

  function create(input) {
    const doNum = input.doNum || generateDoNumber()
    const order = {
      qty: 1,
      date: new Date().toISOString(),
      ...input,
      id: doNum,
      doNum,
      status: 'Pending Approval',
    }
    items.value.push(order)
    return items.value[items.value.length - 1]
  }

  const find = (id) => items.value.find((o) => String(o.id) === String(id) || o.doNum === id)

  function setStatus(id, status) {
    const order = find(id)
    if (!order) return { ok: false, message: 'Pesanan tidak ditemukan.' }
    if (status === 'Confirmed' && order.status !== 'Confirmed') {
      const ok = useStocksStore().decrement(order.moduleCode, order.qty || 1)
      if (!ok) return { ok: false, message: `Gagal! Stok ${order.moduleCode} tidak mencukupi.` }
    }
    order.status = status
    return { ok: true, message: `Status ${order.doNum} diperbarui.` }
  }

  function remove(id) {
    items.value = items.value.filter((o) => !(String(o.id) === String(id) || o.doNum === id))
  }

  const byStudent = (nama) => items.value.filter((o) => o.studentName === nama)
  const findByDo = (doNum) => items.value.find((o) => (o.doNum || '').toLowerCase() === String(doNum).toLowerCase())

  return { items, generateDoNumber, create, setStatus, remove, byStudent, findByDo }
})
