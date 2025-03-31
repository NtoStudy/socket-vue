// stores/friendManagerStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { handleChatRoom, getHandleFriend } from '@/api/index.js'

export const useFriendManagerStore = defineStore('friendManager', () => {
  const selectedMenu = ref('friend') // 当前选中的菜单：friend 或 group
  const friendRequests = ref([]) // 好友通知数据
  const groupRequests = ref([]) // 群通知数据

  const setSelectedMenu = (menu) => {
    selectedMenu.value = menu
  }
  const handleFriendList = async () => {
    const res = await getHandleFriend()
    friendRequests.value = res.data.data
  }
  const handleGroupList = async () => {
    const res = await handleChatRoom()
    groupRequests.value = res.data.data
  }
  return {
    selectedMenu,
    friendRequests,
    groupRequests,
    setSelectedMenu,
    handleFriendList,
    handleGroupList,
  }
})
