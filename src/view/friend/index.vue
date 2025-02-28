<template>
  <div class="friend-manager-view">
    <ChatSidebar />
    <FriendManager />
  </div>
</template>

<script setup>
import ChatSidebar from './slider/index.vue'
import FriendManager from './FriendManager/index.vue'
</script>

<style>
.friend-manager-view {
  display: flex;
  height: 100vh;
}
</style>
