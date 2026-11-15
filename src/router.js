import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import LoginView from './views/LoginView.vue'
import DashboardView from './views/DashboardView.vue'
import PesananView from './views/PesananView.vue'
import StokView from './views/StokView.vue'
import TrackingView from './views/TrackingView.vue'
import LaporanView from './views/LaporanView.vue'
import HistoriView from './views/HistoriView.vue'

export const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  { path: '/pesanan', name: 'pesanan', component: PesananView },
  { path: '/stok', name: 'stok', component: StokView },
  { path: '/tracking', name: 'tracking', component: TrackingView },
  { path: '/laporan', name: 'laporan', component: LaporanView, meta: { adminOnly: true } },
  { path: '/histori', name: 'histori', component: HistoriView, meta: { adminOnly: true } },
  { path: '/', redirect: '/dashboard' },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

export function createAppRouter(history = createWebHashHistory()) {
  const router = createRouter({ history, routes })
  router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.name === 'login') return auth.isLoggedIn ? { name: 'dashboard' } : true
    if (!auth.isLoggedIn) return { name: 'login' }
    if (to.meta.adminOnly && !auth.isAdmin) return { name: 'dashboard' }
    return true
  })
  return router
}
