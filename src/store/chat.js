import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUsersInfoById } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { postFriendPin } from '@/api/friend.js'

export const chatFriendOrChatRoomStore = defineStore(
  'chatFriendOrChatRoom',
  () => {
    // 基本聊天状态
    const friendId = ref()
    const chatRoomId = ref()

    // 好友信息相关状态
    const friendInfo = ref({})
    const isTop = ref(false)

    /**
     * 设置好友ID
     * @param {String} newFriendId - 新的好友ID
     */
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

    /**
     * 设置聊天室ID
     * @param {String} newChatRoomId - 新的聊天室ID
     */
    const setChatRoomId = (newChatRoomId) => {
      chatRoomId.value = newChatRoomId
      // 如果设置了新的聊天室ID，清空好友信息
      if (newChatRoomId) {
        friendInfo.value = {}
        isTop.value = false
      }
    }

    /**
     * 获取好友信息
     * @param {String} id - 好友ID
     */
    const getFriendInfo = async (id) => {
      if (!id) {
        console.log('没有有效的 friendId')
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

    /**
     * 更新好友置顶状态
     * @param {Boolean} value - 新的置顶状态
     */
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

    return {
      friendId,
      chatRoomId,
      friendInfo,
      isTop,
      setFriendId,
      setChatRoomId,
      getFriendInfo,
      updateTopStatus,
    }
  },
  {
    persist: true, // 持久化存储
  },
)
