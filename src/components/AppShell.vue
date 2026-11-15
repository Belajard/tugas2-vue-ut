<template>
  <div class="bg-[#f8fafc] dark:bg-slate-950 font-body text-[#181c1e] dark:text-slate-100 min-h-screen flex flex-col md:flex-row transition-colors duration-300">
    <Sidebar :open="menuOpen" />
    <div class="main-content flex flex-col flex-grow w-full overflow-x-hidden md:min-h-screen">
      <Topbar @toggle-menu="menuOpen = !menuOpen" />
      <main class="flex-1 p-4 sm:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (menuOpen.value = false))
</script>
