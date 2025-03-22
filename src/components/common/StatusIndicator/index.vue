<template>
  <div class="profile-status">
    <div class="status-dot" :class="statusClass"></div>
    <span>{{ status?.label || defaultLabel }}</span>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getStatusClass } from '@/utils/statusUtils'
import '@/assets/status.scss'

const props = defineProps({
  status: {
    type: Object,
    default: () => ({ label: '在线' }),
  },
  defaultLabel: {
    type: String,
    default: '在线',
  },
})
// 根据状态标签获取对应的CSS类名
const statusClass = computed(() => {
  return getStatusClass(props.status?.label)
})
</script>
