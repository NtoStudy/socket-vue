<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { chatRoomHistory, chatRoomList, chatRoomUser, groupMessageCount } from '@/api/ChatRoom/index.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'

const friendOrChatRoomStore = chatFriendOrChatRoomStore()

const groupChats = ref([])
const handleChatRoomList = async () => {
  const res = await chatRoomList()
  if (res.data.code === 200) {
    groupChats.value = res.data.data
    friendOrChatRoomStore.setChatRoomId(res.data.data[0].roomId)
    // 增添未读消息的显示
    const updatedGroupList = await Promise.allSettled(
      groupChats.value.map(async (group) => {
        try {
          // 假设有一个获取群组未读消息的方法
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
    // 处理每个结果
    const finalGroupList = updatedGroupList.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return { ...result.value, count: 0 } // 默认值为 0
      }
    })
    // 获取每个群组的消息历史
    const messageHistoryPromises = finalGroupList.map(async (group) => {
      try {
        // 假设有一个获取群组消息历史的方法
        const historyRes = await chatRoomHistory(group.roomId, 1, 100)
        const messages = historyRes.data.data.list
        if (messages.length > 0) {
          const formattedSentTime = formatSentTime(messages[messages.length - 1].sentTime)
          return {
            ...group,
            sentTime: formattedSentTime,
            content: messages[messages.length - 1].content,
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
    // 更新最终的群组聊天状态
    groupChats.value = finalGroupListWithMessages.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return { ...result.value, messages: [] } // 默认值为空数组
      }
    })
    await handleChatRoomMessage(groupChats.value[0].roomId)
  }
}
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
//TODO区分发送者列表
const handleChatRoomMessage = async (roomId) => {
  friendOrChatRoomStore.setChatRoomId(roomId) // 更新 Pinia 状态
  const promise = await chatRoomUser(roomId)
  console.log(promise.data, 'promise')
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
