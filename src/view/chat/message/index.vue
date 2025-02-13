<script setup>
import {onMounted, ref} from "vue";
import {messageHistory, messageSend} from "@/api/friend/index.js";
import {useUserInfoStore} from "@/store/user.js";
const useUserInfo = useUserInfoStore();
const messages = ref([]);
const inputContent = ref('');

const handleChatMessage = async () => {
  const res = await messageHistory(5, 1, 100);
  messages.value = res.data.data.list;
  console.log(messages.value)
};


onMounted(()=>{
  handleChatMessage()
})
</script>

<template>
  <div class="chat-window">
    <div class="header">
      <div class="title">聊天窗口</div>
    </div>
    <div class="messages" >
      <div
          v-for="(message, index) in messages"
          :key="message.id"
          :class="['message', message.senderId === useUserInfo.userInfo.userId ? 'user-message' : 'assistant-message']"
      >
        <div class="timestamp">{{ message.sentTime }}</div>
        <div v-if="message.senderId === useUserInfo.userInfo.userId" class="user-content">
          <div class="text">{{ message.content }}</div>
          <div class="avatar">我</div>
        </div>
        <div v-else class="assistant-content">
          <div class="avatar">AI</div>
          <div class="text">{{ message.content }}</div>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input type="text" placeholder="输入消息"/>
      <button @click="handleSendMessage">发送</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;

  .header {
    background-color: #f5f5f5;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #e0e0e0;
  }

  .messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;

    .message {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;

      .timestamp {
        font-size: 12px;
        color: #999999;
        margin-bottom: 5px;
      }

      .user-content {
        display: flex;
        align-items: flex-end;
        margin-left: auto;
      }

      .assistant-content {
        display: flex;
        align-items: flex-start;
        margin-right: auto;
      }

      .avatar {
        width: 40px;
        height: 40px;
        background-color: #e0e0e0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        color: #666666;
      }

      .text {
        padding: 10px;
        border-radius: 5px;
        margin: 0 10px;
        word-wrap: break-word;
      }

      &.user-message .text {
        background-color: #007bff;
        color: white;
      }

      &.assistant-message .text {
        background-color: #f0f0f0;
        color: #333333;
      }
    }
  }

  .input-area {
    display: flex;
    padding: 10px;
    background-color: #f5f5f5;
    border-top: 1px solid #e0e0e0;
    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-right: 10px;
    }

    button {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>
