import instance from '@/api/index.js'

/**
 * 添加好友
 * @param {string} friendNumber - 好友编号
 * @returns {Promise} - 返回添加好友请求的Promise对象
 */
export const addFriend = (friendNumber) =>
  instance({
    url: '/friends/add',
    method: 'post',
    params: { friendNumber },
  })

/**
 * 获取好友列表
 * @returns {Promise} - 返回获取好友列表请求的Promise对象
 */
export const getFriendList = () =>
  instance({
    url: '/friends/friendlist',
    method: 'get',
  })

/**
 * 处理好友请求
 * @param {string} relationId - 关系ID
 * @param {number} status - 状态 1同意 2拒绝
 * @returns {Promise} - 返回处理好友请求的Promise对象
 */
//status是1代表同意，是2代表拒绝
export const handleFriend = (relationId, status) =>
  instance({
    url: '/friends/accept',
    method: 'put',
    params: { relationId, status },
  })

/**
 * 获取消息历史
 * @param {number} receiverId - 接收者ID
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 每页大小
 * @returns {Promise} - 返回获取消息历史的Promise对象
 */
export const messageHistory = (receiverId, pageNum, pageSize) =>
  instance({
    url: '/messages/history',
    method: 'get',
    params: { receiverId, pageNum, pageSize },
  })

/**
 * 删除消息
 * @param {int} messageId - 消息ID
 * @returns {Promise} - 返回删除消息请求的Promise对象
 */
export const messageDelete = (messageId) =>
  instance({
    url: '/messages/delete',
    method: 'delete',
    params: { messageId },
  })

/**
 * 获取好友消息数量
 * @param relationId
 * @returns {*}
 */
export const friendMessageCount = (relationId) =>
  instance({
    url: '/friends/messageCount',
    method: 'get',
    params: { relationId },
  })
