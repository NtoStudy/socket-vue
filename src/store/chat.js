import {defineStore} from "pinia";
import {ref} from "vue";

export const chatFriendOrChatRoomStore = defineStore('chatFriendOrChatRoom', () => {
  const friendId = ref()
  const chatRoomId = ref()
  const setFriendId = (newFriendId) => {
    friendId.value = newFriendId
  }
  const setChatRoomId = (newChatRoomId) => {
    chatRoomId.value = newChatRoomId
  }
  return {
    friendId,
    chatRoomId,
    setFriendId,
    setChatRoomId
  }
})
