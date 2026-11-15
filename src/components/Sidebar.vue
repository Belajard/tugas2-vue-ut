<template>
  <aside :class="['sidebar bg-primary dark:bg-slate-900 shadow-xl z-50 transition-colors duration-300', { active: open }]">
    <div class="p-6 border-b border-blue-900 bg-blue-950/20 dark:border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary font-black text-[10px] border-2 border-accent">
          <img :src="assetUrl('assets/logo_ut.png')" alt="Universitas Terbuka" class="w-full h-full object-contain p-1" />
        </div>
        <div>
          <div class="font-bold text-sm tracking-tight text-white">UT-Daerah</div>
          <div class="text-[10px] text-blue-300 font-bold uppercase tracking-widest leading-none mt-1">Logistik Bahan Ajar</div>
        </div>
      </div>
    </div>
    <nav class="flex-1 py-6 px-4 space-y-1">
      <RouterLink
        v-for="item in items"
        :key="item.name"
        :to="{ name: item.name }"
        class="w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors text-sm text-white font-medium opacity-80 hover:opacity-100 hover:bg-blue-800/40"
        active-class="bg-blue-800/40 !font-bold !opacity-100 border-l-4 border-accent"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="p-4 border-t border-blue-900">
      <button
        data-test="logout"
        class="w-full p-2 bg-red-650/20 hover:bg-red-650 text-red-100 hover:text-white transition-all text-xs font-bold rounded flex items-center justify-center gap-2"
        @click="logout"
      >
        <span class="material-symbols-outlined text-sm">logout</span>
        LOGOUT
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { assetUrl } from '../lib/assetUrl.js'

defineProps({ open: { type: Boolean, default: false } })

const auth = useAuthStore()
const router = useRouter()

const ALL = [
  { name: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { name: 'pesanan', label: 'Pesanan', icon: 'shopping_cart' },
  { name: 'stok', label: 'Informasi Stok', icon: 'inventory_2' },
  { name: 'tracking', label: 'Tracking Pengiriman', icon: 'local_shipping' },
  { name: 'laporan', label: 'Laporan Masalah', icon: 'report_problem', adminOnly: true },
  { name: 'histori', label: 'Histori Pengiriman', icon: 'history', adminOnly: true },
]
const items = computed(() => ALL.filter((i) => !i.adminOnly || auth.isAdmin))

function logout() {
  auth.logout()
  router.push({ name: 'login', query: { logout: 'true' } })
}
</script>
