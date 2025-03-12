<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { friendMessageCount, getFriendList, messageHistory } from '@/api/friend.js'
import { chatRoomHistory, chatRoomList, groupMessageCount } from '@/api/chatRoom.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { formatSentTime, truncateContent } from '@/utils/messageUtils.js'
import eventBus from '@/EventBus/eventBus.js'

const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const allChats = ref([])

// 判断聊天项是否被选中
const isActive = (chat) => {
  if (chat.chatType === 'friend') {
    return chatFriendOrChatRoom.friendId === chat.friendId && chatFriendOrChatRoom.chatRoomId === null
  } else {
    return chatFriendOrChatRoom.chatRoomId === chat.roomId && chatFriendOrChatRoom.friendId === null
  }
}

/**
 * 处理好友列表数据
 */
const handleFriendList = async () => {
  const res = await getFriendList()
  if (res.data.code === 200) {
    const friendData = res.data.data

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
          let displayedContent = null

          if (lastMessage.messageType === 'text') {
            displayedContent = truncateContent(lastMessage.content)
          } else if (lastMessage.messageType === 'image') {
            displayedContent = '[图片]'
          } else if (lastMessage.messageType === 'video') {
            displayedContent = '[视频]'
          }

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
  return []
}

/**
 * 处理群聊列表数据
 */
const handleChatRoomList = async () => {
  const res = await chatRoomList()
  if (res.data.code === 200) {
    const groupData = res.data.data

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
          let displayedContent = null

          if (lastMessage.messageType === 'text') {
            displayedContent = truncateContent(lastMessage.content)
          } else if (lastMessage.messageType === 'image') {
            displayedContent = '[图片]'
          } else if (lastMessage.messageType === 'video') {
            displayedContent = '[视频]'
          }

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
  return []
}

/**
 * 合并并加载所有聊天数据
 */
const loadAllChats = async () => {
  try {
    // 获取好友和群聊数据
    const friendResults = await handleFriendList()
    const groupResults = await handleChatRoomList()

    // 合并数据
    const friendChats = friendResults
      .map((result) => (result.status === 'fulfilled' ? result.value : null))
      .filter((item) => item !== null)

    const groupChats = groupResults
      .map((result) => (result.status === 'fulfilled' ? result.value : null))
      .filter((item) => item !== null)

    // 合并并按时间戳排序
    const combinedChats = [...friendChats, ...groupChats].sort((a, b) => {
      return (b.timestamp || 0) - (a.timestamp || 0)
    })

    allChats.value = combinedChats

    // 如果有聊天记录，默认选中第一个
    if (combinedChats.length > 0) {
      const firstChat = combinedChats[0]
      if (firstChat.chatType === 'friend') {
        chatFriendOrChatRoom.setFriendId(firstChat.friendId)
        chatFriendOrChatRoom.setChatRoomId(null) // 清除群聊选中状态
      } else {
        chatFriendOrChatRoom.setChatRoomId(firstChat.roomId)
        chatFriendOrChatRoom.setFriendId(null) // 清除好友选中状态
      }
    }
  } catch (error) {
    console.error('加载聊天列表失败:', error)
  }
}

/**
 * 处理聊天项点击
 */
const handleChatItemClick = (chat) => {
  if (chat.chatType === 'friend') {
    chatFriendOrChatRoom.setFriendId(chat.friendId)
    chatFriendOrChatRoom.setChatRoomId(null) // 清除群聊选中状态
  } else {
    chatFriendOrChatRoom.setChatRoomId(chat.roomId)
    chatFriendOrChatRoom.setFriendId(null) // 清除好友选中状态
  }
}

onMounted(() => {
  loadAllChats()
  eventBus.on('call-handleFriendList', loadAllChats)
})

onUnmounted(() => {
  eventBus.off('call-handleFriendList', loadAllChats)
})
</script>

<template>
  <div class="chat-list">
    <div
      class="chat-item"
      v-for="(chat, index) in allChats"
      :key="index"
      @click="handleChatItemClick(chat)"
      :class="{ active: isActive(chat) }"
    >
      <div class="chat-avatar">
        <img :src="chat.avatarUrl" alt="avatar" />
        <div class="chat-type-badge" :class="{ friend: chat.chatType === 'friend', group: chat.chatType === 'group' }">
          {{ chat.chatType === 'friend' ? 'F' : 'G' }}
        </div>
      </div>
      <div class="chat-content">
        <div class="chat-header">
          <span class="chat-title">{{ chat.chatType === 'friend' ? chat.username : chat.roomName }}</span>
          <span class="chat-time">{{ chat.sentTime }}</span>
        </div>
        <div class="chat-message">
          <span class="chat-text">{{ chat.content }}</span>
        </div>
      </div>
      <div class="chat-badge" v-if="chat.count > 0">{{ chat.count }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fafafa; // 默认背景色，比选中状态白一点
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #f2f2f2; // 悬浮状态背景色
  }

  &.active {
    background-color: #ebebeb; // 选中状态背景色
  }

  .chat-avatar {
    position: relative;
    margin-right: 12px;
    background-color: #52c41a;
    border-radius: 6px;

    img {
      width: 45px;
      height: 45px;
      border-radius: 4px; // 方形带微弱圆角
      object-fit: cover;
    }

    .chat-type-badge {
      position: absolute;
      bottom: -3px;
      right: -3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: bold;
      border: 1px solid #fff;

      &.friend {
        background-color: #1890ff;
        color: #fff;
      }

      &.group {
        background-color: #52c41a;
        color: #fff;
      }
    }
  }

  .chat-content {
    flex: 1;
    min-width: 0; // 确保文本可以正确截断
    overflow: hidden;

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      .chat-title {
        font-size: 16px;
        font-weight: 400;
        color: #000;
        margin-right: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
      }

      .chat-time {
        font-size: 12px;
        color: #b2b2b2;
        flex-shrink: 0;
      }
    }

    .chat-message {
      font-size: 13px;
      color: #888;
      margin-bottom: 0;

      .chat-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
    }
  }

  .chat-badge {
    min-width: 16px;
    height: 16px;
    padding: 0 5px;
    background-color: #ff4d4d;
    color: #fff;
    border-radius: 8px;
    font-size: 11px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
  }
}
</style>
