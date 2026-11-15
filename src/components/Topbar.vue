<template>
  <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shadow-sm sticky top-0 z-40 transition-colors">
    <button class="md:hidden p-2 -ml-4" @click="$emit('toggle-menu')">
      <span class="material-symbols-outlined dark:text-white">menu</span>
    </button>
    <div class="text-slate-700 dark:text-slate-300 font-bold text-lg flex items-center gap-4">
      <span data-test="greeting">{{ greeting }}, {{ auth.user?.nama }}</span>
    </div>
    <div class="flex items-center gap-2 sm:gap-4 ml-auto">
      <div class="relative">
        <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors relative" title="Notifikasi" @click="showNotif = !showNotif">
          <span class="material-symbols-outlined">notifications</span>
          <span v-if="notify.notifications.length" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <div v-if="showNotif" class="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 rounded-xl z-50 overflow-hidden">
          <div class="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notifikasi Terbaru</span>
            <button class="text-[10px] text-blue-600 font-bold hover:underline" @click="notify.clearNotifications()">Hapus Semua</button>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <div v-if="!notify.notifications.length" class="p-8 text-center text-slate-400">
              <span class="material-symbols-outlined text-slate-200 dark:text-slate-700 text-4xl mb-2">notifications_off</span>
              <p class="text-xs">Belum ada notifikasi baru untuk Anda.</p>
            </div>
            <div v-for="n in notify.notifications" :key="n.id" class="p-3 text-xs border-b border-slate-50 dark:border-slate-700 dark:text-slate-200">{{ n.text }}</div>
          </div>
        </div>
      </div>
      <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors" title="Ganti Tema" @click="theme.toggle()">
        <span class="material-symbols-outlined">{{ theme.isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>
      <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
      <div class="flex items-center gap-3 pl-1">
        <div class="hidden sm:flex flex-col items-end">
          <span class="text-xs font-bold dark:text-white">{{ auth.user?.nama }}</span>
          <span class="text-[9px] font-black uppercase tracking-tighter text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">{{ auth.user?.role }}</span>
        </div>
        <div class="w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center font-black text-sm ring-2 ring-white dark:ring-slate-800 shadow-sm">
          {{ (auth.user?.nama || 'U').charAt(0).toUpperCase() }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useThemeStore } from '../stores/theme.js'
import { useNotifyStore } from '../stores/notify.js'

defineEmits(['toggle-menu'])

const auth = useAuthStore()
const theme = useThemeStore()
const notify = useNotifyStore()
const showNotif = ref(false)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  if (h < 19) return 'Selamat Sore'
  return 'Selamat Malam'
})
</script>
