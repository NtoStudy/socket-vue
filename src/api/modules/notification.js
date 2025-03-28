import instance from '@/api/index.js'

/**
 * 获取所有未处理的好友请求接口
 * @returns {Promise} - 返回包含未处理好友请求列表的Promise对象
 */
export const handleFriend = () =>
  instance({
    url: '/notifications/friend',
    method: 'get',
  })

/**
 * 获取未处理好友请求的数量接口
 * @returns {Promise} - 返回包含未处理好友请求数量的Promise对象
 */
export const friendNumber = () =>
  instance({
    url: '/notifications/friend',
    method: 'post',
  })

/**
 * 获取用户的所有群聊通知接口
 * @returns {Promise} - 返回包含群聊通知列表的Promise对象
 */
export const handleChatRoom = () =>
  instance({
    url: '/notifications/chatroom',
    method: 'get',
  })

/**
 * 获取未处理群聊邀请的数量接口
 * @returns {Promise} - 返回包含未处理群聊邀请数量的Promise对象
 */
export const chatRoomNumber = () =>
  instance({
    url: '/notifications/chatroom',
    method: 'post',
  })
