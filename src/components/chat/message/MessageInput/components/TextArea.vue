<script setup>
import { ref } from 'vue'

// 定义组件的事件
const emit = defineEmits(['send-message'])

// 响应式变量：绑定用户输入的消息
const inputMessage = ref('')

/**
 * 处理文本消息发送逻辑
 */
const handleTextMessage = () => {
  if (inputMessage.value.trim()) {
    emit('send-message', inputMessage.value)
    inputMessage.value = '' // 清空输入框
  }
}
</script>

<template>
  <div class="input-wrapper">
    <!-- 消息输入框 -->
    <textarea
      class="message-input"
      placeholder="输入消息"
      v-model="inputMessage"
      @keyup.enter="handleTextMessage()"
    ></textarea>
    <!-- 发送按钮 -->
    <div class="send-button-wrapper">
      <button class="send-button" @click="handleTextMessage()">发送</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;

  .message-input {
    flex: 1;
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #f5f5f5;
    border-radius: 4px;
    resize: none;
    outline: none;
    min-height: 40px;
    background-color: #f5f5f5;
  }

  .send-button-wrapper {
    display: flex;
    justify-content: flex-end;

    .send-button {
      margin-right: 10px;
      padding: 8px 16px;
      width: 70px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
</style>
