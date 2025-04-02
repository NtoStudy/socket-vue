<template>
  <div class="images-container">
    <div v-for="(image, index) in images" :key="index" class="image-item" @click="$emit('image-click', image)">
      <img :src="image" alt="moment image" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  images: {
    type: Array,
    required: true,
  },
})

defineEmits(['image-click'])
</script>

<style lang="scss" scoped>
.images-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;

  .image-item {
    width: 33.33%;
    padding: 2px;
    box-sizing: border-box;
    cursor: pointer;

    img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }
  }
}

@media (max-width: 768px) {
  .images-container {
    .image-item {
      img {
        height: 80px;
      }
    }
  }
}
</style>
