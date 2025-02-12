<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="avatar">
        <img :src="userAvatar" alt="avatar" />
      </div>
      <div class="status">
        <span class="online">在线</span>
      </div>
    </div>
    <div class="sidebar-search">
      <input type="text" placeholder="搜索" />
    </div>
    <div class="sidebar-items">
      <router-link to="/chat" class="sidebar-item">
        <img src="" alt="chat" />
        <span>聊天</span>
      </router-link>
      <router-link to="/friend-manager" class="sidebar-item">
        <img src="" alt="friend manager" />
        <span>好友管理器</span>
      </router-link>
      <div class="sidebar-item">
        <img src="" alt="friend notification" />
        <span>好友通知</span>
      </div>
      <div class="sidebar-item">
        <img src="" alt="group notification" />
        <span>群通知</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userAvatar = 'user-avatar.png'; // 用户头像图片路径
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding: 10px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.status {
  margin-left: 10px;
}

.online {
  background-color: #4caf50;
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
}

.sidebar-search {
  margin-bottom: 20px;
}

.sidebar-search input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.sidebar-items {
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.sidebar-item img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.router-link-active {
  font-weight: bold;
  color: #007bff;
}
</style>
