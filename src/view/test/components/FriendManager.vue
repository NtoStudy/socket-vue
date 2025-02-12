<template>
  <div class="friend-manager">
    <div class="header">
      <div class="title">好友管理器</div>
    </div>
    <div class="friend-list">
      <div class="friend-item" v-for="friend in friends" :key="friend.id">
        <div class="avatar">
          <img :src="friend.avatar" alt="avatar" />
        </div>
        <div class="friend-info">
          <div class="name">{{ friend.name }}</div>
          <div class="status">{{ friend.status }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const friends = ref([
  { id: 1, name: '张三', avatar: 'avatar1.png', status: '在线' },
  { id: 2, name: '李四', avatar: 'avatar2.png', status: '离线' },
  { id: 3, name: '王五', avatar: 'avatar3.png', status: '忙碌' },
]);
</script>

<style scoped>
.friend-manager {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
}

.header {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
}

.friend-list {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.friend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.friend-info {
  flex: 1;
}

.name {
  font-size: 14px;
  font-weight: bold;
}

.status {
  font-size: 12px;
  color: #666666;
}
</style>
