import instance from '@/api/https.js'

/**
 * 获取群聊的所有成员ID
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回获取群聊成员ID请求的Promise对象
 */
export const chatRoomUser = (roomId) =>
  instance({
    url: '/chat-rooms/roomUsers',
    method: 'get',
    params: { roomId },
  })

/**
 * 邀请好友加入群聊
 * @param {number[]} friendIds - 好友ID数组
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回邀请好友加入群聊请求的Promise对象
 */
export const inviteToChatRoom = (friendIds, roomId) =>
  instance({
    url: '/chat-rooms/invite',
    method: 'post',
    data: { friendIds, roomId },
  })

/**
 * 踢出群成员
 * @param {number} roomId - 群聊ID
 * @param {number[]} userIds - 要踢出的用户ID数组
 * @returns {Promise} - 返回踢出群成员请求的Promise对象
 */
export const kickOutChatRoomUsers = (roomId, userIds) =>
  instance({
    url: '/chat-rooms/kickOut',
    method: 'put',
    params: { roomId },
    data: userIds,
  })

/**
 * 设置管理员
 * @param {number} roomId - 群聊ID
 * @param {number} userId - 用户ID
 * @param {number} status - 状态（1: 设置，0: 取消）
 * @returns {Promise} - 返回设置管理员请求的Promise对象
 */
export const setChatRoomAdmin = (roomId, userId, status) =>
  instance({
    url: '/chat-rooms/setAdmin',
    method: 'post',
    params: { roomId, userId, status },
  })

/**
 * 转让群主
 * @param {number} roomId - 群聊ID
 * @param {number} userId - 新群主ID
 * @returns {Promise} - 返回转让群主请求的Promise对象
 */
export const transferChatRoomOwner = (roomId, userId) =>
  instance({
    url: '/chat-rooms/transferOwner',
    method: 'post',
    params: { roomId, userId },
  })
