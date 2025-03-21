import instance from '@/api/index.js'

/**
 * 创建好友分组
 * @param {string} groupName - 分组名称
 * @returns {Promise} - 返回创建好友分组请求的Promise对象
 */
export const createFriendGroup = (groupName) =>
  instance({
    url: '/friend-groups/create',
    method: 'post',
    params: { groupName },
  })

/**
 * 修改分组名称
 * @param {number} groupId - 分组ID
 * @param {string} groupName - 新的分组名称
 * @returns {Promise} - 返回修改分组名称请求的Promise对象
 */
export const updateFriendGroup = (groupId, groupName) =>
  instance({
    url: '/friend-groups/update',
    method: 'post',
    params: { groupId, groupName },
  })

/**
 * 删除分组
 * @param {number} groupId - 分组ID
 * @returns {Promise} - 返回删除分组请求的Promise对象
 */
export const deleteFriendGroup = (groupId) =>
  instance({
    url: '/friend-groups/delete',
    method: 'delete',
    params: { groupId },
  })

/**
 * 获取分组列表
 * @returns {Promise} - 返回获取分组列表请求的Promise对象
 */
export const getFriendGroupList = () =>
  instance({
    url: '/friend-groups/list',
    method: 'get',
  })

export const getFriendGroupFriendList = (groupId) =>
  instance({
    url: '/friend-groups/friendList',
    method: 'get',
    params: {
      groupId,
    },
  })
