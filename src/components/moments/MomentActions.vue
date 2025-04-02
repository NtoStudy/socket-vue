<template>
  <div class="actions-wrapper">
    <!-- 操作按钮 -->
    <div class="action-button" @click="$emit('toggle', item)">
      <i class="action-dots">⋯</i>
    </div>

    <!-- 操作菜单 -->
    <div v-if="item.showActions" class="action-menu">
      <div class="action-menu-item" @click="$emit('like', item)">
        <el-icon style="position: relative; top: 2px; right: 2px"><Apple /></el-icon>
        <span>{{ item.isLiked ? '取消' : '' }}赞</span>
      </div>
      <div class="action-menu-item" @click="$emit('comment', item)">
        <el-icon style="position: relative; top: 2px; right: 2px"><ChatLineSquare /></el-icon>
        <span>评论</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle', 'like', 'comment'])
</script>

<style lang="scss" scoped>
.actions-wrapper {
  position: relative;

  .action-button {
    cursor: pointer;
    padding: 5px;

    .action-dots {
      font-size: 18px;
      color: #999;
      font-style: normal;
    }
  }

  .action-menu {
    display: flex;
    position: absolute;
    right: 0;
    bottom: 30px;
    background-color: #333;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 10;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      right: 10px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #333;
    }

    .action-menu-item {
      padding: 8px 15px;
      color: white;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background-color: #444;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #444;
      }
    }
  }
}
</style>
