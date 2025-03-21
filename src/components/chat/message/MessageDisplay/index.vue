<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { chatRoomDelete } from '@/api/chatRoom.js'
import { messageDelete } from '@/api/friend.js'
import { useUserInfoStore } from '@/store/user.js'
import { ref, onMounted, watch, computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import UserProfileCard from '@/components/common/UserProfileCard/index.vue'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { getUsersInfoById, putUsersLike } from '@/api/user.js'
//TODO由于滚动页面导致的查询的pageSize和pageNumber会一直变化
// 初始化用户信息存储
const useUserInfo = useUserInfoStore()
const messagesContainer = ref(null)
const isScrolledToBottom = ref(true)
const friendOrChatRoom = chatFriendOrChatRoomStore()
const friendInfo = ref()
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

const handleLike = async () => {
  const res = await putUsersLike(friendInfo.value.userId)
  console.log(res.data)
  if (res.data.code === 200) {
    // 此时点赞成功，应该更新点赞状态
    await getFriendInfo()
  }
}
// 添加用户状态相关数据
const currentStatus = computed(() => {
  return {
    id: '1',
    label: useUserInfo.userInfo.status || '在线',
  }
})

// 添加状态样式类的计算方式
const statusClass = computed(() => {
  const labelMap = {
    在线: 'status-online',
    Q我吧: 'status-happy',
    离开: 'status-away',
    忙碌: 'status-busy',
    请勿打扰: 'status-dnd',
    隐身: 'status-invisible',
    我的电量: 'status-battery',
    听歌中: 'status-music',
    做好事: 'status-working',
    出去浪: 'status-travel',
    被掏空: 'status-empty',
    今日步数: 'status-steps',
    今日天气: 'status-weather',
    我crush了: 'status-crush',
  }
  return labelMap[currentStatus.value.label] || 'status-online'
})

// ... 现有代码 ...

// 更新组件事件
const emit = defineEmits(['load-more', 'message-deleted', 'edit-profile', 'send-message'])

const getFriendInfo = async () => {
  try {
    // 确保 friendId 存在
    if (!friendOrChatRoom.friendId) {
      console.log('没有有效的 friendId')
      return
    }

    const res = await getUsersInfoById(friendOrChatRoom.friendId)
    if (res.data && res.data.data) {
      friendInfo.value = res.data.data
    } else {
      console.error('获取好友信息失败:', res)
    }
  } catch (error) {
    console.error('加载好友消息失败:', error)
    // 设置默认值，防止渲染错误
    friendInfo.value = { username: '未知用户', number: '', status: '在线' }
  }
}
// 只有当 friendId 存在时才调用
watch(
  () => friendOrChatRoom.friendId,
  (newVal) => {
    if (newVal) {
      getFriendInfo()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="messages" ref="messagesContainer">
    <!-- 加载中提示 -->
    <div v-if="loading" class="loading-indicator">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
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

        <!-- 用户头像使用弹出框 -->
        <el-popover placement="left" :width="300" trigger="click" popper-class="user-profile-popover">
          <template #reference>
            <div class="avatar">我</div>
          </template>
          <UserProfileCard :user-info="useUserInfo.userInfo" :current-status="currentStatus" :user-avatar="''">
            <el-button class="action-btn call-btn" type="primary"> 发消息</el-button>
          </UserProfileCard>
        </el-popover>
      </div>
      <div v-else class="assistant-content" @contextmenu="(event) => handleRightClickMessage(message, event)">
        <!-- 对方头像使用弹出框 -->
        <el-popover placement="right" :width="300" trigger="click" popper-class="user-profile-popover">
          <template #reference>
            <div class="avatar">AI</div>
          </template>
          <UserProfileCard
            @like="handleLike"
            :user-info="friendInfo"
            :current-status="{ id: '1', label: '在线' }"
            :user-avatar="''"
          >
            <el-button class="action-btn call-btn"> 音视频通话</el-button>
            <el-button type="primary"> 发消息</el-button>
          </UserProfileCard>
        </el-popover>

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

:deep(.user-profile-popover) {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .el-popper__arrow {
    display: none;
  }
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
  cursor: pointer; // 添加指针样式表明可点击
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}

:deep(.profile-actions) {
  .call-btn {
    flex: 1;
    height: 36px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon {
      margin-right: 4px;
    }
  }

  .message-btn {
    flex: 1;
    height: 36px;
    background-color: #1890ff;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon {
      margin-right: 4px;
    }
  }
}
</style>
