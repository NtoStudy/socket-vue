<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { messageHistory } from '@/api/friend/index.js'
import { useUserInfoStore } from '@/store/user.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { chatRoomHistory } from '@/api/ChatRoom/index.js'
import WebSocketService from '@/services/websocket'

const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const useUserInfo = useUserInfoStore()
const messages = ref([])
const websocket = new WebSocketService()
const newMessage = ref('')
/**
 * 处理用户聊天消息
 * @returns {Promise<void>}
 */
const handleChatMessage = async () => {
  const friendId = chatFriendOrChatRoom.friendId
  const res = await messageHistory(friendId, 1, 100)
  // 格式化时间并计算时间间隔
  messages.value = res.data.data.list.map((message, index, array) => {
    // 格式化时间
    message.sentTime = message.sentTime.replace('T', ' ')

    // 计算与上一条消息的时间间隔
    if (index > 0) {
      const currentTimestamp = new Date(message.sentTime).getTime()
      const previousTimestamp = new Date(array[index - 1].sentTime).getTime()
      const timeDifference = currentTimestamp - previousTimestamp

      // 如果时间间隔小于 3 分钟，不显示时间戳
      message.showTimestamp = timeDifference >= 180000 // 3 分钟 = 180000 毫秒
    } else {
      // 第一条消息总是显示时间戳
      message.showTimestamp = true
    }

    return message
  })
}
/**
 * 处理群聊消息
 * @returns {Promise<void>}
 */
const handleChatRoomMessage = async () => {
  const chatRoomId = chatFriendOrChatRoom.chatRoomId
  const res = await chatRoomHistory(chatRoomId, 1, 100)
  // 格式化时间并计算时间间隔
  messages.value = res.data.data.list.map((message, index, array) => {
    // 格式化时间
    message.sentTime = message.sentTime.replace('T', ' ')

    // 计算与上一条消息的时间间隔
    if (index > 0) {
      const currentTimestamp = new Date(message.sentTime).getTime()
      const previousTimestamp = new Date(array[index - 1].sentTime).getTime()
      const timeDifference = currentTimestamp - previousTimestamp

      // 如果时间间隔小于 3 分钟，不显示时间戳
      message.showTimestamp = timeDifference >= 180000 // 3 分钟 = 180000 毫秒
    } else {
      // 第一条消息总是显示时间戳
      message.showTimestamp = true
    }

    return message
  })
}

onMounted(() => {
  websocket.connect()
  websocket.onMessage((message) => {
    messages.value.push(`[${username}] ${message}`)
    scrollToBottom()
  })
})

onUnmounted(() => {
  websocket.disconnect()
})

const sendMessage = () => {
  // if (newMessage.value.trim()) {
  //   websocket.sendMessage(newMessage.value)
  //   messages.value.push(`[你] ${newMessage.value}`)
  //   newMessage.value = ''
  //   scrollToBottom()
  // }
}

const scrollToBottom = () => {
  const messagesEl = document.querySelector('.messages')
  messagesEl.scrollTop = messagesEl.scrollHeight
}

onMounted(() => {
  watch(
    () => chatFriendOrChatRoom.friendId,
    async (newFriendId) => {
      if (newFriendId) {
        await handleChatMessage()
      }
    },
  )

  watch(
    () => chatFriendOrChatRoom.chatRoomId,
    async (newChatRoomId) => {
      if (newChatRoomId) {
        await handleChatRoomMessage()
      }
    },
  )
})
</script>

<template>
  <div class="chat-window">
    <div class="header">
      <div class="title">聊天窗口</div>
    </div>
    <div class="messages">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', message.senderId === useUserInfo.userInfo.userId ? 'user-message' : 'assistant-message']"
      >
        <div v-if="message.showTimestamp" class="timestamp">{{ message.sentTime }}</div>
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
      <input type="text" placeholder="输入消息" v-model="newMessage" />
      <button @click="sendMessage">发送</button>
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
