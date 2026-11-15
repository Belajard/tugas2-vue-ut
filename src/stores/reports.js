import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { load, save } from '../lib/storage.js'

const KEY = 'ut_reports'

export const useReportsStore = defineStore('reports', () => {
  const data = load(KEY, [])
  const items = ref(Array.isArray(data) ? data : [])
  watch(items, (v) => save(KEY, v), { deep: true })

  function add({ doNum, category, description, studentName }) {
    const report = {
      id: `REP-${Math.floor(Math.random() * 9000 + 1000)}`,
      doNum: doNum || '-',
      category,
      description,
      date: new Date().toISOString(),
      status: 'New',
      studentName,
    }
    items.value.unshift(report)
    return items.value[0]
  }

  function setStatus(id, status) {
    const r = items.value.find((x) => x.id === id)
    if (r) r.status = status
  }

  function remove(id) {
    items.value = items.value.filter((x) => x.id !== id)
  }

  return { items, add, setStatus, remove }
})
