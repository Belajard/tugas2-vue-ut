<template>
  <span :class="['px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter', color]">{{ status }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, default: '' } })

const COLORS = {
  'Pending Approval': 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  'In Transit': 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Finished: 'bg-slate-100 text-slate-700',
  Rejected: 'bg-red-100 text-red-700',
}
const color = computed(() => COLORS[props.status] || 'bg-slate-50 text-slate-500')
</script>
