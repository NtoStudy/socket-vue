<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useUserInfoStore } from '@/store/user.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import WebSocketService from '@/services/websocket.js'
import { messageDelete, messageHistory } from '@/api/friend.js'
import { chatRoomDelete, chatRoomHistory } from '@/api/chatRoom.js'
import MessageDisplay from './components/MessageDisplay.vue'
import MessageInput from './components/MessageInput.vue'
import { ElMessage } from 'element-plus'

const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const useUserInfo = useUserInfoStore()
const websocket = new WebSocketService()
const messages = ref([])
const messageWindowStatus = ref('')
const uploadProgress = ref(0)
const uploading = ref(false)

// 消息格式化函数
const formatMessages = (messagesList) => {
  const now = new Date()
  return messagesList.map((message, index, array) => {
    const sentDate = new Date(message.sentTime)
    const oneDay = 24 * 60 * 60 * 1000

    if (now - sentDate < oneDay) {
      message.sentTime = sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (sentDate.getFullYear() === now.getFullYear()) {
      message.sentTime = sentDate.toLocaleDateString([], {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      message.sentTime = sentDate.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
    }

    message.showTimestamp = index === 0 || new Date(message.sentTime) - new Date(array[index - 1].sentTime) >= 180000
    return message
  })
}

// 消息处理函数
const handleChatMessage = async () => {
  const friendId = chatFriendOrChatRoom.friendId
  const res = await messageHistory(friendId, 1, 100)
  messages.value = formatMessages(res.data.data.list)
  messageWindowStatus.value = '用户'
  scrollToBottom()
}

const handleChatRoomMessage = async () => {
  const chatRoomId = chatFriendOrChatRoom.chatRoomId
  const res = await chatRoomHistory(chatRoomId, 1, 100)
  messages.value = formatMessages(res.data.data.list)
  messageWindowStatus.value = '群聊'
  scrollToBottom()
}

// WebSocket 消息处理
const handleWebSocketMessage = (message) => {
  if (message.type === 'file-upload-complete') {
    handleSendMessage('video', message.fileUrl)
  } else {
    messages.value = formatMessages([...messages.value, message])
    scrollToBottom()
  }
}

// 发送消息处理
const handleSendMessage = (messageType, content) => {
  if (!content.trim()) return

  const baseMessage = {
    messageType,
    content,
    senderId: useUserInfo.userInfo.userId,
    sentTime: new Date().toISOString(),
  }

  if (messageWindowStatus.value === '用户') {
    const message = {
      ...baseMessage,
      receiverId: chatFriendOrChatRoom.friendId,
    }
    websocket.sendMessage('friend', content, chatFriendOrChatRoom.friendId, null, messageType)
    messages.value = formatMessages([...messages.value, message])
  } else if (messageWindowStatus.value === '群聊') {
    const message = {
      ...baseMessage,
      chatRoomId: chatFriendOrChatRoom.chatRoomId,
    }
    websocket.sendMessage('group', content, null, chatFriendOrChatRoom.chatRoomId, messageType)
    messages.value = formatMessages([...messages.value, message])
  }

  scrollToBottom()
}

// 删除消息处理
const handleDeleteMessage = async (message) => {
  console.log(message)
  try {
    if (message.chatRoomId) {
      await chatRoomDelete(message.chatRoomId, message.messageId)
      await handleChatRoomMessage()
    } else if (message.receiverId) {
      await messageDelete(message.messageId)
      await handleChatMessage()
    }
    ElMessage.success('消息删除成功')
  } catch (error) {
    console.log(error)
    ElMessage.error('消息删除失败')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const messagesEl = document.querySelector('.messages')
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight
  })
}

// 生命周期和监听
onMounted(() => {
  websocket.connect()
  websocket.onMessage(handleWebSocketMessage)
})

onUnmounted(() => {
  websocket.disconnect()
})

watch(() => chatFriendOrChatRoom.friendId, handleChatMessage)
watch(() => chatFriendOrChatRoom.chatRoomId, handleChatRoomMessage)
</script>

<template>
  <div class="chat-window">
    <MessageDisplay
      :messages="messages"
      :current-user-id="useUserInfo.userInfo.userId"
      @delete-message="handleDeleteMessage"
    />
    <MessageInput
      :upload-progress="uploadProgress"
      :uploading="uploading"
      @send-message="handleSendMessage"
      @update:upload-progress="(val) => (uploadProgress = val)"
      @update:uploading="(val) => (uploading = val)"
    />
  </div>
</template>

<style lang="scss" scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
}
</style>
