import instance from '@/api/https.js'

/**
 * 创建新的好友分组接口
 * @param {string} groupName - 分组名称
 * @returns {Promise} - 返回创建结果的Promise对象
 */
export const createFriendGroup = (groupName) =>
  instance({
    url: '/friend-groups/create',
    method: 'post',
    params: { groupName }, // 使用data传递请求体数据
  })

/**
 * 修改已有分组的名称接口
 * @param {number} groupId - 分组ID
 * @param {string} groupName - 新的分组名称
 * @returns {Promise} - 返回修改结果的Promise对象
 */
export const updateFriendGroup = (groupId, groupName) =>
  instance({
    url: '/friend-groups/update',
    method: 'post',
    params: { groupId, groupName }, // 使用data传递请求体数据
  })

/**
 * 删除指定的好友分组接口
 * @param {number} groupId - 分组ID
 * @returns {Promise} - 返回删除结果的Promise对象
 */
export const deleteFriendGroup = (groupId) =>
  instance({
    url: '/friend-groups/delete',
    method: 'delete',
    params: { groupId },
  })

/**
 * 获取当前用户的所有分组接口
 * @returns {Promise} - 返回包含分组列表的Promise对象
 */
export const getFriendGroupList = () =>
  instance({
    url: '/friend-groups/list',
    method: 'get',
  })

/**
 * 查询指定分组内的所有好友接口
 * @param {number} groupId - 分组ID
 * @returns {Promise} - 返回包含分组内好友列表的Promise对象
 */
export const getFriendGroupFriendList = (groupId) =>
  instance({
    url: '/friend-groups/friendList',
    method: 'get',
    params: { groupId },
  })
