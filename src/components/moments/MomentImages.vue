<template>
  <div class="images-container">
    <div class="image-item" @click="$emit('image-click', images)">
      <img :src="images" alt="moment image" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
})
console.log('images', props.images)
defineEmits(['image-click'])
</script>

<style lang="scss" scoped>
.images-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;

  .image-item {
    width: 33.33%;

    box-sizing: border-box;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
}
</style>
