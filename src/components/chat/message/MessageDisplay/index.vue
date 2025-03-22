<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { chatRoomDelete } from '@/api/chatRoom.js'
import { messageDelete, postFriendsRemark } from '@/api/friend.js'
import { useUserInfoStore } from '@/store/user.js'
import { ref, onMounted, watch, computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { getUsersInfoById, putUsersLike } from '@/api/user.js'
import MessageItem from '@/components/chat/message/MessageDisplay/components/MessageItem.vue'
import AvatarItem from '@/components/chat/message/MessageDisplay/components/AvatarItem.vue'
//TODO由于滚动页面导致的查询的pageSize和pageNumber会一直变化
//TODO一进入页面总是会突然一下发送很多请求，后续优化

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
const emit = defineEmits(['load-more', 'message-deleted', 'edit-profile', 'send-message'])

// 初始化状态变量
const useUserInfo = useUserInfoStore()
const friendOrChatRoom = chatFriendOrChatRoomStore()
const messagesContainer = ref(null)
const isScrolledToBottom = ref(true)
const friendInfo = ref()
const remark = ref('')
const isEditingRemark = ref(false)

// 计算属性
const currentStatus = computed(() => {
  return {
    id: '1',
    label: useUserInfo.userInfo.status || '在线',
  }
})

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

// 好友信息相关方法
/**
 * 获取好友信息
 */
const getFriendInfo = async () => {
  try {
    // 确保 friendId 存在
    if (!friendOrChatRoom.friendId) {
      console.log('没有有效的 friendId')
      return
    }

    const res = await getUsersInfoById(friendOrChatRoom.friendId)
    if (res.data && res.data.data) {
      friendInfo.value = res.data.data.users
      // 设置备注，如果API返回了备注信息
      remark.value = res.data.data.remark || ''
    } else {
      console.error('获取好友信息失败:', res)
    }
  } catch (error) {
    console.error('加载好友消息失败:', error)
    // 设置默认值，防止渲染错误
    friendInfo.value = { username: '未知用户', number: '', status: '在线' }
    remark.value = ''
  }
}

/**
 * 处理点赞
 */
const handleLike = async () => {
  const res = await putUsersLike(friendInfo.value.userId)
  console.log(res.data)
  if (res.data.code === 200) {
    // 此时点赞成功，应该更新点赞状态
    await getFriendInfo()
  }
}

/**
 * 处理备注编辑
 */
const handleRemarkEdit = () => {
  isEditingRemark.value = true
}

/**
 * 处理备注保存
 */
const handleRemarkSave = async () => {
  try {
    const res = await postFriendsRemark(friendOrChatRoom.friendId, remark.value)
    console.log(res.data)
    // 模拟API调用成功
    ElMessage.success('备注已更新')
    isEditingRemark.value = false

    // 更新好友信息
    await getFriendInfo()
  } catch (error) {
    console.error('更新备注失败:', error)
    ElMessage.error('更新备注失败')
  }
}

// 生命周期钩子和监听器
onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll)
  }
})

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

// 定义组件暴露的方法
defineExpose({
  scrollToBottom,
})
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

      <!-- 使用 MessageItem 组件替换原来的消息内容 -->
      <MessageItem
        v-if="message.senderId === useUserInfo.userInfo.userId"
        :message="message"
        :is-current-user="true"
        @right-click="handleRightClickMessage"
      >
        <template #avatar>
          <!-- 使用 AvatarItem 组件替换原来的头像弹出框 -->
          <AvatarItem :is-current-user="true" :user-info="useUserInfo.userInfo" :current-status="currentStatus" />
        </template>
      </MessageItem>

      <MessageItem
        v-else
        :message="message"
        :is-current-user="false"
        @image-error="handleImageError"
        @video-error="handleVideoError"
        @right-click="handleRightClickMessage"
      >
        <template #avatar>
          <AvatarItem
            :is-current-user="false"
            :user-info="friendInfo"
            :current-status="{ id: '1', label: '在线' }"
            :remark="remark"
            :is-editing-remark="isEditingRemark"
            @like="handleLike"
            @edit-remark="handleRemarkEdit"
            @save-remark="handleRemarkSave"
            @update:remark="(val) => (remark = val)"
          />
        </template>
      </MessageItem>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 消息容器样式
.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  position: relative;
  scroll-behavior: smooth;

  // 加载指示器
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

  // 消息项样式
  .message {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    width: 100%;

    // 时间戳样式
    .timestamp {
      font-size: 12px;
      color: #999999;
      margin-bottom: 5px;
      padding: 2px 8px;
      background-color: rgba(0, 0, 0, 0.03);
      border-radius: 10px;
    }
  }
}

// 用户资料弹出框样式
:deep(.user-profile-popover) {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .el-popper__arrow {
    display: none;
  }
}
</style>
