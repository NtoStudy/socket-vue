import instance from '@/api/index.js'

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
