import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ADMIN_ROLES, dataPengguna } from '../data/seed.js'

function readUser() {
  const nama = localStorage.getItem('userName')
  if (!nama) return null
  return {
    nama,
    role: localStorage.getItem('userRole') || 'Guest',
    lokasi: localStorage.getItem('userLocation') || '',
    nim: localStorage.getItem('userNim') || '041234567',
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(readUser())
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => !!user.value && ADMIN_ROLES.includes(user.value.role))

  function login(email, password) {
    const found = dataPengguna.find(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase() && u.password === password,
    )
    if (!found) return false
    const role = found.role === 'Administrator' ? 'Admin' : found.role
    const nim = found.nim || '041234567'
    localStorage.setItem('userRole', role)
    localStorage.setItem('userName', found.nama)
    localStorage.setItem('userLocation', found.lokasi)
    localStorage.setItem('userNim', nim)
    user.value = { nama: found.nama, role, lokasi: found.lokasi, nim }
    return true
  }

  function logout() {
    ;['userName', 'userRole', 'userActualRole', 'userLocation', 'userNim'].forEach((k) =>
      localStorage.removeItem(k),
    )
    user.value = null
  }

  return { user, isLoggedIn, isAdmin, login, logout }
})
