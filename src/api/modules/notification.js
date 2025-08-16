import instance from '@/api/https.js'

// 获取所有未处理的好友请求接口
export const getHandleFriend = () =>
  instance({
    url: '/notifications/friend',
    method: 'get',
  })

// 获取未处理好友请求的数量接口
export const friendNumber = () =>
  instance({
    url: '/notifications/friend',
    method: 'post',
  })

// 获取用户的所有群聊通知接口
export const handleChatRoom = () =>
  instance({
    url: '/notifications/chatroom',
    method: 'get',
  })

// 获取未处理群聊邀请的数量接口
export const chatRoomNumber = () =>
  instance({
    url: '/notifications/chatroom',
    method: 'post',
  })
