<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useUserInfoStore } from '@/store/user.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import WebSocketService from '@/services/websocket.js'
import MessageDisplay from './MessageDisplay/index.vue'
import MessageInput from './MessageInput/index.vue'
import ChatOptionsDrawer from '@/components/common/FriendOptionsDrawer/index.vue'
import { useChatMessages } from '@/hooks/useChatMessages.js'
import { ElMessage } from 'element-plus'
import GroupChatOptionsDrawer from '@/components/common/GroupOptionsDrawer/index.vue'
import { computed } from 'vue'
import eventBus from '@/EventBus/eventBus.js'

// 消息显示组件的引用，用于操作DOM
const messageDisplayRef = ref(null)

// 使用聊天状态管理store
const chatStore = chatFriendOrChatRoomStore()
const userStore = useUserInfoStore()

// 使用WebSocket服务
const websocket = new WebSocketService()

// 使用消息处理钩子
const {
  messages,
  messageWindowStatus,
  clearMessages,
  pagination,
  handleWebSocketMessage,
  loadFriendMessages,
  loadChatRoomMessages,
  throttledLoadMoreMessages,
  handleMessageDeleted,
  sendMessage,
} = useChatMessages(messageDisplayRef)

// 抽屉相关状态
const drawerVisible = ref(false)

// 用于存储文件URL的响应式变量
const fileUrl = ref('')

/**
 * 处理WebSocket接收到的消息
 * @param {Object} message - 接收到的消息
 */
const onWebSocketMessage = (message) => {
  // 处理文件上传完成的消息
  if (message.type === 'file-upload-complete') {
    fileUrl.value = message.fileUrl
    sendMessageToChat({ type: 'video', content: fileUrl.value })
    return
  }

  // 处理普通消息
  handleWebSocketMessage(message)
}

/**
 * 发送消息到聊天
 * @param {Object} messageInfo - 消息信息
 */
const sendMessageToChat = (messageInfo) => {
  const senderId = userStore.userInfo.userId
  const friendId = chatStore.friendId
  const chatRoomId = chatStore.chatRoomId

  sendMessage(messageInfo, senderId, friendId, chatRoomId, websocket)
}

/**
 * 处理抽屉关闭
 * @param {Boolean} visible - 抽屉可见性
 */
const handleDrawerClose = (visible) => {
  drawerVisible.value = visible
}

/**
 * 处理置顶状态变更
 * @param {Boolean} value - 新的置顶状态
 */
const handleTopChange = async (value) => {
  await chatStore.updateTopStatus(value)
  // 触发事件更新好友列表
  eventBus.emit('call-handleFriendList')
}

/**
 * 处理删除聊天记录
 */
const handleDeleteChatHistory = () => {
  // 实现删除聊天记录功能
  console.log('删除聊天记录')
  // 可以弹出确认对话框
  ElMessage.info('删除聊天记录功能尚未实现')
}

/**
 * 处理删除好友
 */
const handleDeleteFriend = () => {
  // 实现删除好友功能
  console.log('删除好友')
  // 可以弹出确认对话框
  ElMessage.info('删除好友功能尚未实现')
}

// 在组件挂载时执行
onMounted(() => {
  // 连接WebSocket
  websocket.connect()
  // 监听WebSocket消息
  websocket.onMessage(onWebSocketMessage)
  if (chatStore.friendId) {
    clearMessages()
    loadFriendMessages(chatStore.friendId)
  } else if (chatStore.chatRoomId) {
    clearMessages()
    loadChatRoomMessages(chatStore.chatRoomId)
  }
})

// 在组件卸载时执行
onUnmounted(() => {
  // 断开WebSocket连接
  websocket.disconnect()
})

// 监听好友ID变化，加载对应的消息
watch(
  () => chatStore.friendId,
  (newVal) => {
    if (newVal) {
      // 清空群聊ID，避免同时触发两个请求
      if (chatStore.chatRoomId) {
        chatStore.setChatRoomId('')
      }
      // 清空消息列表
      clearMessages()
      // 加载好友消息
      loadFriendMessages(newVal)
    }
  },
)

// 监听群聊ID变化，加载对应的消息
watch(
  () => chatStore.chatRoomId,
  (newVal) => {
    if (newVal) {
      // 清空好友ID，避免同时触发两个请求
      if (chatStore.friendId) {
        chatStore.setFriendId('')
      }
      // 清空消息列表
      clearMessages()
      // 加载群聊消息
      loadChatRoomMessages(newVal)
    }
  },
)

// 添加一个计算属性来判断当前是否为群聊
const isGroupChat = computed(() => {
  return chatStore.chatRoomId !== null && chatStore.chatRoomId !== undefined
})

// 群聊抽屉可见性
const groupDrawerVisible = ref(false)

// 群聊信息
const groupInfo = computed(() => {
  console.log('chatStore.chatRoomInfo', chatStore.groupInfo)
  return chatStore.groupInfo || {}
})

// // 判断当前用户是否为群主
// const isGroupOwner = computed(() => {
//   return 1
// })
//
// // 判断当前用户是否为管理员
// const isGroupAdmin = computed(() => {
//
// })

/**
 * 打开更多选项抽屉
 */
const openDrawer = () => {
  // 根据聊天类型打开不同的抽屉
  if (isGroupChat.value) {
    groupDrawerVisible.value = true
  } else {
    drawerVisible.value = true
  }
}

/**
 * 处理群聊抽屉关闭
 */
const handleGroupDrawerClose = () => {
  groupDrawerVisible.value = false
}

/**
 * 处理群聊置顶状态变更
 */
const handleGroupTopChange = async (value) => {
  const success = await chatStore.updateGroupTopStatus(value)
  console.log('更新群聊置顶状态成功', success)
  if (success) {
    // 可以在这里添加其他逻辑，如刷新群聊列表等
  }
}

/**
 * 处理删除群聊历史记录
 */
const handleDeleteGroupChatHistory = async () => {
  console.log('删除群聊历史记录')
}

/**
 * 处理退出群聊
 */
const handleExitGroup = async () => {
  console.log('退出群聊')
}

/**
 * 处理解散群聊
 */
const handleDissolveGroup = async () => {
  console.log('解散群')
}

/**
 * 处理查看群信息
 */
const handleViewGroupInfo = () => {
  // 实现查看群信息的逻辑
  console.log('查看群信息')
}

/**
 * 处理管理群成员
 */
const handleManageMembers = () => {
  // 实现管理群成员的逻辑
  console.log('管理群成员')
}

/**
 * 处理修改群名称
 */
const handleChangeGroupName = () => {
  console.log('修改群名称')
}

/**
 * 处理修改群公告
 */
const handleChangeGroupNotice = () => {
  console.log('修改群公告')
}

/**
 * 处理全员禁言状态变更
 */
const handleMuteAll = async () => {
  console.log('全员禁言状态变更')
}

/**
 * 处理入群方式变更
 */
const handleChangeJoinMethod = async () => {
  console.log('入群方式变更')
}
</script>

<template>
  <div class="chat-window">
    <!-- 消息显示组件 -->
    <MessageDisplay
      :messages="messages"
      :messageWindowStatus="messageWindowStatus"
      :loading="pagination.loading"
      @load-more="throttledLoadMoreMessages(chatStore)"
      @message-deleted="handleMessageDeleted"
      ref="messageDisplayRef"
    />

    <!-- 消息输入组件 -->
    <MessageInput @send-message="sendMessageToChat" @open-more-options="openDrawer" />

    <!-- 更多选项抽屉 -->
    <ChatOptionsDrawer
      :visible="drawerVisible"
      :isTop="chatStore.isTop"
      @close="handleDrawerClose"
      @topChange="handleTopChange"
      @deleteChatHistory="handleDeleteChatHistory"
      @deleteFriend="handleDeleteFriend"
    />

    <!--      :isGroupOwner="isGroupOwner"-->
    <!--      :isGroupAdmin="isGroupAdmin"-->
    <!-- 群聊更多选项抽屉 -->
    <GroupChatOptionsDrawer
      :visible="groupDrawerVisible"
      :groupInfo="groupInfo"
      :isGroupTop="chatStore.isGroupTop"
      @close="handleGroupDrawerClose"
      @topChange="handleGroupTopChange"
      @deleteChatHistory="handleDeleteGroupChatHistory"
      @exitGroup="handleExitGroup"
      @dissolveGroup="handleDissolveGroup"
      @viewGroupInfo="handleViewGroupInfo"
      @manageMembers="handleManageMembers"
      @changeGroupName="handleChangeGroupName"
      @changeGroupNotice="handleChangeGroupNotice"
      @muteAll="handleMuteAll"
      @changeJoinMethod="handleChangeJoinMethod"
    />
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
  height: 100%;
  overflow: hidden;
  position: relative;

  & > :first-child {
    flex: 1;
    overflow: hidden;
  }

  & > :last-child {
    flex-shrink: 0;
  }
}
</style>
