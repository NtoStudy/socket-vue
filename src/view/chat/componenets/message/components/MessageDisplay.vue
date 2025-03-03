<script setup>
import { ElMessageBox } from 'element-plus'

defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  currentUserId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['delete-message'])

const handleRightClick = (message) => {
  ElMessageBox.confirm('确定要删除该消息吗？', '删除消息', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      emit('delete-message', message)
    })
    .catch(() => {})
}

const formatTime = (timeString) => {
  const date = new Date(timeString)
  const now = new Date()
  const oneDay = 24 * 60 * 60 * 1000

  if (now - date < oneDay) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<template>
  <div class="messages">
    <div
      v-for="(message, index) in messages"
      :key="index"
      :class="['message', currentUserId === message.senderId ? 'user-message' : 'assistant-message']"
    >
      <div
        v-if="index === 0 || new Date(message.sentTime) - new Date(messages[index - 1].sentTime) >= 180000"
        class="timestamp"
      >
        {{ formatTime(message.sentTime) }}
      </div>

      <div
        v-if="currentUserId === message.senderId"
        class="user-content"
        @contextmenu.prevent="handleRightClick(message)"
      >
        <div class="content-wrapper">
          <div class="text" v-if="message.messageType === 'text'">{{ message.content }}</div>
          <img v-else-if="message.messageType === 'image'" :src="message.content" alt="图片" class="media-content" />
          <video v-else-if="message.messageType === 'video'" :src="message.content" controls class="media-content" />
        </div>
        <div class="avatar">我</div>
      </div>

      <div v-else class="assistant-content" @contextmenu.prevent="handleRightClick(message)">
        <div class="avatar">TA</div>
        <div class="content-wrapper">
          <div class="text" v-if="message.messageType === 'text'">{{ message.content }}</div>
          <img v-else-if="message.messageType === 'image'" :src="message.content" alt="图片" class="media-content" />
          <video v-else-if="message.messageType === 'video'" :src="message.content" controls class="media-content" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;

  .message {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    .timestamp {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin: 10px 0;
    }

    .user-content,
    .assistant-content {
      display: flex;
      align-items: flex-end;
      max-width: 80%;

      .content-wrapper {
        .text {
          padding: 10px 15px;
          border-radius: 18px;
          line-height: 1.4;
          word-break: break-word;
        }

        .media-content {
          max-width: 200px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      }

      .avatar {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 8px;
        font-size: 14px;
      }
    }

    &.user-message {
      align-items: flex-end;

      .text {
        background: #007bff;
        color: white;
      }
    }

    &.assistant-message {
      align-items: flex-start;

      .text {
        background: #f0f0f0;
        color: #333;
      }

      .assistant-content {
        flex-direction: row-reverse;
      }
    }
  }
}
</style>
