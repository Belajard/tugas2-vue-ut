<template>
  <div
    :class="[
      'fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] transform transition-all duration-300 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3',
      notify.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
    ]"
    data-test="toast"
  >
    <span class="material-symbols-outlined text-secondary">info</span>
    <span class="text-xs font-bold tracking-tight">{{ notify.message }}</span>
  </div>
</template>

<script setup>
import { useNotifyStore } from '../stores/notify.js'

const notify = useNotifyStore()
</script>
