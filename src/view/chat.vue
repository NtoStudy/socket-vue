<template>
  <div class="chat-room">
    <h1>聊天室</h1>
    <input v-model="receiverId" placeholder="输入接收者 ID"/>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index">
        <p>
          <strong>发送者: {{ message.senderId }}</strong> →
          <strong>接收者: {{ message.receiverId }}</strong>:
          {{ message.content }}
        </p>
      </div>
    </div>
    <div class="input-area">
      <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="输入消息内容"
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useUserInfoStore} from "../store/user.js";

const userInfoStore = useUserInfoStore();
const token = userInfoStore.token;
const userId = userInfoStore.userId; // 假设存在一个 userId

// 消息列表
const messages = ref([]);
// 输入框内容
const inputMessage = ref('');
const receiverId = ref();
// WebSocket 连接
let ws = null;

// 连接 WebSocket
const connectWebSocket = () => {
  ws = new WebSocket(`ws://localhost:8080/chat?token=${token}`);

  ws.onopen = () => {
    console.log('WebSocket 连接已建立');
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('接收到消息:', message); // 确保消息格式正确
    messages.value.push(message);
  };

  ws.onclose = () => {
    console.log('WebSocket 连接已关闭');
  };

  ws.onerror = (error) => {
    console.error('WebSocket 发生错误:', error);
  };
};

// 发送消息
const sendMessage = () => {
  if (inputMessage.value.trim()) {
    const message = {
      senderId: userId, // 假设存在一个发送者 ID
      receiverId: receiverId.value, // 替换为实际的接收者 ID
      content: inputMessage.value,
    };

    // 将消息推入本地消息列表
    messages.value.push(message);

    // 发送消息到 WebSocket
    ws.send(JSON.stringify(message));

    // 清空输入框
    inputMessage.value = '';
  }
};

// 生命周期钩子
onMounted(() => {
  connectWebSocket();
});

onBeforeUnmount(() => {
  if (ws) {
    ws.close(); // 关闭 WebSocket 连接
  }
});
</script>

<style scoped>
/* 保持原有样式 */
</style>
