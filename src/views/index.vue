<template>
  <div class="chat-container">
    <Sidebar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar/index.vue'

onMounted(() => {})
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f9f9f9;

  .main-content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
