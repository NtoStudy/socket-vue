<script setup>
import { onMounted, ref } from 'vue'
import { chatRoomHistory, chatRoomList, groupMessageCount } from '@/api/chatRoom.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { formatSentTime, truncateContent } from '@/view/chat/utils/messageUtils.js'

const friendOrChatRoomStore = chatFriendOrChatRoomStore()
const groupChats = ref([])

/**
 * 处理群聊列表，获取未读消息数和最近的消息
 */
const handleChatRoomList = async () => {
  const res = await chatRoomList()
  if (res.data.code === 200) {
    groupChats.value = res.data.data
    friendOrChatRoomStore.setChatRoomId(res.data.data[0].roomId)

    // 获取未读消息数
    const updatedGroupList = await Promise.allSettled(
      groupChats.value.map(async (group) => {
        try {
          const CountRes = await groupMessageCount(group.roomId)
          return {
            ...group,
            count: CountRes.data.data,
          }
        } catch (error) {
          console.log(error)
          return { ...group, count: 0 }
        }
      }),
    )
    const finalGroupList = updatedGroupList.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return { ...result.value, count: 0 } // 默认值为 0
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
            content: displayedContent,
          }
        } else {
          return { ...group, sentTime: null, content: null } // 默认值为 null
        }
      } catch (error) {
        console.log(error)
        return { ...group, sentTime: null, content: null } // 默认值为 null
      }
    })

    const finalGroupListWithMessages = await Promise.allSettled(messageHistoryPromises)
    groupChats.value = finalGroupListWithMessages.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return { ...result.value, messages: [] } // 默认值为空数组
      }
    })
  }
}

/**
 * 处理聊天消息，更新选中的群聊ID
 * @param {number} roomId - 群聊ID
 */
const handleChatRoomMessage = (roomId) => {
  friendOrChatRoomStore.setChatRoomId(roomId) // 更新 Pinia 状态
}

onMounted(() => {
  handleChatRoomList()
})
</script>

<template>
  <div class="chat-item" v-for="(chat, index) in groupChats" :key="index" @click="handleChatRoomMessage(chat.roomId)">
    <div class="chat-avatar">
      <img :src="chat.avatarUrl" alt="avatar" />
    </div>
    <div class="chat-content">
      <div class="chat-header">
        <span class="chat-title">{{ chat.roomName }}</span>
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
  margin-bottom: 10px;
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
        font-size: 14px;
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
