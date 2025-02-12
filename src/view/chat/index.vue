<template>
  <div class="chat-container">
    <slider />
    <message />
  </div>
</template>

<script setup>
import slider from './slider/index.vue'
import message from './message/index.vue'

</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}


</style>
