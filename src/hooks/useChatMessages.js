import { nextTick, reactive, shallowRef } from 'vue'
import { chatService } from '@/services/chatService.js'
import { formatMessages } from '@/utils/messageUtils.js'
import _ from 'lodash'

export function useChatMessages(messageDisplayRef) {
  // 使用 shallowRef 存储消息，减少深层响应式监听
  const messages = shallowRef([])
  // 消息窗口状态的响应式变量
  const messageWindowStatus = shallowRef('')

  // 分页参数
  const pagination = reactive({
    page: 1,
    size: 50,
    hasMore: true,
    loading: false,
  })

  /**
   * 更新消息列表，确保触发响应式更新
   * @param {Array} newMessages - 新的消息列表
   */
  const updateMessages = (newMessages) => {
    messages.value = [...newMessages]
  }

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
    const formattedMessages = formatMessages([...messages.value, message])
    updateMessages(formattedMessages)

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

    // 设置加载状态
    pagination.loading = true

    try {
      // 重置分页参数
      resetPagination()

      // 设置消息窗口状态
      messageWindowStatus.value = '用户'

      // 获取消息历史
      const newMessages = await chatService.handleFriendMessages(friendId, pagination)

      // 更新消息
      updateMessages(newMessages)

      // 确保DOM更新后再滚动
      nextTick(() => {
        if (messageDisplayRef.value) {
          messageDisplayRef.value.scrollToBottom()
        }
      })
    } catch (error) {
      console.error('加载好友消息失败:', error)
    } finally {
      pagination.loading = false
    }
  }

  /**
   * 加载群聊消息
   * @param {String} chatRoomId - 聊天室ID
   */
  const loadChatRoomMessages = async (chatRoomId) => {
    if (!chatRoomId) return

    // 设置加载状态
    pagination.loading = true

    try {
      // 重置分页参数
      resetPagination()

      // 设置消息窗口状态
      messageWindowStatus.value = '群聊'

      // 获取消息历史
      const newMessages = await chatService.handleChatRoomMessages(chatRoomId, pagination)

      // 更新消息
      updateMessages(newMessages)

      // 确保DOM更新后再滚动
      nextTick(() => {
        if (messageDisplayRef.value) {
          messageDisplayRef.value.scrollToBottom()
        }
      })
    } catch (error) {
      console.error('加载群聊消息失败:', error)
    } finally {
      pagination.loading = false
    }
  }

  /**
   * 加载更多消息
   * @param {Object} chatStore - 聊天状态存储
   */
  const loadMoreMessages = async (chatStore) => {
    // 如果正在加载或没有更多消息，则返回
    if (pagination.loading || !pagination.hasMore) return

    pagination.loading = true

    try {
      // 增加页码
      pagination.page += 1

      // 根据当前聊天类型加载消息
      let olderMessages = []
      if (chatStore.friendId) {
        olderMessages = await chatService.handleFriendMessages(chatStore.friendId, pagination)
      } else if (chatStore.chatRoomId) {
        olderMessages = await chatService.handleChatRoomMessages(chatStore.chatRoomId, pagination)
      }

      // 如果没有获取到消息，说明没有更多了
      if (olderMessages.length === 0) {
        pagination.hasMore = false
        return
      }

      // 合并消息，确保不重复
      const newMessages = [...olderMessages, ...messages.value]
      updateMessages(newMessages)
      console.log('加载完成，消息数量:', newMessages.length)
    } catch (error) {
      console.error('加载更多消息失败:', error)
    } finally {
      pagination.loading = false
    }
  }

  // 使用节流函数包装加载更多消息的函数，避免频繁调用
  const throttledLoadMoreMessages = (chatStore) => _.throttle(() => loadMoreMessages(chatStore), 1000)()

  /**
   * 处理消息删除
   * @param {Object} deletedMessage - 被删除的消息
   */
  const handleMessageDeleted = (deletedMessage) => {
    // 从消息列表中移除被删除的消息
    const filteredMessages = messages.value.filter((msg) => msg.messageId !== deletedMessage.messageId)
    updateMessages(filteredMessages)
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
      const formattedMessages = formatMessages([...messages.value, message])
      updateMessages(formattedMessages)

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
    updateMessages([])
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
