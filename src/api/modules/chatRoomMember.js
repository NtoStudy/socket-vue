import instance from '@/api/https.js'

// 获取群聊的所有成员ID
export const chatRoomUser = (roomId) =>
  instance({
    url: '/chat-rooms/roomUsers',
    method: 'get',
    params: { roomId },
  })

// 邀请好友加入群聊
export const inviteToChatRoom = (friendIds, roomId) =>
  instance({
    url: '/chat-rooms/invite',
    method: 'post',
    params: { friendIds, roomId },
  })

// 踢出群成员
export const kickOutChatRoomUsers = (roomId, userIds) =>
  instance({
    url: '/chat-rooms/kickOut',
    method: 'put',
    params: { roomId },
    data: userIds,
  })

// 设置管理员
export const setChatRoomAdmin = (roomId, userId, status) =>
  instance({
    url: '/chat-rooms/setAdmin',
    method: 'post',
    params: { roomId, userId, status },
  })

// 转让群主
export const transferChatRoomOwner = (roomId, userId) =>
  instance({
    url: '/chat-rooms/transferOwner',
    method: 'post',
    params: { roomId, userId },
  })
