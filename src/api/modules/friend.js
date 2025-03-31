import instance from '@/api/https.js'

/**
 * 添加好友接口
 * @param {string} friendNumber - 好友账号
 * @returns {Promise} - 返回添加好友请求结果的Promise对象
 */
export const addFriend = (friendNumber) =>
  instance({
    url: '/friends/add',
    method: 'post',
    data: { friendNumber }, // 使用data传递请求体数据
  })

/**
 * 获取当前用户的好友列表接口
 * @returns {Promise} - 返回包含好友列表的Promise对象
 */
export const getFriendList = () =>
  instance({
    url: '/friends/friendlist',
    method: 'get',
  })

/**
 * 处理好友请求接口
 * @param {number} relationId - 好友关系ID
 * @param {number} status - 状态（1同意，2拒绝）
 * @returns {Promise} - 返回处理结果的Promise对象
 */
export const handleFriend = (relationId, status) =>
  instance({
    url: '/friends/accept',
    method: 'put',
    data: { relationId, status }, // 使用data传递请求体数据
  })

/**
 * 获取与指定好友的未读消息数量接口
 * @param {number} relationId - 好友关系ID
 * @returns {Promise} - 返回包含未读消息数量的Promise对象
 */
export const friendMessageCount = (relationId) =>
  instance({
    url: '/friends/messageCount',
    method: 'get',
    params: { relationId },
  })

/**
 * 设置好友的备注名称接口
 * @param {number} friendId - 好友ID
 * @param {string} remark - 备注名称
 * @returns {Promise} - 返回修改结果的Promise对象
 */
export const postFriendsRemark = (friendId, remark) =>
  instance({
    url: '/friends/remark',
    method: 'post',
    data: { friendId, remark }, // 使用data传递请求体数据
  })

/**
 * 设置或取消好友置顶状态接口
 * @param {number} friendId - 好友ID
 * @param {number} status - 状态（1置顶，0取消置顶）
 * @returns {Promise} - 返回操作结果的Promise对象
 */
export const postFriendPin = (friendId, status) =>
  instance({
    url: '/friends/togglePin',
    method: 'put',
    data: { friendId, status }, // 使用data传递请求体数据
  })

/**
 * 获取消息历史
 * @param {Ref<any>} receiverId - 接收者ID
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
