<template>
  <div class="chat-list">
    <div class="chat-item" v-for="(chat, index) in chats" :key="index">
      <div class="chat-avatar">
        <img :src="chat.avatar" alt="avatar" />
      </div>
      <div class="chat-content">
        <div class="chat-header">
          <span class="chat-title">{{ chat.title }}</span>
          <span class="chat-time">{{ chat.time }}</span>
        </div>
        <div class="chat-message">
          <span class="chat-text">{{ chat.message }}</span>
        </div>
      </div>
      <div class="chat-badge" v-if="chat.unread > 0">{{ chat.unread }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 模拟数据
const chats = ref([
  {
    avatar: '', // 替换为实际头像 URL
    title: '软工二班',
    time: '星期二',
    message: '李翔：[动画表情]',
    unread: 0,
  },
  {
    avatar: '', // 替换为实际头像 URL
    title: '二轮项目',
    time: '星期二',
    message: '前端大家尽量都...',
    unread: 0,
  },
  {
    avatar: '', // 替换为实际头像 URL
    title: '图片',
    time: '2025/01/21',
    message: '[图片]',
    unread: 0,
  },
  {
    avatar: '', // 替换为实际头像 URL
    title: '2024电...',
    time: '2025/01/05',
    message: '240603324 郭阳...',
    unread: 0,
  },
  {
    avatar: 'https://via.placeholder.com/40', // 替换为实际头像 URL
    title: '2023级...',
    time: '2024/12/27',
    message: '230207224牛文俊...',
    unread: 0,
  },


]);
</script>

<style lang="scss" scoped>
.chat-list {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .chat-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .chat-avatar {
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
      }
    }

    .chat-content {
      flex: 1;

      .chat-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;

        .chat-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .chat-time {
          font-size: 12px;
          color: #666;
        }
      }

      .chat-message {
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;

        .chat-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .chat-badge {
      width: 18px;
      height: 18px;
      background-color: #ff4d4d;
      color: #fff;
      border-radius: 50%;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
    }
  }
}
</style>
