<script setup>
import {onMounted, ref} from "vue";
import {getFriendList, messageHistory} from "@/api/friend/index.js";

const friendChats = ref([
  {
    avatar: "", // 替换为实际头像 URL
    title: "好友一",
    time: "星期二",
    message: "李翔：[动画表情]",
    unread: 0,
  },
  {
    avatar: "", // 替换为实际头像 URL
    title: "好友二",
    time: "星期二",
    message: "前端大家尽量都...",
    unread: 0,
  },
]);
const handleFriendList = async () => {
  // TODO: 等封装完接口之后后续处理
  const res = await getFriendList();
  // 更新好友列表
  // friendChats.value = res.data;
};


</script>

<template>

  <div
      class="chat-item"
      v-for="(chat, index) in friendChats"
      :key="index"
      @click="handleChatMessage(index)"
  >
    <div class="chat-avatar">
      <img :src="chat.avatar" alt="avatar"/>
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

</template>

<style lang="scss" scoped>
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

</style>
