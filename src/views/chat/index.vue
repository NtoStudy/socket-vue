<template>
  <div class="chat-container">
    <slider />
    <message />
  </div>
</template>

<script setup>
import slider from '@/components/chat/controlFunction/index.vue'
import message from '@/components/chat/message/index.vue'
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  background-color: #f5f5f5;
}
</style>
