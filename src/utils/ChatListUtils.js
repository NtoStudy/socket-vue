import { formatSentTime, truncateContent } from '@/utils/messageUtils.js'
import { chatRoomHistory, groupMessageCount, friendMessageCount, messageHistory } from '@/api/modules'

/**
 * 判断聊天项是否被选中
 * @param {Object} chat - 聊天项对象
 * @param {Object} chatStore - 聊天状态存储
 * @returns {Boolean} - 是否被选中
 */
export const isActive = (chat, chatStore) => {
  if (chat.chatType === 'friend') {
    return chatStore.friendId === chat.friendId && chatStore.chatRoomId === null
  } else {
    return chatStore.chatRoomId === chat.roomId && chatStore.friendId === null
  }
}

/**
 * 格式化消息内容
 * @param {Object} message - 消息对象
 * @returns {String} - 格式化后的内容
 */
export const formatMessageContent = (message) => {
  if (message.messageType === 'text') {
    return truncateContent(message.content)
  } else if (message.messageType === 'image') {
    return '[图片]'
  } else if (message.messageType === 'video') {
    return '[视频]'
  }
  return null
}

/**
 * 处理好友列表数据
 * @param {Array} friendData - 原始好友数据
 * @returns {Promise<Array>} - 处理后的好友列表
 */
export const processFriendList = async (friendData) => {
  if (!friendData || !friendData.length) return []

  // 获取未读消息数
  const updatedFriendList = await Promise.allSettled(
    friendData.map(async (friend) => {
      try {
        const CountRes = await friendMessageCount(friend.relationId)
        return {
          ...friend,
          count: CountRes.data.data,
          chatType: 'friend', // 添加类型标识
        }
      } catch (error) {
        console.log(error)
        return { ...friend, count: 0, chatType: 'friend' }
      }
    }),
  )

  const finalFriendList = updatedFriendList.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return { ...result.value, count: 0 }
    }
  })

  // 获取最近消息
  const messageHistoryPromises = finalFriendList.map(async (friend) => {
    try {
      const historyRes = await messageHistory(friend.friendId, 1, 100)
      const messages = historyRes.data.data.list
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        // 格式化发送时间
        const formattedSentTime = formatSentTime(lastMessage.sentTime)
        const timestamp = new Date(lastMessage.sentTime).getTime() // 用于排序的时间戳

        // 处理content的长度限制
        const displayedContent = formatMessageContent(lastMessage)

        return {
          ...friend,
          sentTime: formattedSentTime,
          timestamp: timestamp,
          content: displayedContent,
        }
      } else {
        return { ...friend, sentTime: null, content: null, timestamp: 0 }
      }
    } catch (error) {
      console.log(error)
      return { ...friend, sentTime: null, content: null, timestamp: 0 }
    }
  })

  return await Promise.allSettled(messageHistoryPromises)
}

/**
 * 处理群聊列表数据
 * @param {Array} groupData - 原始群聊数据
 * @returns {Promise<Array>} - 处理后的群聊列表
 */
export const processChatRoomList = async (groupData) => {
  if (!groupData || !groupData.length) return []

  // 获取未读消息数
  const updatedGroupList = await Promise.allSettled(
    groupData.map(async (group) => {
      try {
        const CountRes = await groupMessageCount(group.roomId)
        return {
          ...group,
          count: CountRes.data.data,
          chatType: 'group', // 添加类型标识
        }
      } catch (error) {
        console.log(error)
        return { ...group, count: 0, chatType: 'group' }
      }
    }),
  )

  const finalGroupList = updatedGroupList.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return { ...result.value, count: 0 }
    }
  })

  // 获取最近消息
  const messageHistoryPromises = finalGroupList.map(async (group) => {
    try {
      const historyRes = await chatRoomHistory(group.roomId, 1, 100)
      const messages = historyRes.data.data.list
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        // 格式化发送时间
        const formattedSentTime = formatSentTime(lastMessage.sentTime)
        const timestamp = new Date(lastMessage.sentTime).getTime() // 用于排序的时间戳

        // 处理content的长度限制
        const displayedContent = formatMessageContent(lastMessage)

        return {
          ...group,
          sentTime: formattedSentTime,
          timestamp: timestamp,
          content: displayedContent,
        }
      } else {
        return { ...group, sentTime: null, content: null, timestamp: 0 }
      }
    } catch (error) {
      console.log(error)
      return { ...group, sentTime: null, content: null, timestamp: 0 }
    }
  })

  return await Promise.allSettled(messageHistoryPromises)
}

/**
 * 合并并排序聊天数据
 * @param {Array} friendResults - 好友结果数组
 * @param {Array} groupResults - 群聊结果数组
 * @returns {Array} - 排序后的聊天列表
 */
export const combineAndSortChats = (friendResults, groupResults) => {
  // 合并数据
  const friendChats = friendResults
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter((item) => item !== null)

  const groupChats = groupResults
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter((item) => item !== null)

  // 合并所有聊天
  const combinedChats = [...friendChats, ...groupChats]

  // 修改排序逻辑：先按置顶状态排序，再按时间戳排序
  combinedChats.sort((a, b) => {
    // 首先比较置顶状态
    const aPinned = a.isPinned === 1
    const bPinned = b.isPinned === 1

    if (aPinned && !bPinned) {
      return -1 // a置顶，b不置顶，a排在前面
    }

    if (!aPinned && bPinned) {
      return 1 // a不置顶，b置顶，b排在前面
    }

    // 如果置顶状态相同，则按时间戳排序
    return (b.timestamp || 0) - (a.timestamp || 0)
  })

  return combinedChats
}
