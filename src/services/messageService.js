import { messageHistory } from '@/api/modules/friend.js'
import { chatRoomHistory } from '@/api/index.js'
import { formatMessages, formatSentTime } from '@/utils/messageUtils.js'

// 消息处理服务
export const messageService = {
  // 获取好友消息历史
  async getFriendMessages(friendId, page = 1, size = 100) {
    try {
      const res = await messageHistory(friendId, page, size)
      return formatMessages(res.data.data.list)
    } catch (error) {
      console.error('获取好友消息失败:', error)
      return []
    }
  },

  // 获取群聊消息历史
  async getChatRoomMessages(chatRoomId, page = 1, size = 100) {
    try {
      const res = await chatRoomHistory(chatRoomId, page, size)
      return formatMessages(res.data.data.list)
    } catch (error) {
      console.error('获取群聊消息失败:', error)
      return []
    }
  },

  // 创建消息对象
  createMessage(type, content, senderId, receiverId = null, chatRoomId = null) {
    const baseMessage = {
      messageType: type,
      content,
      senderId,
      sentTime: formatSentTime(new Date().toISOString()),
    }

    if (receiverId) {
      return { ...baseMessage, receiverId }
    } else if (chatRoomId) {
      return { ...baseMessage, chatRoomId }
    }

    return baseMessage
  },
}
