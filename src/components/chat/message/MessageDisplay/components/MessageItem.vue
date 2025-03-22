<script setup>
import { useUserInfoStore } from '@/store/user.js'
import MessageContent from './MessageContent.vue'
import UserAvatar from './UserAvatar.vue'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import { useFriendProfile } from '@/components/chat/message/MessageDisplay/composables/useFriendProfile.js'

const useUserInfo = useUserInfoStore()
const friendOrChatRoom = chatFriendOrChatRoomStore()
const { handleLike } = useFriendProfile(friendOrChatRoom)

defineProps({
  message: {
    type: Object,
    required: true,
  },
})

defineEmits(['right-click'])
</script>

<template>
  <div :class="['message', message.senderId === useUserInfo.userInfo.userId ? 'user-message' : 'assistant-message']">
    <div v-if="message.showTimestamp" class="timestamp">{{ message.sentTime }}</div>

    <div v-if="message.senderId === useUserInfo.userInfo.userId" class="user-content">
      <MessageContent :message="message" @contextmenu="$emit('right-click', message, $event)" />
      <UserAvatar :is-self="true" />
    </div>

    <div v-else class="assistant-content">
      <UserAvatar :is-self="false" @like="handleLike" />
      <MessageContent :message="message" @contextmenu="$emit('right-click', message, $event)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;

  .timestamp {
    font-size: 12px;
    color: #999999;
    margin-bottom: 5px;
    padding: 2px 8px;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }

  .user-content {
    display: flex;
    align-items: flex-start;
    margin-left: auto;
    max-width: 80%;
  }

  .assistant-content {
    display: flex;
    align-items: flex-start;
    margin-right: auto;
    max-width: 80%;
  }

  &.user-message .text {
    background-color: #007bff;
    color: white;
  }

  &.assistant-message .text {
    background-color: #f0f0f0;
    color: #333333;
  }
}
</style>
