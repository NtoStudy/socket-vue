<script setup>
import { ref, watch, nextTick, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useUserInfoStore } from '@/store/user.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import WebSocketService from '@/services/websocket.js'
import MessageDisplay from './MessageDisplay/index.vue'
import { ElMessage } from 'element-plus'
import { messageHistory, postFriendPin } from '@/api/friend.js'
import { formatMessages, formatSentTime } from '@/utils/messageUtils.js'
import { chatRoomHistory } from '@/api/chatRoom.js'
import MessageInput from './MessageInput/index.vue'
import eventBus from '@/EventBus/eventBus.js'
import _ from 'lodash'
import { getUsersInfoById } from '@/api/user.js'
// 消息显示组件的引用，用于操作DOM
const messageDisplayRef = ref(null)
// 使用聊天状态管理store
const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const useUserInfo = useUserInfoStore()
console.log(chatFriendOrChatRoom)
// 用于存储文件URL的响应式变量
const fileUrl = ref('')
// 存储消息的响应式数组
const messages = ref([])
// 消息窗口状态的响应式变量
const messageWindowStatus = ref('')
// WebSocket服务实例
const websocket = new WebSocketService()

// 分页参数
const pagination = reactive({
  page: 1,
  size: 50,
  hasMore: true,
  loading: false,
})

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
    // 更新DOM后滚动到底部
    nextTick(() => {
      messageDisplayRef.value.scrollToBottom()
    })
  }
}

/**
 * 加载更多消息
 */
const loadMoreMessages = async () => {
  if (!pagination.hasMore || pagination.loading) return

  pagination.loading = true
  pagination.page++

  try {
    let newMessages = []

    if (messageWindowStatus.value === '用户' && chatFriendOrChatRoom.friendId) {
      const res = await messageHistory(chatFriendOrChatRoom.friendId, pagination.page, pagination.size)
      console.log(res.data)
      newMessages = formatMessages(res.data.data.list)
    } else if (messageWindowStatus.value === '群聊' && chatFriendOrChatRoom.chatRoomId) {
      const res = await chatRoomHistory(chatFriendOrChatRoom.chatRoomId, pagination.page, pagination.size)
      console.log(res.data)

      newMessages = formatMessages(res.data.data.list)
    }

    // 如果没有新消息，说明已经加载完所有消息
    if (newMessages.length === 0) {
      pagination.hasMore = false
    } else {
      // 过滤掉已经存在的消息，避免重复
      const existingMessageIds = new Set(messages.value.map((msg) => msg.messageId || msg.id))
      const uniqueNewMessages = newMessages.filter((msg) => !existingMessageIds.has(msg.messageId || msg.id))

      // 只有有新消息时才更新
      if (uniqueNewMessages.length > 0) {
        // 将新消息添加到消息列表前面
        messages.value = [...uniqueNewMessages, ...messages.value]
      } else if (newMessages.length > 0 && uniqueNewMessages.length === 0) {
        // 如果所有新消息都是重复的，说明已经加载完所有消息
        pagination.hasMore = false
      }
    }
  } catch (error) {
    console.error('加载更多消息失败:', error)
    ElMessage.error('加载更多消息失败')
  } finally {
    pagination.loading = false
  }
}
const throttledLoadMoreMessages = _.throttle(loadMoreMessages, 1000)

/**
 * 处理用户聊天消息
 * @returns {Promise<void>}
 */
const handleChatMessage = async (newFriendId) => {
  // 如果没有好友ID，则不执行任何操作
  if (!newFriendId) {
    return
  }

  // 重置分页参数
  pagination.page = 1
  pagination.hasMore = true
  pagination.loading = false

  try {
    const res = await messageHistory(newFriendId, pagination.page, pagination.size)
    // 设置消息窗口状态
    messageWindowStatus.value = '用户'

    // 使用setTimeout确保DOM完全更新后再设置消息和滚动
    setTimeout(() => {
      messages.value = formatMessages(res.data.data.list)

      // 如果消息数量小于页面大小，说明没有更多消息了
      if (res.data.data.list.length < pagination.size) {
        pagination.hasMore = false
      }

      // 再次使用setTimeout确保消息渲染后再滚动
      setTimeout(() => {
        if (messageDisplayRef.value) {
          messageDisplayRef.value.scrollToBottom()
        }
      }, 50)
    }, 0)
  } catch (error) {
    console.error('加载好友消息失败:', error)
    ElMessage.error('加载消息失败')
  }
}

/**
 * 处理群聊消息
 * @returns {Promise<void>}
 */
const handleChatRoomMessage = async (newChatRoomId) => {
  // 如果没有群聊ID，则不执行任何操作
  if (!newChatRoomId) {
    return
  }

  // 重置分页参数
  pagination.page = 1
  pagination.hasMore = true
  pagination.loading = false

  try {
    const res = await chatRoomHistory(newChatRoomId, pagination.page, pagination.size)
    // 设置消息窗口状态
    messageWindowStatus.value = '群聊'

    // 使用setTimeout确保DOM完全更新后再设置消息和滚动
    setTimeout(() => {
      messages.value = formatMessages(res.data.data.list)

      // 如果消息数量小于页面大小，说明没有更多消息了
      if (res.data.data.list.length < pagination.size) {
        pagination.hasMore = false
      }

      // 再次使用setTimeout确保消息渲染后再滚动
      setTimeout(() => {
        if (messageDisplayRef.value) {
          messageDisplayRef.value.scrollToBottom()
        }
      }, 50)
    }, 0)
  } catch (error) {
    console.error('加载群聊消息失败:', error)
    ElMessage.error('加载消息失败')
  }
}

// 处理消息删除
const handleMessageDeleted = (deletedMessage) => {
  // 从消息列表中移除被删除的消息
  messages.value = messages.value.filter((msg) => msg.messageId !== deletedMessage.messageId)
}

// 修改监听函数，确保在切换时清空之前的消息
watch(
  () => chatFriendOrChatRoom.friendId,
  (newVal) => {
    if (newVal) {
      // 清空群聊ID，避免同时触发两个请求
      if (chatFriendOrChatRoom.chatRoomId) {
        chatFriendOrChatRoom.setChatRoomId('')
      }
      // 清空消息列表
      messages.value = []
      // 加载好友消息
      handleChatMessage(newVal)
    }
  },
)

watch(
  () => chatFriendOrChatRoom.chatRoomId,
  (newVal) => {
    if (newVal) {
      // 清空好友ID，避免同时触发两个请求
      if (chatFriendOrChatRoom.friendId) {
        chatFriendOrChatRoom.setFriendId('')
      }
      // 清空消息列表
      messages.value = []
      // 加载群聊消息
      handleChatRoomMessage(newVal)
    }
  },
)

const drawerVisible = ref(false)
const friendInfo = ref({})
const getFriendInfo = async () => {
  if (!chatFriendOrChatRoom.friendId) {
    console.log('没有有效的 friendId')
    return
  }

  const res = await getUsersInfoById(chatFriendOrChatRoom.friendId)
  if (res.data.code === 200) {
    friendInfo.value = res.data.data
    console.log(friendInfo.value, 'feawjdiwji')
    // 设置标志位为false，表示这是初始化操作
    isUserAction.value = false
    if (res.data.data.isPinned === 1) {
      isTop.value = true
    } else {
      isTop.value = false
    }
    // 重置标志位，允许后续用户操作触发watch
    setTimeout(() => {
      isUserAction.value = true
    }, 0)
  }
}

const isTop = ref()
const muteNotifications = ref()
const blockUser = ref()
const isUserAction = ref(false)

/**
 * 处理打开更多选项抽屉
 */
const handleOpenMoreOptions = () => {
  drawerVisible.value = true
}

/**
 * 处理删除聊天记录点击
 */
const handleDeleteChatHistory = () => {
  // 实现删除聊天记录功能
  console.log('删除聊天记录')
  // 可以弹出确认对话框
}

/**
 * 处理举报用户点击
 */
const handleDeleteFriend = () => {
  // 实现举报用户功能
  console.log('删除好友')
  // 可以跳转到举报页面或打开举报表单
}

watch(
  () => isTop.value,
  async (val) => {
    // 只有当标志位为true时才执行API调用
    if (isUserAction.value) {
      if (val) {
        const res = await postFriendPin(chatFriendOrChatRoom.friendId, 1)
        console.log(res.data)
      } else {
        const res = await postFriendPin(chatFriendOrChatRoom.friendId, 0)
        console.log(res.data)
      }
    }
  },
)

watch(
  () => chatFriendOrChatRoom.friendId,
  async () => {
    await getFriendInfo()
  },
)
</script>

<template>
  <div class="chat-window">
    <!-- 消息显示组件 -->
    <MessageDisplay
      :messages="messages"
      :messageWindowStatus="messageWindowStatus"
      :loading="pagination.loading"
      @load-more="throttledLoadMoreMessages"
      @message-deleted="handleMessageDeleted"
      ref="messageDisplayRef"
    />
    <!-- 消息输入组件 -->
    <MessageInput @send-message="sendMessage" @open-more-options="handleOpenMoreOptions" />

    <!-- 更多选项抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :show-close="false"
      direction="rtl"
      size="300px"
      :modal-class="'chat-drawer-modal'"
      :with-header="false"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <div class="drawer-content">
        <!-- 选项列表 -->
        <div class="option-list">
          <!-- 置顶选项 -->
          <div class="option-item with-switch">
            <div class="option-info">
              <span class="option-text">设为置顶</span>
            </div>
            <el-switch v-model="isTop" @change="isUserAction = true" />
          </div>

          <!-- 消息免打扰选项 -->
          <div class="option-item with-switch">
            <div class="option-info">
              <span class="option-text">消息免打扰</span>
            </div>
            <el-switch v-model="muteNotifications" />
          </div>

          <!-- 屏蔽此人选项 -->
          <div class="option-item with-switch">
            <div class="option-info">
              <span class="option-text">屏蔽此人</span>
            </div>
            <el-switch v-model="blockUser" />
          </div>

          <!-- 删除聊天记录选项 -->
          <div class="option-item danger" @click="handleDeleteChatHistory">
            <div class="option-info">
              <span class="option-text">删除聊天记录</span>
            </div>
          </div>

          <div class="option-item delete" @click="handleDeleteFriend">
            <div class="option-info">
              <span>删除好友</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
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

.drawer-content {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  .option-list {
    .option-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;

      &:hover {
        background-color: #f9f9f9;
      }

      &.with-switch {
        cursor: default;
      }

      &.danger {
        .option-text {
          color: #f56c6c;
        }
      }

      &.delete {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ff4d4d;
      }

      .option-info {
        display: flex;
        align-items: center;

        .option-text {
          font-size: 15px;
          color: #333;
        }
      }

      .el-icon {
        color: #909399;
        font-size: 16px;
      }
    }
  }

  .report-section {
    margin-top: auto;
    padding: 20px 16px;
    border-top: 1px solid #f0f0f0;

    .report-link {
      color: #409eff;
      font-size: 14px;
      text-align: center;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// 自定义抽屉背景
:deep(.chat-drawer-modal) {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
