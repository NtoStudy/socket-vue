<script setup>
defineProps({
  message: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="text" v-if="message.messageType === 'text'">{{ message.content }}</div>

  <div class="images" v-else-if="message.messageType === 'image'">
    <img :src="message.content" alt="图片" height="200" loading="lazy" />
  </div>

  <div class="video" v-else-if="message.messageType === 'video'">
    <video :src="message.content" controls="" height="200" preload="metadata"></video>
  </div>
</template>

<style lang="scss" scoped>
.text {
  padding: 10px;
  border-radius: 5px;
  margin: 0 10px;
  word-wrap: break-word;
  word-break: break-all;
  max-width: calc(100% - 60px);
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.images {
  margin: 0 10px;
  max-width: calc(100% - 60px);

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
  max-width: calc(100% - 60px);

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
</style>
