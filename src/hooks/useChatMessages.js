import { nextTick, reactive, ref } from 'vue'
import { chatService } from '@/services/chatService.js'
import { formatMessages } from '@/utils/messageUtils.js'
import _ from 'lodash'

export function useChatMessages(messageDisplayRef) {
  // 存储消息的响应式数组
  const messages = ref([])
  // 消息窗口状态的响应式变量
  const messageWindowStatus = ref('')

  // 分页参数
  const pagination = reactive({
    page: 1,
    size: 50,
    hasMore: true,
    loading: false,
  })

  /**
   * 重置分页参数
   */
  const resetPagination = () => {
    pagination.page = 1
    pagination.hasMore = true
    pagination.loading = false
  }

  /**
   * 处理WebSocket接收到的消息
   * @param {Object} message - 接收到的消息
   */
  const handleWebSocketMessage = (message) => {
    // 处理文件上传完成的消息
    if (message.type === 'file-upload-complete') {
      return message.fileUrl
    }

    // 将接收到的消息添加到消息列表
    messages.value = formatMessages([...messages.value, message])
    // 更新DOM后滚动到底部
    nextTick(() => {
      messageDisplayRef.value?.scrollToBottom()
    })

    return null
  }

  /**
   * 加载好友消息
   * @param {String} friendId - 好友ID
   */
  const loadFriendMessages = async (friendId) => {
    if (!friendId) return

    // 重置分页参数
    resetPagination()

    // 设置消息窗口状态
    messageWindowStatus.value = '用户'

    // 获取消息历史
    const newMessages = await chatService.handleFriendMessages(friendId, pagination)

    // 使用setTimeout确保DOM完全更新后再设置消息和滚动
    setTimeout(() => {
      messages.value = newMessages

      // 再次使用setTimeout确保消息渲染后再滚动
      setTimeout(() => {
        if (messageDisplayRef.value) {
          messageDisplayRef.value.scrollToBottom()
        }
      }, 50)
    }, 0)
  }

  /**
   * 加载群聊消息
   * @param {String} chatRoomId - 聊天室ID
   */
  const loadChatRoomMessages = async (chatRoomId) => {
    if (!chatRoomId) return

    // 重置分页参数
    resetPagination()

    // 设置消息窗口状态
    messageWindowStatus.value = '群聊'

    // 获取消息历史
    const newMessages = await chatService.handleChatRoomMessages(chatRoomId, pagination)

    // 使用setTimeout确保DOM完全更新后再设置消息和滚动
    setTimeout(() => {
      messages.value = newMessages

      // 再次使用setTimeout确保消息渲染后再滚动
      setTimeout(() => {
        if (messageDisplayRef.value) {
          messageDisplayRef.value.scrollToBottom()
        }
      }, 50)
    }, 0)
  }

  /**
   * 加载更多消息
   */
  const loadMoreMessages = async (chatStore) => {
    const type = messageWindowStatus.value === '用户' ? 'friend' : 'group'
    const id = type === 'friend' ? chatStore.friendId : chatStore.chatRoomId

    messages.value = await chatService.loadMoreMessages(type, id, pagination, messages.value)
  }

  // 使用节流函数优化加载更多消息的性能
  const throttledLoadMoreMessages = (chatStore) => _.throttle(() => loadMoreMessages(chatStore), 1000)()

  /**
   * 处理消息删除
   * @param {Object} deletedMessage - 被删除的消息
   */
  const handleMessageDeleted = (deletedMessage) => {
    // 从消息列表中移除被删除的消息
    messages.value = messages.value.filter((msg) => msg.messageId !== deletedMessage.messageId)
  }

  /**
   * 发送消息
   * @param {Object} messageInfo - 消息信息
   * @param {String} senderId - 发送者ID
   * @param {String} friendId - 好友ID
   * @param {String} chatRoomId - 聊天室ID
   * @param {Object} websocket - WebSocket服务实例
   */
  const sendMessage = (messageInfo, senderId, friendId, chatRoomId, websocket) => {
    const message = chatService.sendMessage(
      messageInfo,
      messageWindowStatus.value,
      senderId,
      friendId,
      chatRoomId,
      websocket,
    )

    if (message) {
      // 更新消息列表
      messages.value = formatMessages([...messages.value, message])

      // 更新DOM后滚动到底部
      nextTick(() => {
        messageDisplayRef.value?.scrollToBottom()
      })
    }
  }

  /**
   * 清空消息列表
   */
  const clearMessages = () => {
    messages.value = []
  }

  /**
   * 设置消息窗口状态
   * @param {String} status - 新的状态
   */
  const setMessageWindowStatus = (status) => {
    messageWindowStatus.value = status
  }

  return {
    messages,
    messageWindowStatus,
    pagination,
    resetPagination,
    handleWebSocketMessage,
    loadFriendMessages,
    loadChatRoomMessages,
    loadMoreMessages,
    throttledLoadMoreMessages,
    handleMessageDeleted,
    sendMessage,
    clearMessages,
    setMessageWindowStatus,
  }
}
