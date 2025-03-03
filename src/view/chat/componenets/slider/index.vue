<template>
  <div class="chat-list">
    <div class="chat-switcher">
      <div class="chat-switcher-item" :class="{ active: currentTab === 'friend' }" @click="currentTab = 'friend'">
        好友列表
      </div>
      <div class="chat-switcher-item" :class="{ active: currentTab === 'group' }" @click="currentTab = 'group'">
        群聊列表
      </div>
    </div>
    <Friend v-if="currentTab === 'friend'" />
    <ChatRoom v-else />
  </div>
</template>

<script setup>
import Friend from './Friend/index.vue'
import ChatRoom from './ChatRoom/index.vue'
import { ref } from 'vue'

const currentTab = ref('friend')
</script>

<style lang="scss">
.chat-list {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .chat-switcher {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    .chat-switcher-item {
      padding: 5px 10px;
      border-radius: 20px;
      background-color: #e0e0e0;
      margin: 0 5px;
      cursor: pointer;
      transition: background-color 0.3s;

      &.active {
        background-color: #007bff;
        color: #fff;
      }

      &:hover {
        background-color: #007bff;
        color: #fff;
      }
    }
  }
}
</style>
