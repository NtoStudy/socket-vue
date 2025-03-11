<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { chatRoomDelete } from '@/api/chatRoom.js'
import { messageDelete } from '@/api/friend.js'
import { useUserInfoStore } from '@/store/user.js'
import { ref, onMounted, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'

// 初始化用户信息存储
const useUserInfo = useUserInfoStore()
const messagesContainer = ref(null)
const isScrolledToBottom = ref(true)

/**
 * 处理右键点击消息事件
 * @param {Object} message - 被点击的消息对象
 */
const handleRightClickMessage = (message, event) => {
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
        // 触发消息删除事件
        emit('message-deleted', message)
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
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    isScrolledToBottom.value = true
  }
}

/**
 * 处理滚动事件
 */
const handleScroll = () => {
  if (!messagesContainer.value) return

  // 检测是否滚动到顶部，触发加载更多
  if (messagesContainer.value.scrollTop < 50 && !props.loading) {
    emit('load-more')
  }

  // 检测是否滚动到底部
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  isScrolledToBottom.value = scrollTop + clientHeight >= scrollHeight - 10
}

/**
 * 图片加载错误处理
 */
const handleImageError = (event) => {
  event.target.src = '/placeholder.png'
}

/**
 * 视频加载错误处理
 */
const handleVideoError = (event) => {
  event.target.poster = '/video-placeholder.png'
}

// 定义组件接收的属性
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  messageWindowStatus: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// 定义组件事件
const emit = defineEmits(['load-more', 'message-deleted'])

// 监听消息变化，如果用户在底部，则自动滚动到底部
watch(
  () => props.messages,
  () => {
    if (isScrolledToBottom.value) {
      setTimeout(scrollToBottom, 50)
    }
  },
  { deep: true },
)

// 组件挂载后设置滚动事件监听
onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll)
  }
})

// 定义组件暴露的方法
defineExpose({
  scrollToBottom,
})
</script>

<template>
  <div class="messages" ref="messagesContainer">
    <!-- 加载中提示 -->
    <div v-if="loading" class="loading-indicator">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载更多消息...</span>
    </div>

    <div
      v-for="message in messages"
      :key="message.messageId || message.id"
      :class="['message', message.senderId === useUserInfo.userInfo.userId ? 'user-message' : 'assistant-message']"
    >
      <div v-if="message.showTimestamp" class="timestamp">{{ message.sentTime }}</div>

      <div
        v-if="message.senderId === useUserInfo.userInfo.userId"
        class="user-content"
        @contextmenu="(event) => handleRightClickMessage(message, event)"
      >
        <div class="text" v-if="message.messageType === 'text'">{{ message.content }}</div>
        <div class="images" v-else-if="message.messageType === 'image'">
          <!-- 使用懒加载加载图片 -->
          <img :src="message.content" alt="图片" height="200" loading="lazy" @error="handleImageError" />
        </div>
        <div class="video" v-else-if="message.messageType === 'video'">
          <!-- 使用懒加载加载视频 -->
          <video :src="message.content" controls height="200" preload="metadata" @error="handleVideoError"></video>
        </div>
        <div class="avatar">我</div>
      </div>
      <div v-else class="assistant-content" @contextmenu="(event) => handleRightClickMessage(message, event)">
        <div class="avatar">AI</div>
        <div class="text" v-if="message.messageType === 'text'">{{ message.content }}</div>
        <div class="images" v-else-if="message.messageType === 'image'">
          <!-- 使用懒加载加载图片 -->
          <img :src="message.content" alt="图片" width="200" height="200" loading="lazy" @error="handleImageError" />
        </div>
        <div class="video" v-else-if="message.messageType === 'video'">
          <!-- 使用懒加载加载视频 -->
          <video :src="message.content" controls height="200" preload="metadata" @error="handleVideoError"></video>
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
  position: relative;
  scroll-behavior: smooth;

  .loading-indicator {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;

    .el-icon {
      margin-right: 5px;
    }
  }

  .message {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    width: 100%;

    .timestamp {
      font-size: 12px;
      color: #999999;
      margin-bottom: 5px;
      padding: 2px 8px;
      background-color: rgba(0, 0, 0, 0.03);
      border-radius: 10px;
    }

    .user-content {
      display: flex;
      align-items: flex-start;
      margin-left: auto;
      max-width: 80%;
    }

    .assistant-content {
      display: flex;
      align-items: flex-start;
      margin-right: auto;
      max-width: 80%;
    }

    .avatar {
      min-width: 40px;
      height: 40px;
      background-color: #e0e0e0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      color: #666666;
      flex-shrink: 0;
    }

    .text {
      padding: 10px;
      border-radius: 5px;
      margin: 0 10px;
      word-wrap: break-word;
      word-break: break-all;
      max-width: calc(100% - 60px);
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }

    .images {
      margin: 0 10px;
      max-width: calc(100% - 60px);

      img {
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        background-color: #f5f5f5;
        max-width: 100%;
        height: 200px; /* 固定高度为200px */
        object-fit: contain;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .video {
      margin: 0 10px;
      max-width: calc(100% - 60px);

      video {
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.5s ease;
        background-color: #f5f5f5;
        max-width: 100%;
        height: 200px;
        object-fit: contain;

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
