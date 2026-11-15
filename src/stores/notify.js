import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotifyStore = defineStore('notify', () => {
  const message = ref('')
  const visible = ref(false)
  let timer = null

  function toast(text) {
    message.value = text
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (visible.value = false), 3000)
  }

  return { message, visible, toast }
})
