<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { messageDelete, messageHistory } from '@/api/friend/index.js'
import { useUserInfoStore } from '@/store/user.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { chatRoomDelete, chatRoomHistory } from '@/api/ChatRoom/index.js'
import WebSocketService from '@/services/websocket'
import { ElMessage, ElMessageBox } from 'element-plus'

// 创建聊天室或私聊的消息列表和WebSocket服务实例
const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const useUserInfo = useUserInfoStore()
const messages = ref([])
const websocket = new WebSocketService()
const newMessage = ref('')
const messageWindowStatus = ref()
// 消息格式化相关函数
const formatMessages = (messagesList) => {
  const now = new Date()
  return messagesList.map((message, index, array) => {
    const sentDate = new Date(message.sentTime)
    const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数

    if (now - sentDate < oneDay) {
      // 如果在24小时之内，只显示时分秒
      message.sentTime = sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } else if (sentDate.getFullYear() === now.getFullYear()) {
      // 如果在今年之内，只显示月份和日期
      message.sentTime = sentDate.toLocaleDateString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
    } else {
      // 如果不是今年，则显示年月日
      message.sentTime = sentDate.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
    }

    if (index > 0) {
      const currentTimestamp = sentDate.getTime()
      const previousTimestamp = new Date(array[index - 1].sentTime).getTime()
      const timeDifference = currentTimestamp - previousTimestamp
      message.showTimestamp = timeDifference >= 180000
    } else {
      message.showTimestamp = true
    }
    return message
  })
}

/**
 * 处理用户聊天消息
 * @returns {Promise<void>}
 */
const handleChatMessage = async () => {
  const friendId = chatFriendOrChatRoom.friendId
  const res = await messageHistory(friendId, 1, 100)
  messages.value = formatMessages(res.data.data.list)
  await nextTick(() => {
    scrollToBottom()
  })
  messageWindowStatus.value = '用户'
}

/**
 * 处理群聊消息
 * @returns {Promise<void>}
 */
const handleChatRoomMessage = async () => {
  const chatRoomId = chatFriendOrChatRoom.chatRoomId
  const res = await chatRoomHistory(chatRoomId, 1, 100)
  messages.value = formatMessages(res.data.data.list)
  await nextTick(() => {
    scrollToBottom()
  })
  messageWindowStatus.value = '群聊'
}

// 在组件挂载时连接WebSocket，并监听消息
onMounted(() => {
  websocket.connect()
  websocket.onMessage((message) => {
    // 将接收到的消息添加到消息列表
    messages.value = formatMessages([...messages.value, message])
    nextTick(() => {
      scrollToBottom()
    })
  })
})

// 在组件卸载时断开WebSocket连接
onUnmounted(() => {
  websocket.disconnect()
})

// 发送消息函数
const sendMessage = () => {
  if (messageWindowStatus.value === '用户') {
    // 以下是用户之间的通讯
    if (newMessage.value.trim()) {
      const message = {
        content: newMessage.value,
        receiverId: chatFriendOrChatRoom.friendId,
        sentTime: new Date()
          .toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24小时制
          })
          .replace(/\//g, '-')
          .replace(',', ''),
        senderId: useUserInfo.userInfo.userId,
      }

      messages.value = formatMessages([...messages.value, message])
      websocket.sendMessage('friend', newMessage.value, chatFriendOrChatRoom.friendId, null)
      newMessage.value = ''
      nextTick(() => {
        scrollToBottom()
      })
    }
  } else if (messageWindowStatus.value === '群聊') {
    // 以下是群聊之间的通讯
    if (newMessage.value.trim()) {
      const message = {
        content: newMessage.value,
        sentTime: new Date()
          .toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24小时制
          })
          .replace(/\//g, '-')
          .replace(',', ''),
        senderId: useUserInfo.userInfo.userId,
      }

      messages.value = formatMessages([...messages.value, message])
      console.log(messages.value, 'message')
      websocket.sendMessage('group', newMessage.value, null, chatFriendOrChatRoom.chatRoomId)
      newMessage.value = ''
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
}
const handleRightClickMessage = (message) => {
  console.log(message)
  // 防止默认的右键行为
  event.preventDefault()
  if (message.chatRoomId) {
    // 这时候说明是删除群聊里面的信息
    ElMessageBox.confirm('确定要删除该消息吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      callback: async (action) => {
        if (action === 'confirm') {
          const res = await chatRoomDelete(message.chatRoomId, message.messageId)
          console.log(res.data)
          if (res.data.code === 200) {
            ElMessage.success('消息已删除')
            await handleChatRoomMessage()
          }
        }
      },
    })
  } else if (message.receiverId) {
    ElMessageBox.confirm('确定要删除该消息吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      callback: async (action) => {
        if (action === 'confirm') {
          const res = await messageDelete(message.messageId)
          if (res.data.code === 200) {
            ElMessage.success('消息已删除')
            await handleChatMessage()
          }
        }
      },
    })
  }
}
// 滚动到消息列表底部
const scrollToBottom = () => {
  const messagesEl = document.querySelector('.messages')
  if (messagesEl) {
    messagesEl.scrollTop = messagesEl.scrollHeight
  }
}

// 监听聊天对象变化，更新消息列表
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

        <div
          v-if="message.senderId === useUserInfo.userInfo.userId"
          class="user-content"
          @contextmenu.prevent="handleRightClickMessage(message)"
        >
          <div class="text">{{ message.content }}</div>
          <div class="avatar">我</div>
        </div>
        <div v-else class="assistant-content" @contextmenu.prevent="handleRightClickMessage(message)">
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
