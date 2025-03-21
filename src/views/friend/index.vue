<template>
  <div class="friend-manager-view">
    <FriendSidebar />
    <FriendManager />
  </div>
</template>

<script setup>
import FriendSidebar from '@/components/friend/controlFunction/index.vue'
import FriendManager from '@/components/friend/application/index.vue'
</script>

<style>
.friend-manager-view {
  display: flex;
  height: 100vh;
}
</style>
