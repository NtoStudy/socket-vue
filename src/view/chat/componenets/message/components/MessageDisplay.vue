<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { chatRoomDelete } from '@/api/chatRoom.js'
import { messageDelete } from '@/api/friend.js'
import { useUserInfoStore } from '@/store/user.js'

// 初始化用户信息存储
const useUserInfo = useUserInfoStore()

/**
 * 处理右键点击消息事件
 * @param {Object} message - 被点击的消息对象
 */
const handleRightClickMessage = (message) => {
  // 防止默认的右键行为
  event.preventDefault()

  /**
   * 删除消息函数
   * @param {String} messageId - 消息ID
   * @param {String} chatRoomId - 聊天室ID，如果消息属于聊天室则提供
   */
  const deleteMessage = async (messageId, chatRoomId) => {
    try {
      let res
      if (chatRoomId) {
        // 如果是聊天室消息，调用聊天室消息删除API
        res = await chatRoomDelete(chatRoomId, messageId)
      } else {
        // 如果是个人消息，调用个人消息删除API
        res = await messageDelete(messageId)
      }
      if (res.data.code === 200) {
        // 消息删除成功，显示成功提示
        ElMessage.success('消息已删除')
        // TODO: 刷新历史消息
      }
    } catch (error) {
      // 消息删除失败，显示错误提示
      console.error('删除消息时出错:', error)
      ElMessage.error('删除消息失败')
    }
  }

  // 弹出确认框，确认是否删除消息
  ElMessageBox.confirm('确定要删除该消息吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    callback: async (action) => {
      if (action === 'confirm') {
        // 确认删除，调用删除消息函数
        await deleteMessage(message.messageId, message.chatRoomId)
      }
    },
  })
}

/**
 * 滚动到消息框底部
 */
const scrollToBottom = () => {
  const messagesEl = document.querySelector('.messages')
  if (messagesEl) {
    messagesEl.scrollTop = messagesEl.scrollHeight
  }
}

// 定义组件接收的属性
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
})

// 定义组件暴露的方法
defineExpose({
  scrollToBottom,
})
</script>

<template>
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
        <div class="text" v-if="message.messageType === 'text'">{{ message.content }}</div>
        <div class="images" v-else-if="message.messageType === 'image'">
          <img :src="message.content" alt="图片" height="200" />
        </div>
        <div class="video" v-else-if="message.messageType === 'video'">
          <video :src="message.content" controls="" height="200"></video>
        </div>
        <div class="avatar">我</div>
      </div>
      <div v-else class="assistant-content" @contextmenu.prevent="handleRightClickMessage(message)">
        <div class="avatar">AI</div>
        <div class="text" v-if="message.messageType === 'text'">{{ message.content }}</div>
        <div class="images" v-else-if="message.messageType === 'image'">
          <img :src="message.content" alt="图片" width="200" height="200" />
        </div>
        <div class="video" v-else-if="message.messageType === 'video'">
          <video :src="message.content" controls="" height="200"></video>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

    .images {
      margin: 0 10px;
    }

    .video {
      margin: 0 10px;

      video {
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.5s ease;

        &:hover {
          transform: scale(1.02);
        }
      }
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
</style>
