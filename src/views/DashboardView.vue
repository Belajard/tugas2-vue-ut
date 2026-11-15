<template>
  <div>
    <div class="card p-6 mb-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center text-center sm:text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] dark:text-slate-500">OPERATIONAL DATE</div>
        <div class="text-xl font-bold text-primary dark:text-secondary">{{ today }}</div>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-2">
        <span class="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-[10px] font-bold">SYSTEM ACTIVE</span>
        <span class="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold">STABLE</span>
      </div>
    </div>

    <div class="card p-4 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row gap-3 sm:items-center">
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cari Nomor DO</div>
      <input v-model="doQuery" data-test="search-do" type="text" placeholder="Contoh: DO2026-001" class="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md outline-none focus:ring-2 focus:ring-primary text-sm" @keyup.enter="searchDO" />
      <button data-test="search-do-btn" class="px-4 py-2 bg-primary text-white rounded-md text-xs font-bold uppercase" @click="searchDO">Lacak</button>
    </div>

    <div v-if="auth.isAdmin" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="s in stats" :key="s.test" :class="['card p-4 border border-slate-200 dark:border-slate-800 border-l-4 bg-white dark:bg-slate-900 transition-all hover:shadow-md rounded-xl', s.border]">
        <div class="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black mb-1">{{ s.label }}</div>
        <div :data-test="s.test" class="text-2xl font-black text-slate-800 dark:text-white">{{ s.value }}</div>
      </div>
    </div>

    <div v-if="!auth.isAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <button class="card p-6 flex items-center justify-between group hover:border-primary border border-slate-200 dark:border-slate-800 transition-all text-left bg-white dark:bg-slate-900 rounded-xl" @click="$router.push({ name: 'pesanan' })">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-2xl">add_shopping_cart</span>
          </div>
          <div>
            <div class="font-black text-slate-800 dark:text-white">Buat Pesanan Baru</div>
            <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Pesan bahan ajar sekarang</p>
          </div>
        </div>
        <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
      </button>
      <button data-test="open-report" class="card p-6 flex items-center justify-between group hover:border-red-500 border border-slate-200 dark:border-slate-800 transition-all text-left bg-white dark:bg-slate-900 rounded-xl" @click="reportOpen = true">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-650 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-2xl">report_problem</span>
          </div>
          <div>
            <div class="font-black text-slate-800 dark:text-white">Lapor Kendala</div>
            <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Komplain pengiriman rusak/lambat</p>
          </div>
        </div>
        <span class="material-symbols-outlined text-slate-300 group-hover:text-red-500 transition-colors">chevron_right</span>
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <button class="card p-6 flex items-center justify-between group hover:border-primary border border-slate-200 dark:border-slate-800 transition-all text-left bg-white dark:bg-slate-900 rounded-xl" @click="$router.push({ name: 'stok' })">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-105/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-2xl text-primary dark:text-secondary">inventory_2</span>
          </div>
          <div>
            <div class="font-black text-slate-800 dark:text-white">Kelola Informasi Stok Buku</div>
            <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Lihat, tambah & edit stok bahan ajar</p>
          </div>
        </div>
        <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
      </button>
      <button class="card p-6 flex items-center justify-between group hover:border-amber-500 border border-slate-200 dark:border-slate-800 transition-all text-left bg-white dark:bg-slate-900 rounded-xl" @click="$router.push({ name: 'tracking' })">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-105/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-2xl text-amber-500">local_shipping</span>
          </div>
          <div>
            <div class="font-black text-slate-800 dark:text-white">Lacak & Buat Delivery Order (DO)</div>
            <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Pembuatan DO baru & tracking do</p>
          </div>
        </div>
        <span class="material-symbols-outlined text-slate-300 group-hover:text-amber-500 transition-colors">chevron_right</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div v-if="auth.isAdmin" data-test="stock-card" class="lg:col-span-3 card p-8 bg-gradient-to-br from-primary to-primary-container text-white cursor-pointer group border-none rounded-xl" @click="$router.push({ name: 'stok' })">
        <div class="flex justify-between items-start mb-6">
          <div class="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <span class="material-symbols-outlined text-white text-3xl">menu_book</span>
          </div>
          <span class="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center transition-transform group-hover:rotate-45">
            <span class="material-symbols-outlined">arrow_outward</span>
          </span>
        </div>
        <h3 class="text-2xl font-bold mb-2">Informasi Bahan Ajar</h3>
        <p class="text-blue-100/70 text-sm max-w-md">Katalog lengkap, ketersediaan stok di gudang pusat, dan detail spesifikasi modul akademik terbaru.</p>
      </div>

      <div class="lg:col-span-3 card p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors rounded-xl shadow-lg">
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h3 class="font-bold text-primary dark:text-secondary flex items-center gap-2">
            <span class="material-symbols-outlined text-accent">history</span>
            {{ auth.isAdmin ? 'Histori Transaksi Terakhir' : 'Histori Pesanan Saya' }}
          </h3>
          <button class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline" @click="$router.push({ name: auth.isAdmin ? 'histori' : 'pesanan' })">Lihat Semua</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
              <tr>
                <th class="p-6">ID TRANSAKSI</th>
                <th class="p-6">TANGGAL</th>
                <th class="p-6">KODE BAHAN</th>
                <th class="p-6">STATUS</th>
              </tr>
            </thead>
            <tbody class="text-slate-600 dark:text-slate-300">
              <tr v-for="o in recent" :key="o.id" class="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="p-4 sm:p-6 font-mono font-bold text-primary dark:text-blue-400 text-[10px] sm:text-xs">{{ o.doNum }}</td>
                <td class="p-4 sm:p-6 text-[10px] sm:text-xs text-slate-500">{{ new Date(o.date).toLocaleDateString('id-ID') }}</td>
                <td class="p-4 sm:p-6 text-[10px] sm:text-xs dark:text-slate-400 font-bold uppercase">{{ o.moduleCode }}</td>
                <td class="p-4 sm:p-6"><StatusBadge :status="o.status" /></td>
              </tr>
              <tr v-if="!recent.length">
                <td colspan="4" class="p-10 text-center text-slate-400 italic font-medium uppercase text-[10px] tracking-widest">Belum ada aktivitas pesanan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="reportOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div class="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
          <h3 class="font-black text-red-650 flex items-center gap-2 text-sm">
            <span class="material-symbols-outlined">report_problem</span>
            FORM LAPORAN KENDALA
          </h3>
          <button class="text-slate-400 hover:text-slate-600 transition-colors" @click="reportOpen = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form data-test="report-form" class="p-6 space-y-4" @submit.prevent="submitReport">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Pilih Masalah</label>
            <select v-model="report.category" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white" required>
              <option value="Modul Kurang/Salah">Modul Kurang atau Salah</option>
              <option value="Modul Rusak/Basah">Modul Rusak atau Basah</option>
              <option value="Keterlambatan Pengiriman">Keterlambatan Pengiriman (&gt;7 hari)</option>
              <option value="Status Terkirim Tapi Belum Diterima">Status 'Selesai' Tapi Belum Diterima</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Nomor DO</label>
            <input v-model="report.doNum" type="text" placeholder="Contoh: DO-123456" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Detail Kejadian</label>
            <textarea v-model="report.description" data-test="report-detail" rows="3" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold dark:text-white" placeholder="Jelaskan kendala Anda secara detail..." required></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all" @click="reportOpen = false">Batal</button>
            <button type="submit" class="flex-2 px-4 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700 transition-all">Kirim Laporan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import StatusBadge from '../components/StatusBadge.vue'
import { useAuthStore } from '../stores/auth.js'
import { useNotifyStore } from '../stores/notify.js'
import { useOrdersStore } from '../stores/orders.js'
import { useReportsStore } from '../stores/reports.js'

const auth = useAuthStore()
const notify = useNotifyStore()
const orders = useOrdersStore()
const reports = useReportsStore()
const router = useRouter()

const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
const doQuery = ref('')
const reportOpen = ref(false)
const report = reactive({ category: 'Modul Kurang/Salah', doNum: '', description: '' })

const stats = computed(() => [
  { test: 'stat-total', label: 'Total Delivery Orders', value: orders.items.length.toLocaleString(), border: 'border-l-primary' },
  { test: 'stat-pending', label: 'Menunggu Persetujuan', value: orders.items.filter((o) => o.status === 'Pending Approval').length, border: 'border-l-amber-500' },
  { test: 'stat-shipping', label: 'Dalam Pengiriman', value: orders.items.filter((o) => o.status === 'In Transit').length, border: 'border-l-emerald-500' },
  { test: 'stat-reports', label: 'Laporan Kendala', value: reports.items.length, border: 'border-l-red-500' },
])

const recent = computed(() => {
  const list = auth.isAdmin ? [...orders.items] : orders.byStudent(auth.user.nama)
  return list.reverse().slice(0, 5)
})

function searchDO() {
  const q = doQuery.value.trim()
  if (!q) return notify.toast('Masukkan Nomor Delivery Order!')
  const found = orders.findByDo(q)
  if (found) router.push({ name: 'tracking', query: { do: found.doNum } })
  else notify.toast('Nomor DO tidak ditemukan.')
}

function submitReport() {
  reports.add({ doNum: report.doNum, category: report.category, description: report.description, studentName: auth.user.nama })
  notify.toast('Laporan masalah Anda telah terkirim.')
  reportOpen.value = false
  Object.assign(report, { category: 'Modul Kurang/Salah', doNum: '', description: '' })
}
</script>
