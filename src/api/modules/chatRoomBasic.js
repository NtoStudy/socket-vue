import instance from '@/api/https.js'

// 创建新的群聊
export const chatRoomCreate = (roomName, userIds) =>
  instance({
    url: '/chat-rooms/create',
    method: 'post',
    params: { roomName, userIds },
  })

// 通过群号查询群聊信息
export const chatRoomInquire = (groupNumber) =>
  instance({
    url: '/chat-rooms/inquire',
    method: 'get',
    params: { groupNumber },
  })

// 通过ID查询群聊详情
export const chatRoomInfoById = (roomId) =>
  instance({
    url: '/chat-rooms/getById',
    method: 'get',
    params: { roomId },
  })

// 获取用户加入的所有群聊
export const chatRoomList = () =>
  instance({
    url: '/chat-rooms/roomlist',
    method: 'get',
  })

// 获取用户创建的群聊列表
export const chatRoomsCreateGroup = () =>
  instance({
    url: '/chat-rooms/createGroup',
    method: 'get',
  })

// 获取用户管理的群聊列表
export const chatRoomsManageGroup = () =>
  instance({
    url: '/chat-rooms/manageGroup',
    method: 'get',
  })

// 获取用户加入的群聊列表
export const chatRoomsJoinGroup = () =>
  instance({
    url: '/chat-rooms/joinGroup',
    method: 'get',
  })
