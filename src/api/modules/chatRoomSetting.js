import instance from '@/api/index.js'

/**
 * 修改群聊名称
 * @param {number} roomId - 群聊ID
 * @param {string} groupName - 新群名
 * @returns {Promise} - 返回修改群聊名称请求的Promise对象
 */
export const changeChatRoomName = (roomId, groupName) =>
  instance({
    url: '/chat-rooms/changeGroupName',
    method: 'put',
    params: { roomId, groupName },
  })
/**
 * 修改用户在群聊中的昵称
 * @param {string} nickname - 新昵称
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回修改群聊昵称请求的Promise对象
 */
export const updateChatRoomNickname = (nickname, roomId) =>
  instance({
    url: '/chat-rooms/nickname',
    method: 'put',
    params: { nickname, roomId },
  })
/**
 * 获取用户置顶的群聊列表
 * @returns {Promise} - 返回获取置顶群聊列表请求的Promise对象
 */
export const chatRoomsPinnedGroup = () =>
  instance({
    url: '/chat-rooms/pinnedGroup',
    method: 'get',
  })

/**
 * 设置或取消群聊置顶状态
 * @param {number} roomId - 群聊ID
 * @param {number} status - 状态（1: 置顶，2: 取消置顶）
 * @returns {Promise} - 返回设置群聊置顶状态请求的Promise对象
 */
export const setChatRoomPinned = (roomId, status) =>
  instance({
    url: '/chat-rooms/pinnedGroup',
    method: 'post',
    params: { roomId, status },
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
/**
 * 申请加入指定群聊
 * @param {string} groupNumber - 群号
 * @returns {Promise} - 返回申请加入群聊请求的Promise对象
 */
export const groupAddChatRoom = (groupNumber) =>
  instance({
    url: '/chat-rooms/addgroup',
    method: 'post',
    params: { groupNumber },
  })

/**
 * 接受或拒绝群聊邀请
 * @param {number} roomId - 群聊ID
 * @param {number} status - 状态（1: 接受，2: 拒绝）
 * @returns {Promise} - 返回处理群聊邀请请求的Promise对象
 */
export const chatRoomHandle = (roomId, status) =>
  instance({
    url: '/chat-rooms/accept',
    method: 'put',
    params: { roomId, status },
  })
/**
 * 退出或者解散群聊
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回退出或解散群聊请求的Promise对象
 */
export const quitOrDismissChatRoom = (roomId) =>
  instance({
    url: '/chat-rooms/quit',
    method: 'put',
    params: { roomId },
  })
