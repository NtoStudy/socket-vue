<script setup>
import { defineProps } from 'vue'

// 定义组件的属性
defineProps({
  percentage: {
    type: Number,
    default: 0,
  },
  show: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="upload-progress" v-if="show">
    <el-progress :percentage="percentage" style="width: 200px; margin: 10px 0"></el-progress>
  </div>
</template>

<style lang="scss" scoped>
.upload-progress {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
