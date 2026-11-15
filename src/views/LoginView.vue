<template>
  <div class="min-h-screen flex flex-col justify-between">
    <header class="bg-primary dark:bg-slate-900 fixed top-0 w-full z-50 h-16 flex items-center justify-between px-6 border-b border-blue-900 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary overflow-hidden p-1 font-black text-xs border border-accent">
          <img :src="assetUrl('assets/logo_ut.png')" alt="Universitas Terbuka" class="w-full h-full object-contain" />
        </div>
        <span class="text-xl font-bold font-sans text-white">Universitas Terbuka</span>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 rounded-full hover:bg-white/10 text-white/70" title="Toggle Theme" @click="theme.toggle()">
          <span class="material-symbols-outlined">{{ theme.isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <button class="p-2 rounded-full hover:bg-white/10 text-white/70" title="Notifications" @click="notify.toast('Welcome to UT Logistic System. Please login to continue.')">
          <span class="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>

    <main class="flex-grow pt-24 pb-8 flex items-center justify-center p-6">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-lg shadow-card border border-[#e2e8f0] dark:border-slate-800 transition-colors">
        <div class="mb-8 text-center text-slate-800 dark:text-white">
          <div class="inline-flex bg-white border-2 border-primary p-3 rounded-full mb-4 w-16 h-16 overflow-hidden shadow-lg shadow-blue-100 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300">
            <img :src="assetUrl('assets/logo_ut.png')" alt="Universitas Terbuka" class="w-full h-full object-contain" />
          </div>
          <h1 class="text-xl font-bold font-sans mb-1">Sistem Bahan Ajar UT</h1>
          <p class="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-tight">Access Your Academic Portal</p>
        </div>

        <div class="bg-slate-100 dark:bg-slate-800 p-1 rounded-md flex mb-6">
          <button
            data-test="tab-student"
            :class="tabClass(isStudent)"
            @click="role = 'student'"
          >Mahasiswa</button>
          <button
            data-test="tab-admin"
            :class="tabClass(!isStudent)"
            @click="role = 'admin'"
          >Administrator</button>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ isStudent ? 'Email Mahasiswa' : 'Administrator ID' }}</label>
            <input v-model="email" type="email" required class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md outline-none focus:ring-2 focus:ring-primary transition-all text-sm" :placeholder="isStudent ? 'mahasiswa@ut.ac.id' : 'admin@ut.ac.id'" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
            <input v-model="password" type="password" required class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md outline-none focus:ring-2 focus:ring-primary transition-all text-sm" placeholder="••••••••" />
          </div>
          <div class="flex items-center justify-between py-1">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="w-3.5 h-3.5 rounded border-gray-300 dark:border-slate-600 text-primary-container focus:ring-primary" />
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Remember me</span>
            </label>
            <button type="button" class="text-xs font-bold text-primary dark:text-secondary hover:underline" @click="modal = 'lupa'">Lupa Password?</button>
          </div>
          <button type="submit" class="w-full bg-primary hover:bg-primary-container text-white font-bold py-2.5 rounded-md shadow-md transform transition active:scale-[0.98]">LOGIN</button>
        </form>

        <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-md">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">PANDUAN LOGIN:</p>
          <div class="space-y-2">
            <div class="flex justify-between items-start text-[10px]">
              <span class="text-slate-500 font-bold whitespace-nowrap">MAHASISWA:</span>
              <span class="text-primary dark:text-secondary font-mono text-right font-bold">mahasiswa@ut.ac.id | mahasiswa123</span>
            </div>
            <div class="flex justify-between items-start text-[10px] border-t border-slate-250 dark:border-slate-700 pt-1">
              <span class="text-slate-500 font-bold whitespace-nowrap">STAFF UPBJJ:</span>
              <div class="flex flex-col items-end">
                <span class="text-primary dark:text-secondary font-mono">rina@ut.ac.id | rina123</span>
                <span class="text-primary dark:text-secondary font-mono">agus@ut.ac.id | agus123</span>
              </div>
            </div>
            <div class="flex justify-between text-[10px] border-t border-slate-250 dark:border-slate-700 pt-1">
              <span class="text-slate-500 font-bold">ADMIN SITTA:</span>
              <span class="text-primary dark:text-secondary font-mono">admin@ut.ac.id | admin123</span>
            </div>
          </div>
          <p class="text-[8px] text-slate-400 mt-2 italic">*Gunakan data di atas untuk testing</p>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-center">
          <button class="text-xs font-bold text-primary dark:text-secondary hover:underline" @click="modal = 'daftar'">Daftar Akun Baru</button>
        </div>
      </div>
    </main>

    <footer class="py-6 text-center text-gray-400 text-[10px] uppercase tracking-[0.2em] w-full">
      © 2026 Universitas Terbuka. ALL RIGHTS RESERVED.
    </footer>

    <div v-if="modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="modal = ''"></div>
      <div class="bg-white dark:bg-slate-900 rounded-lg p-8 max-w-sm w-full relative z-[101] shadow-2xl border border-slate-200 dark:border-slate-800">
        <template v-if="modal === 'lupa'">
          <h2 class="text-xl font-bold text-primary dark:text-secondary mb-4">Lupa Password?</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Silakan hubungi IT Helpdesk Universitas Terbuka atau cek email universitas Anda untuk langkah pemulihan.</p>
          <button class="w-full bg-primary text-white py-3 rounded-md font-bold" @click="modal = ''">Mengerti</button>
        </template>
        <template v-else>
          <h2 class="text-xl font-bold text-primary dark:text-secondary mb-4">Daftar Akun Baru</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Pendaftaran akun hanya dapat dilakukan melalui portal SIA (Sistem Informasi Akademik) Universitas Terbuka.</p>
          <button class="w-full bg-primary text-white py-3 rounded-xl font-bold" @click="modal = ''">Ke Portal SIA</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useNotifyStore } from '../stores/notify.js'
import { useThemeStore } from '../stores/theme.js'
import { assetUrl } from '../lib/assetUrl.js'

const auth = useAuthStore()
const notify = useNotifyStore()
const theme = useThemeStore()
const router = useRouter()
const route = useRoute()

const role = ref('student')
const isStudent = computed(() => role.value === 'student')
const email = ref('')
const password = ref('')
const modal = ref('')

const tabClass = (active) =>
  'flex-1 py-1.5 px-4 rounded font-bold text-xs uppercase transition-all ' +
  (active ? 'bg-white dark:bg-slate-700 text-primary dark:text-secondary shadow-sm' : 'text-slate-500 dark:text-slate-400')

function submit() {
  if (auth.login(email.value, password.value)) router.push({ name: 'dashboard' })
  else notify.toast('Email atau Password salah!')
}

onMounted(() => {
  if (route.query.logout === 'true') notify.toast('Anda telah sukses keluar sistem.')
})
</script>
