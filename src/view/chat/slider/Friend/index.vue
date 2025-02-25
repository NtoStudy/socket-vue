<script setup>
import { onMounted, ref } from 'vue'
import { friendMessageCount, getFriendList } from '@/api/friend/index.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const friendChats = ref([])

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
          return { ...friend, count: 0 } // 默认值为 0
        }
      }),
    )
    // 处理每个结果
    const finalFriendList = updatedFriendList.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return { ...result.value, count: 0 } // 默认值为 0
      }
    })
    chatFriendOrChatRoom.setFriendId(finalFriendList[0].friendId)
    friendChats.value = finalFriendList
  }
}

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
        <span class="chat-time">{{ chat.time }}</span>
      </div>
      <div class="chat-message">
        <span class="chat-text">{{ chat.message }}</span>
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
