<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { chatRoomList, getFriendList } from '@/api/index.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import eventBus from '@/EventBus/eventBus.js'
import {
  processFriendList,
  processChatRoomList,
  combineAndSortChats,
  isActive,
  isCurrentSelected,
} from '@/utils/ChatListUtils.js'
import router from '@/router/index.js'
import { useRoute } from 'vue-router'
const route = useRoute()
// 状态管理
const chatFriendOrChatRoom = chatFriendOrChatRoomStore()
const allChats = ref([])

/**
 * 处理好友列表数据
 * @returns {Promise<Array>} - 处理后的好友列表
 */
const handleFriendList = async () => {
  const res = await getFriendList()
  if (res.data.code === 200) {
    return await processFriendList(res.data.data)
  }
  return []
}

/**
 * 处理群聊列表数据
 * @returns {Promise<Array>} - 处理后的群聊列表
 */
const handleChatRoomList = async () => {
  const res = await chatRoomList()
  if (res.data.code === 200) {
    return await processChatRoomList(res.data.data)
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

    // 使用工具函数合并和排序聊天
    allChats.value = combineAndSortChats(friendResults, groupResults)
  } catch (error) {
    console.error('加载聊天列表失败:', error)
  }
}

/**
 * 处理聊天项点击
 * @param {Object} chat - 被点击的聊天项
 */
const handleChatItemClick = (chat) => {
  if (chat.chatType === 'friend') {
    chatFriendOrChatRoom.setFriendId(chat.friendId)
    chatFriendOrChatRoom.setChatRoomId(null) // 清除群聊选中状态
    router.push({
      path: `/main/chat/${chat.friendId}`,
      query: { fid: chat.friendId },
    })
  } else {
    chatFriendOrChatRoom.setChatRoomId(chat.roomId)
    chatFriendOrChatRoom.setFriendId(null)
    router.push({
      path: `/main/chat/${chat.roomId}`,
      query: { gid: chat.roomId },
    })
  }
}

// ===== 生命周期钩子 =====

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
      :class="{
        active: isActive(chat, chatFriendOrChatRoom),
        pinned: chat.isPinned === 1,
        selected: isCurrentSelected(chat, route),
      }"
    >
      <div class="chat-avatar">
        <img :src="chat.avatarUrl" alt="avatar" />
        <div class="chat-type-badge" :class="{ friend: chat.chatType === 'friend', group: chat.chatType === 'group' }">
          {{ chat.chatType === 'friend' ? 'F' : 'G' }}
        </div>
      </div>
      <div class="chat-content">
        <div class="chat-header">
          <span class="chat-title">
            {{ chat.chatType === 'friend' ? chat.username : chat.roomName }}
          </span>
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

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  &.pinned {
    background-color: #f0f7ff;

    &:hover {
      background-color: #e6f1ff;
    }

    &.active {
      background-color: #d9ebff;
    }
  }

  &:hover {
    background-color: #f2f2f2;
  }

  &.active {
    background-color: #ebebeb;
  }
  &.selected {
    background-color: #0099ff !important;
    color: white;

    .chat-title {
      color: white !important;
    }

    .chat-time,
    .chat-text {
      color: rgba(255, 255, 255, 0.8) !important;
    }
  }

  .chat-avatar {
    position: relative;
    margin-right: 12px;
    flex-shrink: 0;

    img {
      width: 45px;
      height: 45px;
      border-radius: 4px;
      object-fit: cover;
      background-color: #f0f0f0;
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
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

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
    min-width: 0;
    overflow: hidden;

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      .chat-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-right: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;

        .pin-icon {
          font-size: 12px;
          color: #1890ff;
          margin-right: 4px;
        }
      }

      .chat-time {
        font-size: 12px;
        color: #999;
        white-space: nowrap;
      }
    }

    .chat-message {
      display: flex;
      align-items: center;

      .chat-text {
        font-size: 13px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }
  }

  .chat-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    background-color: #ff4d4f;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    transform: scale(0.9);
  }
}
</style>
