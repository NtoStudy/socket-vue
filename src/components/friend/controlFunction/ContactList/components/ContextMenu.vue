<template>
  <div v-show="visible" class="context-menu" :style="{ top: top + 'px', left: left + 'px' }">
    <div class="menu-item" @click="$emit('add-group')">
      <el-icon><Plus /></el-icon>
      <span>添加分组</span>
    </div>
    <div class="menu-item" @click="$emit('rename-group')">
      <el-icon><Edit /></el-icon>
      <span>重命名该组</span>
    </div>
    <div class="menu-item" @click="$emit('delete-group')">
      <el-icon><Delete /></el-icon>
      <span>删除分组</span>
    </div>
  </div>
</template>

<script setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  top: {
    type: Number,
    default: 0,
  },
  left: {
    type: Number,
    default: 0,
  },
})

defineEmits(['add-group', 'rename-group', 'delete-group'])
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 5px 0;
  min-width: 150px;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #f5f5f5;
    }

    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}
</style>
