<template>
  <div class="friend-manager-view">
    <ChatSidebar />
    <FriendManager />
  </div>
</template>

<script setup>
import ChatSidebar from './components/ChatSidebar.vue';
import FriendManager from './components/FriendManager.vue';
</script>

<style>
.friend-manager-view {
  display: flex;
  height: 100vh;
}
</style>
