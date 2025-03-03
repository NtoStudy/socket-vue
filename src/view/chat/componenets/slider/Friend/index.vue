<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { friendMessageCount, getFriendList, messageHistory } from '@/api/friend.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { formatSentTime, truncateContent } from '@/view/chat/utils/messageUtils.js'
import eventBus from '@/EventBus/eventBus.js'

const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const friendChats = ref([])

/**
 * 处理好友列表，获取未读消息数和最近的消息
 */
const handleFriendList = async () => {
  const res = await getFriendList()
  if (res.data.code === 200) {
    chatFriendOrChatRoom.setFriendId(res.data.data[0].friendId)
    friendChats.value = res.data.data

    // 获取未读消息数
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

    // 获取最近消息
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
            displayedContent = truncateContent(lastMessage.content)
          } else if (lastMessage.messageType === 'image') {
            displayedContent = '[图片]'
          } else if (lastMessage.messageType === 'video') {
            displayedContent = '[视频]'
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
  eventBus.on('call-handleFriendList', handleFriendList)
})

onUnmounted(() => {
  // 移除事件监听，避免内存泄漏
  eventBus.off('call-handleFriendList', handleFriendList)
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
