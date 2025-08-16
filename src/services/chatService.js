import { messageService } from './messageService.js'
import { getUsersInfoById } from '@/api/modules/user.js'
import { postFriendPin } from '@/api/modules/friend.js'
import { ElMessage } from 'element-plus'
import eventBus from '@/EventBus/eventBus.js'

export const chatService = {
  // 处理用户聊天消息
  async handleFriendMessages(friendId, pagination) {
    if (!friendId) return []

    try {
      // 获取消息历史
      const messages = await messageService.getFriendMessages(friendId, pagination.page, pagination.size)

      // 如果消息数量小于页面大小，说明没有更多消息了
      if (messages.length < pagination.size) {
        pagination.hasMore = false
      }

      return messages
    } catch (error) {
      console.error('加载好友消息失败:', error)
      ElMessage.error('加载消息失败')
      return []
    }
  },

  // 处理群聊消息
  async handleChatRoomMessages(chatRoomId, pagination) {
    if (!chatRoomId) return []

    try {
      // 获取消息历史
      const messages = await messageService.getChatRoomMessages(chatRoomId, pagination.page, pagination.size)

      // 如果消息数量小于页面大小，说明没有更多消息了
      if (messages.length < pagination.size) {
        pagination.hasMore = false
      }

      return messages
    } catch (error) {
      console.error('加载群聊消息失败:', error)
      ElMessage.error('加载消息失败')
      return []
    }
  },

  // 加载更多消息
  async loadMoreMessages(type, id, pagination, currentMessages) {
    if (!pagination.hasMore || pagination.loading) return currentMessages

    pagination.loading = true
    pagination.page++

    try {
      let newMessages = []

      if (type === 'friend' && id) {
        newMessages = await messageService.getFriendMessages(id, pagination.page, pagination.size)
      } else if (type === 'group' && id) {
        newMessages = await messageService.getChatRoomMessages(id, pagination.page, pagination.size)
      }

      // 如果没有新消息，说明已经加载完所有消息
      if (newMessages.length === 0) {
        pagination.hasMore = false
        return currentMessages
      }

      // 过滤掉已经存在的消息，避免重复
      const existingMessageIds = new Set(currentMessages.map((msg) => msg.messageId || msg.id))
      const uniqueNewMessages = newMessages.filter((msg) => !existingMessageIds.has(msg.messageId || msg.id))

      // 只有有新消息时才更新
      if (uniqueNewMessages.length > 0) {
        // 将新消息添加到消息列表前面
        return [...uniqueNewMessages, ...currentMessages]
      } else if (newMessages.length > 0 && uniqueNewMessages.length === 0) {
        // 如果所有新消息都是重复的，说明已经加载完所有消息
        pagination.hasMore = false
      }

      return currentMessages
    } catch (error) {
      console.error('加载更多消息失败:', error)
      ElMessage.error('加载更多消息失败')
      return currentMessages
    } finally {
      pagination.loading = false
    }
  },

  // 发送消息
  sendMessage({ type, content }, messageWindowStatus, senderId, friendId, chatRoomId, websocket) {
    // 检查消息内容是否为空
    if (!content.trim()) {
      ElMessage.error('消息内容不能为空')
      return null
    }

    let message = null

    // 根据消息窗口状态发送消息
    if (messageWindowStatus === '用户') {
      // 创建消息对象
      message = messageService.createMessage(type, content, senderId, friendId)

      // 通过WebSocket发送消息
      websocket.sendMessage('friend', content, friendId, null, type)

      // 触发事件更新好友列表
      eventBus.emit('call-handleFriendList')
    } else if (messageWindowStatus === '群聊') {
      // 创建消息对象
      message = messageService.createMessage(type, content, senderId, null, chatRoomId)

      // 通过WebSocket发送消息
      websocket.sendMessage('group', content, null, chatRoomId, type)
    }

    return message
  },

  // 获取好友信息
  async getFriendInfo(friendId) {
    if (!friendId) {
      console.log('没有有效的 friendId')
      return null
    }

    try {
      const res = await getUsersInfoById(friendId)
      if (res.data.code === 200) {
        return res.data.data
      }
    } catch (error) {
      console.error('获取好友信息失败:', error)
      ElMessage.error('获取好友信息失败')
    }

    return null
  },

  // 处理置顶状态变更
  async handleTopChange(friendId, value) {
    try {
      const status = value ? 1 : 0
      const res = await postFriendPin(friendId, status)
      if (res.data.code === 200) {
        ElMessage.success(value ? '已置顶联系人' : '已取消置顶')
        // 触发事件更新好友列表
        eventBus.emit('call-handleFriendList')
        return true
      }
    } catch (error) {
      console.error('更新置顶状态失败:', error)
      ElMessage.error('操作失败，请稍后重试')
    }

    return false
  },
}
