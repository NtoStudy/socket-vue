import { nextTick, reactive, shallowRef } from 'vue'
import { chatService } from '@/services/chatService.js'
import { formatMessages } from '@/utils/messageUtils.js'
import _ from 'lodash'
//TODO等大部分组件写完的时候再多了解一下这些消息处理的逻辑
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

  // 更新消息列表，确保触发响应式更新
  const updateMessages = (newMessages) => {
    messages.value = [...newMessages]
  }

  // 重置分页参数
  const resetPagination = () => {
    pagination.page = 1
    pagination.hasMore = true
    pagination.loading = false
  }

  // 处理WebSocket接收到的消息
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

  // 加载好友消息
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
    } finally {
      pagination.loading = false
    }
  }

  // 加载群聊消息
  // 在 useChatMessages.js 中修改 loadChatRoomMessages 函数
  const loadChatRoomMessages = async (chatRoomId) => {
    if (!chatRoomId) return

    // 设置加载状态
    pagination.loading = true

    try {
      // 重置分页参数
      resetPagination()

      // 先清空消息列表，避免消息累加
      updateMessages([])

      // 设置消息窗口状态
      messageWindowStatus.value = '群聊'

      // 获取群聊消息
      const chatRoomMessages = await chatService.handleChatRoomMessages(chatRoomId, pagination)

      updateMessages(chatRoomMessages)

      // 更新DOM后滚动到底部
      nextTick(() => {
        messageDisplayRef.value?.scrollToBottom()
      })
    } catch (error) {
      console.error('加载群聊消息失败:', error)
    } finally {
      pagination.loading = false
    }
  }
  // 加载更多消息
  // 加载更多消息
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

      // 使用 Set 和 Map 来去重，确保消息不会重复
      const messageMap = new Map()

      // 先添加历史消息
      olderMessages.forEach((msg) => {
        if (msg.messageId) {
          messageMap.set(msg.messageId, msg)
        }
      })

      // 再添加当前消息，如果有相同ID的消息，会覆盖历史消息
      messages.value.forEach((msg) => {
        if (msg.messageId) {
          messageMap.set(msg.messageId, msg)
        }
      })

      // 将 Map 转换回数组，并按时间排序
      const combinedMessages = Array.from(messageMap.values()).sort((a, b) => {
        // 使用 originalTimestamp 或 sentTime 进行排序
        const timeA = a.originalTimestamp || new Date(a.sentTime).getTime()
        const timeB = b.originalTimestamp || new Date(b.sentTime).getTime()
        return timeA - timeB
      })
      updateMessages(combinedMessages)
    } catch (error) {
      console.error('加载更多消息失败:', error)
    } finally {
      pagination.loading = false
    }
  }
  // 使用节流函数包装加载更多消息的函数，避免频繁调用
  const throttledLoadMoreMessages = (chatStore) => _.throttle(() => loadMoreMessages(chatStore), 1000)()

  // 处理消息删除
  const handleMessageDeleted = (deletedMessage) => {
    // 从消息列表中移除被删除的消息
    const filteredMessages = messages.value.filter((msg) => msg.messageId !== deletedMessage.messageId)
    updateMessages(filteredMessages)
  }

  // 发送消息
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

  // 清空消息列表
  const clearMessages = () => {
    updateMessages([])
  }

  // 设置消息窗口状态
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
