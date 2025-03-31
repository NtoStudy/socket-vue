<template>
  <div class="chat-container">
    <ChatSlider />
    <message />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import ChatSlider from '@/components/chat/controlFunction/index.vue'
import message from '@/components/chat/message/index.vue'

// 获取路由参数
const route = useRoute()
const chatStore = chatFriendOrChatRoomStore()

// 处理路由参数，设置当前聊天对象
const handleRouteParams = () => {
  const id = route.params.id
  const query = route.query

  if (id) {
    if (query.fid) {
      // 私聊模式
      chatStore.setFriendId(query.fid)
      chatStore.setChatRoomId(null)
    } else if (query.gid) {
      // 群聊模式
      chatStore.setFriendId(null)
      chatStore.setChatRoomId(query.gid)
    }
  }
}

// 监听路由变化
watch(() => route.params.id, handleRouteParams, { immediate: true })
watch(() => route.query, handleRouteParams, { immediate: true })

onMounted(() => {
  handleRouteParams()
})
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  background-color: #f5f5f5;
}
</style>
