import instance from '@/api/https.js'

/**
 * 创建新的群聊
 * @param {string} roomName - 群聊名称
 * @param {number[]} userIds - 用户ID数组（可选，初始成员）
 * @returns {Promise} - 返回创建群聊请求的Promise对象，包含群号
 */
export const chatRoomCreate = (roomName, userIds) =>
  instance({
    url: '/chat-rooms/create',
    method: 'post',
    data: { roomName, userIds },
  })

/**
 * 通过群号查询群聊信息
 * @param {string} groupNumber - 群号
 * @returns {Promise} - 返回查询群聊信息请求的Promise对象，包含群聊信息及用户是否在群中
 */
export const chatRoomInquire = (groupNumber) =>
  instance({
    url: '/chat-rooms/inquire',
    method: 'get',
    params: { groupNumber },
  })

/**
 * 通过ID查询群聊详情
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回查询群聊详情请求的Promise对象
 */
export const chatRoomInfoById = (roomId) =>
  instance({
    url: '/chat-rooms/getById',
    method: 'get',
    params: { roomId },
  })

/**
 * 获取用户加入的所有群聊
 * @returns {Promise} - 返回获取用户群聊列表请求的Promise对象
 */
export const chatRoomList = () =>
  instance({
    url: '/chat-rooms/roomlist',
    method: 'get',
  })

/**
 * 获取用户创建的群聊列表
 * @returns {Promise} - 返回获取创建的群聊列表请求的Promise对象
 */
export const chatRoomsCreateGroup = () =>
  instance({
    url: '/chat-rooms/createGroup',
    method: 'get',
  })

/**
 * 获取用户管理的群聊列表
 * @returns {Promise} - 返回获取管理的群聊列表请求的Promise对象
 */
export const chatRoomsManageGroup = () =>
  instance({
    url: '/chat-rooms/manageGroup',
    method: 'get',
  })

/**
 * 获取用户加入的群聊列表
 * @returns {Promise} - 返回获取加入的群聊列表请求的Promise对象
 */
export const chatRoomsJoinGroup = () =>
  instance({
    url: '/chat-rooms/joinGroup',
    method: 'get',
  })
