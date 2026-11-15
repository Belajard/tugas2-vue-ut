import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotifyStore = defineStore('notify', () => {
  const message = ref('')
  const visible = ref(false)
  let timer = null
  const notifications = ref([])

  function toast(text) {
    message.value = text
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (visible.value = false), 3000)
  }

  function addNotification(text) {
    notifications.value.unshift({ id: Date.now() + Math.random(), text, time: new Date().toISOString() })
  }

  function clearNotifications() {
    notifications.value = []
  }

  return { message, visible, toast, notifications, addNotification, clearNotifications }
})
