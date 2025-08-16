import instance from '@/api/https.js'

// 修改群聊名称
export const changeChatRoomName = (roomId, groupName) =>
  instance({
    url: '/chat-rooms/changeGroupName',
    method: 'put',
    params: { roomId, groupName },
  })
// 修改用户在群聊中的昵称
export const updateChatRoomNickname = (nickname, roomId) =>
  instance({
    url: '/chat-rooms/nickname',
    method: 'put',
    params: { nickname, roomId },
  })
// 获取用户置顶的群聊列表
export const chatRoomsPinnedGroup = () =>
  instance({
    url: '/chat-rooms/pinnedGroup',
    method: 'get',
  })

// 设置或取消群聊置顶状态
export const setChatRoomPinned = (roomId, status) =>
  instance({
    url: '/chat-rooms/pinnedGroup',
    method: 'post',
    params: { roomId, status },
  })

// 申请加入指定群聊
export const groupAddChatRoom = (groupNumber) =>
  instance({
    url: '/chat-rooms/addgroup',
    method: 'post',
    params: { groupNumber },
  })
// 接受或拒绝群聊邀请
export const chatRoomHandle = (roomId, status) =>
  instance({
    url: '/chat-rooms/accept',
    method: 'put',
    params: { roomId, status },
  })
// 退出或者解散群聊
export const quitOrDismissChatRoom = (roomId) =>
  instance({
    url: '/chat-rooms/quit',
    method: 'put',
    params: { roomId },
  })
// 查看入群申请列表
export const getChatRoomApplyList = () =>
  instance({
    url: '/chat-rooms/applyList',
    method: 'get',
  })

// 审批入群申请
export const approveChatRoomApplication = (userId, roomId, status) =>
  instance({
    url: '/chat-rooms/approveApplication',
    method: 'post',
    params: { userId, roomId, status },
  })
