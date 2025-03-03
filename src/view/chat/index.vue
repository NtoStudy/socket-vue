<template>
  <div class="chat-container">
    <slider />
    <message />
  </div>
</template>

<script setup>
import slider from './componenets/slider/index.vue'
import message from './componenets/message/index.vue'
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  background-color: #f5f5f5;
}
</style>
