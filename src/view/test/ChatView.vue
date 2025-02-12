<template>
  <div class="chat-view">
    <ChatSidebar />
    <ChatWindow />
  </div>
</template>

<script setup>
import ChatSidebar from './components/ChatSidebar.vue';
import ChatWindow from './components/ChatWindow.vue';
</script>

<style>
.chat-view {
  display: flex;
  height: 100vh;
}
</style>
