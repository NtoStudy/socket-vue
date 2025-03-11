<template>
  <div class="chat-list">
    <AllChats />
  </div>
</template>

<script setup>
import AllChats from './AllChats/index.vue'
</script>

<style lang="scss">
.chat-list {
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 8px;
}
</style>
