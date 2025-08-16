import instance from '@/api/https.js'

// 添加好友接口
export const addFriend = (friendNumber) =>
  instance({
    url: '/friends/add',
    method: 'post',
    params: { friendNumber }, // 使用data传递请求体数据
  })

// 获取当前用户的好友列表接口
export const getFriendList = () =>
  instance({
    url: '/friends/friendlist',
    method: 'get',
  })

// 处理好友请求接口
export const handleFriend = (relationId, status) =>
  instance({
    url: '/friends/accept',
    method: 'put',
    params: { relationId, status }, // 使用data传递请求体数据
  })

// 获取与指定好友的未读消息数量接口
export const friendMessageCount = (relationId) =>
  instance({
    url: '/friends/messageCount',
    method: 'get',
    params: { relationId },
  })

// 设置好友的备注名称接口
export const postFriendsRemark = (friendId, remark) =>
  instance({
    url: '/friends/remark',
    method: 'post',
    params: { friendId, remark }, // 使用data传递请求体数据
  })

// 设置或取消好友置顶状态接口
export const postFriendPin = (friendId, status) =>
  instance({
    url: '/friends/togglePin',
    method: 'put',
    params: { friendId, status }, // 使用data传递请求体数据
  })

// 获取消息历史
export const messageHistory = (receiverId, pageNum, pageSize) =>
  instance({
    url: '/messages/history',
    method: 'get',
    params: { receiverId, pageNum, pageSize },
  })

// 删除消息
export const messageDelete = (messageId) =>
  instance({
    url: '/messages/delete',
    method: 'delete',
    params: { messageId },
  })
