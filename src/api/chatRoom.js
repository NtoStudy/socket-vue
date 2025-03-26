import instance from '@/api/index.js'

/**
 * 创建新的群聊
 * @param {string} roomName - 群聊名称
 * @param {number[]} userIds - 用户ID数组（可选，初始成员）
 * @returns {Promise} - 返回创建群聊请求的Promise对象，包含群号
 */
export const chatRoomCreate = (roomName, userIds) =>
  instance({
    url: '/chat-rooms/create',
    method: 'post',
    data: { roomName, userIds },
  })

/**
 * 通过群号查询群聊信息
 * @param {string} groupNumber - 群号
 * @returns {Promise} - 返回查询群聊信息请求的Promise对象，包含群聊信息及用户是否在群中
 */
export const chatRoomInquire = (groupNumber) =>
  instance({
    url: '/chat-rooms/inquire',
    method: 'get',
    params: { groupNumber },
  })

/**
 * 通过ID查询群聊详情
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回查询群聊详情请求的Promise对象
 */
export const chatRoomInfoById = (roomId) =>
  instance({
    url: '/chat-rooms/getById',
    method: 'get',
    params: { roomId },
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
 * 获取用户加入的所有群聊
 * @returns {Promise} - 返回获取用户群聊列表请求的Promise对象
 */
export const chatRoomList = () =>
  instance({
    url: '/chat-rooms/roomlist',
    method: 'get',
  })

/**
 * 获取群聊的所有成员ID
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回获取群聊成员ID请求的Promise对象
 */
export const chatRoomUser = (roomId) =>
  instance({
    url: '/chat-rooms/roomUsers',
    method: 'get',
    params: { roomId },
  })

/**
 * 获取群聊中的未读消息数量
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回获取未读消息数量请求的Promise对象
 */
export const groupMessageCount = (roomId) =>
  instance({
    url: '/chat-rooms/messageCount',
    method: 'get',
    params: { roomId },
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
 * 获取用户创建的群聊列表
 * @returns {Promise} - 返回获取创建的群聊列表请求的Promise对象
 */
export const chatRoomsCreateGroup = () =>
  instance({
    url: '/chat-rooms/createGroup',
    method: 'get',
  })

/**
 * 获取用户管理的群聊列表
 * @returns {Promise} - 返回获取管理的群聊列表请求的Promise对象
 */
export const chatRoomsManageGroup = () =>
  instance({
    url: '/chat-rooms/manageGroup',
    method: 'get',
  })

/**
 * 获取用户加入的群聊列表
 * @returns {Promise} - 返回获取加入的群聊列表请求的Promise对象
 */
export const chatRoomsJoinGroup = () =>
  instance({
    url: '/chat-rooms/joinGroup',
    method: 'get',
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
 * 邀请好友加入群聊
 * @param {number[]} friendIds - 好友ID数组
 * @param {number} roomId - 群聊ID
 * @returns {Promise} - 返回邀请好友加入群聊请求的Promise对象
 */
export const inviteToChatRoom = (friendIds, roomId) =>
  instance({
    url: '/chat-rooms/invite',
    method: 'post',
    data: { friendIds, roomId },
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
 * 踢出群成员
 * @param {number} roomId - 群聊ID
 * @param {number[]} userIds - 要踢出的用户ID数组
 * @returns {Promise} - 返回踢出群成员请求的Promise对象
 */
export const kickOutChatRoomUsers = (roomId, userIds) =>
  instance({
    url: '/chat-rooms/kickOut',
    method: 'put',
    params: { roomId },
    data: userIds,
  })

/**
 * 设置管理员
 * @param {number} roomId - 群聊ID
 * @param {number} userId - 用户ID
 * @param {number} status - 状态（1: 设置，2: 取消）
 * @returns {Promise} - 返回设置管理员请求的Promise对象
 */
export const setChatRoomAdmin = (roomId, userId, status) =>
  instance({
    url: '/chat-rooms/setAdmin',
    method: 'post',
    params: { roomId, userId, status },
  })

/**
 * 转让群主
 * @param {number} roomId - 群聊ID
 * @param {number} userId - 新群主ID
 * @returns {Promise} - 返回转让群主请求的Promise对象
 */
export const transferChatRoomOwner = (roomId, userId) =>
  instance({
    url: '/chat-rooms/transferOwner',
    method: 'post',
    params: { roomId, userId },
  })

/**
 * 查看入群申请列表
 * @returns {Promise} - 返回获取入群申请列表请求的Promise对象
 */
export const getChatRoomApplyList = () =>
  instance({
    url: '/chat-rooms/applyList',
    method: 'get',
  })

/**
 * 审批入群申请
 * @param {number} userId - 申请用户ID
 * @param {number} roomId - 群聊ID
 * @param {number} status - 审批状态（1: 同意，2: 拒绝）
 * @returns {Promise} - 返回审批入群申请请求的Promise对象
 */
export const approveChatRoomApplication = (userId, roomId, status) =>
  instance({
    url: '/chat-rooms/approveApplication',
    method: 'post',
    params: { userId, roomId, status },
  })
