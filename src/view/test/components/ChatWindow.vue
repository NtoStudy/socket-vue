<template>
  <div class="chat-window">
    <div class="header">
      <div class="title">聊天窗口</div>
    </div>
    <div class="messages">
      <div
          v-for="(message, index) in messages"
          :key="message.id"
          :class="['message', message.isUser ? 'user-message' : 'assistant-message']"
      >
        <div v-if="shouldShowTimestamp(index)" class="timestamp">{{ message.time }}</div>
        <div v-if="message.isUser" class="user-content">
          <div class="text">{{ message.text }}</div>
          <div class="avatar">我</div>
        </div>
        <div v-else class="assistant-content">
          <div class="avatar">AI</div>
          <div class="text">{{ message.text }}</div>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input type="text" placeholder="输入消息" />
      <button>发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([
  { id: 1, text: '要学到vue才能参与比赛嘛', isUser: true, time: '15:05' },
  { id: 2, text: '因为要前后端联调啥的，学完vue用框架调接口会比较舒服', isUser: false, time: '15:06' },
  { id: 3, text: '好的好的', isUser: false, time: '15:05' },
  { id: 4, text: '尽量加快点进度哇', isUser: true, time: '15:06' },
  { id: 5, text: '想着让你们今年能一起参与项目的开发投点比赛', isUser: true, time: '15:28' },
]);

const shouldShowTimestamp = (index) => {
  if (index === 0) return true; // 第一条消息总是显示时间戳
  const currentTime = new Date(messages.value[index].time).getTime();
  const prevTime = new Date(messages.value[index - 1].time).getTime();
  const timeDiff = currentTime - prevTime; // 时间差（毫秒）
  return timeDiff >= 180000; // 3分钟 = 180000毫秒
};
</script>

<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

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
  max-width: 70%;
  padding: 10px;
  border-radius: 5px;
  margin: 0 10px;
  word-wrap: break-word;
}

.user-message .text {
  background-color: #007bff;
  color: white;
}

.assistant-message .text {
  background-color: #f0f0f0;
  color: #333333;
}

.input-area {
  display: flex;
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.input-area input {
  flex: 1;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-right: 10px;
}

.input-area button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
