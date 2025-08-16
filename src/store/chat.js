import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { postFriendPin, getUsersInfoById, chatRoomInfoById, setChatRoomPinned } from '@/api/index.js'

export const chatFriendOrChatRoomStore = defineStore(
  'chatFriendOrChatRoom',
  () => {
    // 基本聊天状态
    const friendId = ref()
    const chatRoomId = ref()

    // 好友信息相关状态
    const friendInfo = ref({})
    const isTop = ref(false)
    const groupInfo = ref({})
    const isGroupTop = ref(false)

    // 设置好友ID
    const setFriendId = (newFriendId) => {
      friendId.value = newFriendId
      // 如果设置了新的好友ID，自动获取好友信息
      if (newFriendId) {
        getFriendInfo(newFriendId)
      } else {
        // 清空好友信息
        friendInfo.value = {}
        isTop.value = false
      }
    }

    // 设置聊天室ID
    const setChatRoomId = (newChatRoomId) => {
      // 如果是同一个聊天室，不做任何操作
      if (chatRoomId.value === newChatRoomId) return

      chatRoomId.value = newChatRoomId
      // 如果设置了新的聊天室ID，清空好友信息
      if (newChatRoomId) {
        getGroupInfo(newChatRoomId)
        friendInfo.value = {}
        isTop.value = false
      }
    }

    // 获取好友信息
    const getFriendInfo = async (id) => {
      if (!id) {
        return
      }

      try {
        const res = await getUsersInfoById(id)
        if (res.data.code === 200) {
          friendInfo.value = res.data.data
          isTop.value = res.data.data.isPinned === 1
        }
      } catch (error) {
        console.error('获取好友信息失败:', error)
        ElMessage.error('获取好友信息失败')
      }
    }

    const getGroupInfo = async (roomId) => {
      if (!roomId) {
        console.log('没有有效的 groupId')
        return
      }

      try {
        const res = await chatRoomInfoById(roomId)
        if (res.data.code === 200) {
          groupInfo.value = res.data.data
          isGroupTop.value = res.data.data.isPinned === 1
        }
      } catch (error) {
        console.error('获取好友信息失败:', error)
        ElMessage.error('获取好友信息失败')
      }
    }

    // 更新好友置顶状态
    const updateTopStatus = async (value) => {
      if (!friendId.value) return false

      try {
        const status = value ? 1 : 0
        const res = await postFriendPin(friendId.value, status)
        if (res.data.code === 200) {
          isTop.value = value
          ElMessage.success(value ? '已置顶联系人' : '已取消置顶')
          return true
        }
      } catch (error) {
        console.error('更新置顶状态失败:', error)
        ElMessage.error('操作失败，请稍后重试')
      }

      return false
    }

    // 更新群聊置顶状态
    const updateGroupTopStatus = async (value) => {
      if (!chatRoomId.value) return false

      try {
        const status = value ? 1 : 0
        const res = await setChatRoomPinned(chatRoomId.value, status)
        if (res.data.code === 200) {
          isGroupTop.value = value
          ElMessage.success(value ? '已置顶群聊' : '已取消置顶')
          return true
        }
      } catch (error) {
        console.error('更新群聊置顶状态失败:', error)
        ElMessage.error('操作失败，请稍后重试')
      }

      return false
    }

    return {
      friendId,
      chatRoomId,
      friendInfo,
      isTop,
      isGroupTop,
      groupInfo,
      setFriendId,
      setChatRoomId,
      getFriendInfo,
      updateTopStatus,
      getGroupInfo,
      updateGroupTopStatus,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
          paths: ['friendId', 'chatRoomId'],
        },
      ],
    },
  },
)
