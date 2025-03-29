import { messageHistory } from '@/api/modules/friend.js'
import { chatRoomHistory } from '@/api/modules'
import { formatMessages, formatSentTime } from '@/utils/messageUtils.js'

/**
 * 消息处理服务
 */
export const messageService = {
  /**
   * 获取好友消息历史
   * @param {Number} friendId - 好友ID
   * @param {Number} page - 页码
   * @param {Number} size - 每页数量
   * @returns {Promise<Array>} - 格式化后的消息数组
   */
  async getFriendMessages(friendId, page = 1, size = 100) {
    try {
      const res = await messageHistory(friendId, page, size)
      return formatMessages(res.data.data.list)
    } catch (error) {
      console.error('获取好友消息失败:', error)
      return []
    }
  },

  /**
   * 获取群聊消息历史
   * @param {Number} chatRoomId - 聊天室ID
   * @param {Number} page - 页码
   * @param {Number} size - 每页数量
   * @returns {Promise<Array>} - 格式化后的消息数组
   */
  async getChatRoomMessages(chatRoomId, page = 1, size = 100) {
    try {
      const res = await chatRoomHistory(chatRoomId, page, size)
      return formatMessages(res.data.data.list)
    } catch (error) {
      console.error('获取群聊消息失败:', error)
      return []
    }
  },

  /**
   * 创建消息对象
   * @param {String} type - 消息类型
   * @param {String} content - 消息内容
   * @param {String} senderId - 发送者ID
   * @param {String} receiverId - 接收者ID，好友消息时提供
   * @param {String} chatRoomId - 聊天室ID，群聊消息时提供
   * @returns {Object} - 消息对象
   */
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
