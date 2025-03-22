<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isCurrentUser: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['image-error', 'video-error', 'right-click'])

// 处理右键点击
const handleRightClick = (event) => {
  emit('right-click', props.message, event)
}
</script>

<template>
  <div
    :class="['message-content', isCurrentUser ? 'user-content' : 'assistant-content']"
    @contextmenu="handleRightClick"
  >
    <!-- 对方消息时，头像放在左边 -->
    <slot v-if="!isCurrentUser" name="avatar"></slot>

    <!-- 消息内容 -->
    <div class="message-body">
      <!-- 文本消息 -->
      <div class="text" v-if="message.messageType === 'text'">
        {{ message.content }}
      </div>

      <!-- 图片消息 -->
      <div class="images" v-else-if="message.messageType === 'image'">
        <img
          :src="message.content"
          alt="图片"
          :width="isCurrentUser ? 'auto' : '200'"
          height="200"
          loading="lazy"
          @error="handleImageError"
        />
      </div>

      <!-- 视频消息 -->
      <div class="video" v-else-if="message.messageType === 'video'">
        <video :src="message.content" controls="" height="200" preload="metadata" @error="handleVideoError"></video>
      </div>
    </div>

    <!-- 当前用户消息时，头像放在右边 -->
    <slot v-if="isCurrentUser" name="avatar"></slot>
  </div>
</template>

<style lang="scss" scoped>
.message-content {
  display: flex;
  align-items: flex-start;
  max-width: 80%;

  &.user-content {
    margin-left: auto;
    flex-direction: row;
  }

  &.assistant-content {
    margin-right: auto;
    flex-direction: row;
  }

  .text {
    padding: 10px;
    border-radius: 5px;
    margin: 0 10px;
    word-break: break-all;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }

  .images {
    margin: 0 10px;

    img {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      background-color: #f5f5f5;
      max-width: 100%;
      height: 200px;
      object-fit: contain;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .video {
    margin: 0 10px;

    video {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.5s ease;
      background-color: #f5f5f5;
      max-width: 100%;
      height: 200px;
      object-fit: contain;

      &:hover {
        transform: scale(1.02);
      }
    }
  }

  &.user-content .text {
    background-color: #007bff;
    color: white;
  }

  &.assistant-content .text {
    background-color: #f0f0f0;
    color: #333333;
  }
}
</style>
