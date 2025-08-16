<template>
  <Sidebar @createGroup="handleCreateGroup" @addContact="handleAddContact">
    <div class="chat-list">
      <AllChats />
    </div>
  </Sidebar>
</template>

<script setup>
import AllChats from './AllChats/index.vue'
import Sidebar from '@/components/layout/HeaderSidebar/index.vue'

// 处理创建群聊事件
const handleCreateGroup = () => {
  console.log('聊天页面处理创建群聊')
}

// 处理添加好友/群事件
const handleAddContact = () => {
  console.log('聊天页面处理添加好友/群')
}
</script>

<style lang="scss" scoped>
.chat-list {
  overflow-y: auto;
  background-color: #f5f5f5;
  height: calc(100% - 50px);
}
</style>
