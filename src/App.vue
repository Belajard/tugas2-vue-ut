<template>
  <div class="bg-[#f8fafc] dark:bg-slate-950 font-body text-[#181c1e] dark:text-slate-100 min-h-screen" v-if="route.name === 'login'">
    <RouterView />
  </div>
  <AppShell v-else>
    <RouterView />
  </AppShell>
  <ToastHost />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppShell from './components/AppShell.vue'
import ToastHost from './components/ToastHost.vue'

const route = useRoute()
</script>
