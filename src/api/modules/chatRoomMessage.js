import instance from '@/api/https.js'

// 获取群聊中的未读消息数量
export const groupMessageCount = (roomId) =>
  instance({
    url: '/chat-rooms/messageCount',
    method: 'get',
    params: { roomId },
  })
// 获取聊天室历史消息
export const chatRoomHistory = (chatRoomId, pageNum, pageSize) =>
  instance({
    url: '/group-messages/history',
    method: 'get',
    params: { chatRoomId, pageNum, pageSize },
  })

// 删除聊天室消息
export const chatRoomDelete = (chatRoomId, messageId) =>
  instance({
    url: '/group-messages/delete',
    method: 'delete',
    params: { chatRoomId, messageId },
  })
