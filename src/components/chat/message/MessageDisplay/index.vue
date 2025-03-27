<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { chatRoomDelete } from '@/api/chatRoom.js'
import { messageDelete, postFriendsRemark } from '@/api/friend.js'
import { useUserInfoStore } from '@/store/user.js'
import { ref, onMounted, watch, computed, nextTick, onUnmounted } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { putUsersLike } from '@/api/user.js'
import MessageItem from '@/components/chat/message/MessageDisplay/components/MessageItem.vue'
import AvatarItem from '@/components/chat/message/MessageDisplay/components/AvatarItem.vue'
import { handleRightClickMessage } from '@/utils/messageUtils.js'
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
const chatStore = chatFriendOrChatRoomStore()
const messagesContainer = ref(null)
const isScrolledToBottom = ref(true)
const remark = ref('')
const isEditingRemark = ref(false)

// 计算属性
const currentStatus = computed(() => {
  return {
    id: '1',
    label: useUserInfo.userInfo.status || '在线',
  }
})
// 计算好友状态对象
const friendStatus = computed(() => {
  return {
    id: chatStore.friendInfo.userId || '2',
    label: chatStore.friendInfo.status || '在线',
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
  // 防止事件冲突
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
 * 处理右键点击消息事件的包装函数
 * @param {Object} message - 被点击的消息对象
 * @param {Event} event - 鼠标事件对象
 */
const handleMessageRightClick = (message, event) => {
  handleRightClickMessage(
    message,
    event,
    (deletedMessage) => emit('message-deleted', deletedMessage),
    ElMessage,
    ElMessageBox,
    messageDelete,
    chatRoomDelete,
  )
}

/**
 * 处理点赞
 */
const handleLike = async () => {
  const res = await putUsersLike(chatStore.friendInfo.userId)
  if (res.data.code === 200) {
    // 此时点赞成功，应该更新点赞状态
    await chatStore.getFriendInfo(chatStore.friendId)
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
    const res = await postFriendsRemark(chatStore.friendId, remark.value)
    console.log(res.data)
    // 模拟API调用成功
    ElMessage.success('备注已更新')
    isEditingRemark.value = false

    // 更新好友信息
    await chatStore.getFriendInfo(chatStore.friendId)
  } catch (error) {
    console.error('更新备注失败:', error)
    ElMessage.error('更新备注失败')
  }
}

// 生命周期钩子和监听器
onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll, { passive: true })
    nextTick(() => {
      scrollToBottom()
    })
  }
})
onUnmounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', handleScroll)
  }
})
// 监听消息变化，如果用户在底部，则自动滚动到底部
watch(
  () => props.messages,
  (newVal, oldVal) => {
    if (isScrolledToBottom.value || !oldVal || newVal.length > oldVal.length) {
      nextTick(() => {
        scrollToBottom()
      })
    }
  },
  { deep: true, immediate: true },
)

// 监听好友信息变化，更新备注
watch(
  () => chatStore.friendInfo,
  (newVal) => {
    if (newVal && newVal.remark !== undefined) {
      remark.value = newVal.remark || ''
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
        @right-click="handleMessageRightClick"
      >
        <template #avatar>
          <!-- 使用 AvatarItem 组件替换原来的头像弹出框 -->
          <AvatarItem :is-current-user="true" :user-info="useUserInfo.userInfo" :current-status="currentStatus" />
        </template>
      </MessageItem>

      <MessageItem v-else :message="message" :is-current-user="false" @right-click="handleMessageRightClick">
        <!--这是别人的组件-->
        <template #avatar>
          <AvatarItem
            :is-current-user="false"
            :user-info="chatStore.friendInfo"
            :current-status="friendStatus"
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
  overflow-y: auto !important;
  position: relative;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
  }

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
</style>
