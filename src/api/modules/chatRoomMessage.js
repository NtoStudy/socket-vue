import instance from '@/api/https.js'

/**
 * 获取群聊中的未读消息数量
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回获取未读消息数量请求的Promise对象
 */
export const groupMessageCount = (roomId) =>
  instance({
    url: '/chat-rooms/messageCount',
    method: 'get',
    params: { roomId },
  })
/**
 * 获取聊天室历史消息
 * @param {number} chatRoomId - 聊天室ID
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 每页大小
 * @returns {Promise} - 返回获取聊天室历史消息请求的Promise对象
 */
export const chatRoomHistory = (chatRoomId, pageNum, pageSize) =>
  instance({
    url: '/group-messages/history',
    method: 'get',
    params: { chatRoomId, pageNum, pageSize },
  })

/**
 * 删除聊天室消息
 * @param {number} chatRoomId - 聊天室ID
 * @param {number} messageId - 消息ID
 * @returns {Promise} - 返回删除聊天室消息请求的Promise对象
 */
export const chatRoomDelete = (chatRoomId, messageId) =>
  instance({
    url: '/group-messages/delete',
    method: 'delete',
    params: { chatRoomId, messageId },
  })
