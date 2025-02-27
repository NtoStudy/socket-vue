import instance from '@/api/index.js'

/**
 * 创建聊天室
 * @param {string} roomName - 聊天室名称
 * @param {number[]} userIds - 用户ID数组
 * @returns {Promise} - 返回创建聊天室请求的Promise对象
 */
export const chatRoomCreate = (roomName, userIds) =>
  instance({
    url: '/chat-rooms/create',
    method: 'post',
    data: { roomName, userIds },
  })

/**
 * 获取聊天室信息
 * @param groupNumber
 * @returns {*}
 */
export const chatRoomInquire = (groupNumber) =>
  instance({
    url: '/chat-rooms/inquire',
    method: 'get',
    params: { groupNumber },
  })

/**
 * 处理聊天室邀请或请求
 * @param {number} roomId - 聊天室ID
 * @param {string} status - 处理状态
 * @returns {Promise} - 返回处理聊天室邀请或请求的Promise对象
 */
export const chatRoomHandle = (roomId, status) =>
  instance({
    url: '/chat-rooms/accept',
    method: 'put',
    params: { roomId, status },
  })

/**
 * 获取聊天室列表
 * @returns {Promise} - 返回获取聊天室列表请求的Promise对象
 */
export const chatRoomList = () =>
  instance({
    url: '/chat-rooms/roomlist',
    method: 'get',
  })

/**
 * 获取聊天室用户列表
 * @param {number} roomId - 聊天室ID
 * @returns {Promise} - 返回获取聊天室用户列表请求的Promise对象
 */
export const chatRoomUser = (roomId) =>
  instance({
    url: '/chat-rooms/roomUsers',
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

export const groupMessageCount = (roomId) =>
  instance({
    url: '/chat-rooms/messageCount',
    method: 'get',
    params: { roomId },
  })
