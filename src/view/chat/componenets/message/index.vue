<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useUserInfoStore } from '@/store/user.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import WebSocketService from '@/services/websocket.js'
import MessageDisplay from '@/view/chat/componenets/message/components/MessageDisplay.vue'
import { ElMessage } from 'element-plus'
import { messageHistory } from '@/api/friend.js'
import { formatMessages, formatSentTime } from '@/view/chat/utils/messageUtils.js'
import { chatRoomHistory } from '@/api/chatRoom.js'
import MessageInput from '@/view/chat/componenets/message/components/MessageInput.vue'
import eventBus from '@/EventBus/eventBus.js'

// 消息显示组件的引用，用于操作DOM
const messageDisplayRef = ref(null)
// 使用聊天状态管理store
const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const useUserInfo = useUserInfoStore()
// 用于存储文件URL的响应式变量
const fileUrl = ref('')
// 存储消息的响应式数组
const messages = ref([])
// WebSocket服务实例
const websocket = new WebSocketService()
// 消息窗口状态的响应式变量
const messageWindowStatus = ref()

// 在组件挂载时执行
onMounted(() => {
  // 连接WebSocket
  websocket.connect()
  // 监听WebSocket消息
  websocket.onMessage((message) => {
    // 处理文件上传完成的消息
    if (message.type === 'file-upload-complete') {
      fileUrl.value = message.fileUrl
      sendMessage({ type: 'video', content: fileUrl.value })
    }
    // 将接收到的消息添加到消息列表
    messages.value = formatMessages([...messages.value, message])
    // 更新DOM后滚动到底部
    nextTick(() => {
      messageDisplayRef.value.scrollToBottom()
    })
  })
})

// 在组件卸载时执行
onUnmounted(() => {
  // 断开WebSocket连接
  websocket.disconnect()
})

/**
 * 发送消息的函数
 * @param {Object} messageInfo - 消息信息，包含type和content属性
 */
const sendMessage = ({ type, content }) => {
  // 检查消息内容是否为空
  if (!content.trim()) {
    ElMessage.error('消息内容不能为空')
    return
  }
  // 构建基础消息对象
  const baseMessage = {
    messageType: type,
    content,
    senderId: useUserInfo.userInfo.userId,
    sentTime: formatSentTime(new Date().toISOString()),
  }
  // 根据消息窗口状态发送消息
  if (messageWindowStatus.value === '用户') {
    const message = {
      ...baseMessage,
      receiverId: chatFriendOrChatRoom.friendId,
    }
    // 发送消息并通过WebSocket发送
    websocket.sendMessage('friend', content, chatFriendOrChatRoom.friendId, null, type)
    // 更新消息列表
    messages.value = formatMessages([...messages.value, message])
    // 更新DOM后滚动到底部
    nextTick(() => {
      messageDisplayRef.value.scrollToBottom()
    })
    // 触发事件更新好友列表
    eventBus.emit('call-handleFriendList')
  } else if (messageWindowStatus.value === '群聊') {
    const message = {
      ...baseMessage,
      chatRoomId: chatFriendOrChatRoom.chatRoomId,
    }
    // 发送消息并通过WebSocket发送
    websocket.sendMessage('group', content, null, chatFriendOrChatRoom.chatRoomId, type)
    // 更新消息列表
    messages.value = formatMessages([...messages.value, message])
  }
}

/**
 * 处理用户聊天消息
 * @returns {Promise<void>}
 */
const handleChatMessage = async () => {
  const friendId = chatFriendOrChatRoom.friendId
  const res = await messageHistory(friendId, 1, 100)
  messages.value = formatMessages(res.data.data.list)
  messageWindowStatus.value = '用户'
  await nextTick(() => {
    messageDisplayRef.value.scrollToBottom()
  })
}
/**
 * 处理群聊消息
 * @returns {Promise<void>}
 */
const handleChatRoomMessage = async () => {
  const chatRoomId = chatFriendOrChatRoom.chatRoomId
  const res = await chatRoomHistory(chatRoomId, 1, 100)
  messages.value = formatMessages(res.data.data.list)
  messageWindowStatus.value = '群聊'
  await nextTick(() => {
    messageDisplayRef.value.scrollToBottom()
  })
}

// 监听聊天对象变化
watch(() => chatFriendOrChatRoom.friendId, handleChatMessage)
watch(() => chatFriendOrChatRoom.chatRoomId, handleChatRoomMessage)
</script>

<template>
  <div class="chat-window">
    <!-- 消息显示组件 -->
    <MessageDisplay :messages="messages" :messageWindowStatus="messageWindowStatus" ref="messageDisplayRef" />
    <!-- 消息输入组件 -->
    <MessageInput @send-message="sendMessage" />
  </div>
</template>

<style lang="scss" scoped>
// 聊天窗口样式
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
}
</style>
