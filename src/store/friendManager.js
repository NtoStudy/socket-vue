// stores/friendManagerStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue'
import { handleFriend } from '@/api/notification/index.js'

export const useFriendManagerStore = defineStore('friendManager', ()=>{
  const selectedMenu = ref('friend'); // 当前选中的菜单：friend 或 group
  const friendRequests = ref([]); // 好友通知数据
  const groupRequests = ref([]); // 群通知数据

  const setSelectedMenu = (menu) => {
    selectedMenu.value = menu;
  };
  const handleFriendList = async ()=>{
    const res = await handleFriend()
    friendRequests.value = res.data.data
    console.log(friendRequests.value)
  }
  return {
    selectedMenu,
    friendRequests,
    groupRequests,
    setSelectedMenu,
    handleFriendList
  }
});
