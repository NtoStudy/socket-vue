<script setup>
import { onMounted, ref } from 'vue'
import { friendMessageCount, getFriendList, messageHistory } from '@/api/friend/index.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'

const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const friendChats = ref([])

/**
 * 格式化消息发送时间
 * @param {number} sentTime - 消息发送时间戳
 * @returns {string} 格式化后的时间字符串
 */
const formatSentTime = (sentTime) => {
  const now = new Date()
  const sentDate = new Date(sentTime)
  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  if (now - sentDate < oneDay) {
    // 如果在24小时之内，只显示时分秒
    return sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } else if (sentDate.getFullYear() === now.getFullYear()) {
    // 如果在今年之内，只显示月份和日期
    return sentDate.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
  } else {
    // 如果不是今年，则显示年月日
    return sentDate.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
  }
}

/**
 * 处理好友列表，获取未读消息数和最近的消息
 */
const handleFriendList = async () => {
  const res = await getFriendList()
  if (res.data.code === 200) {
    chatFriendOrChatRoom.setFriendId(res.data.data[0].friendId)
    friendChats.value = res.data.data
    const updatedFriendList = await Promise.allSettled(
      friendChats.value.map(async (friend) => {
        try {
          const CountRes = await friendMessageCount(friend.relationId)
          return {
            ...friend,
            count: CountRes.data.data,
          }
        } catch (error) {
          console.log(error)
          return { ...friend, count: 0 } // 默认值为 0
        }
      }),
    )
    const finalFriendList = updatedFriendList.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return { ...result.value, count: 0 } // 默认值为 0
      }
    })

    const messageHistoryPromises = finalFriendList.map(async (friend) => {
      try {
        const historyRes = await messageHistory(friend.friendId, 1, 100)
        const messages = historyRes.data.data.list
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]

          // 格式化发送时间
          const formattedSentTime = formatSentTime(lastMessage.sentTime)

          // 处理content的长度限制
          let displayedContent = null

          if (lastMessage.messageType === 'text') {
            displayedContent = lastMessage.content ? truncateContent(lastMessage.content) : null
          } else if (lastMessage.messageType === 'image') {
            displayedContent = '[图片]'
          }
          return {
            ...friend,
            sentTime: formattedSentTime,
            content: displayedContent,
          }
        } else {
          return { ...friend, sentTime: null, content: null } // 默认值为 null
        }
      } catch (error) {
        console.log(error)
        return { ...friend, sentTime: null, content: null } // 默认值为 null
      }
    })

    function truncateContent(content) {
      if (content) {
        const maxLength = 10
        return content.length > maxLength ? content.slice(0, maxLength) + '...' : content
      }
      return content
    }

    const finalFriendListWithMessages = await Promise.allSettled(messageHistoryPromises)
    const finalFriendListProcessed = finalFriendListWithMessages.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return { ...result.value, messages: [] } // 默认值为空数组
      }
    })

    chatFriendOrChatRoom.setFriendId(finalFriendListProcessed[0].friendId)
    friendChats.value = finalFriendListProcessed
  }
}

/**
 * 处理聊天消息，更新选中的好友ID
 * @param {number} friendId - 好友ID
 */
const handleChatMessage = (friendId) => {
  chatFriendOrChatRoom.setFriendId(friendId) // 更新 Pinia 状态
}

onMounted(() => {
  handleFriendList()
})
</script>

<template>
  <div class="chat-item" v-for="(chat, index) in friendChats" :key="index" @click="handleChatMessage(chat.friendId)">
    <div class="chat-avatar">
      <img :src="chat.avatarUrl" alt="avatar" />
    </div>
    <div class="chat-content">
      <div class="chat-header">
        <span class="chat-title">{{ chat.username }}</span>
        <span class="chat-time">{{ chat.sentTime }}</span>
      </div>
      <div class="chat-message">
        <span class="chat-text">{{ chat.content }}</span>
      </div>
    </div>
    <div class="chat-badge" v-if="chat.count > 0">{{ chat.count }}</div>
  </div>
</template>

<style lang="scss" scoped>
.chat-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .chat-avatar {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
    }
  }

  .chat-content {
    flex: 1;

    .chat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;

      .chat-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .chat-time {
        font-size: 12px;
        color: #666;
      }
    }

    .chat-message {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;

      .chat-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
        font-size: 14px;
        color: #989898;
      }
    }
  }

  .chat-badge {
    width: 18px;
    height: 18px;
    background-color: #ff4d4d;
    color: #fff;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }
}
</style>
