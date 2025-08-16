<script setup>
import { defineProps, defineEmits, computed } from 'vue'

// 定义组件的属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  isTop: {
    type: Boolean,
    default: false,
  },
})
// 定义组件的事件
const emit = defineEmits(['close', 'topChange', 'deleteChatHistory', 'deleteFriend'])

// 使用计算属性处理抽屉可见性
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('close', value),
})

// 处理抽屉关闭事件
const handleClose = () => {
  emit('close', false)
}

// 处理置顶状态变更
const handleTopChange = (value) => {
  emit('topChange', value)
}

// 处理删除聊天记录点击
const handleDeleteChatHistory = () => {
  emit('deleteChatHistory')
  handleClose()
}

// 处理删除好友点击
const handleDeleteFriend = () => {
  emit('deleteFriend')
  handleClose()
}
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    :show-close="false"
    direction="rtl"
    size="300px"
    :modal-class="'chat-drawer-modal'"
    :with-header="false"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    @closed="handleClose"
  >
    <div class="drawer-content">
      <!-- 选项列表 -->
      <div class="option-list">
        <!-- 置顶选项 -->
        <div class="option-item with-switch">
          <div class="option-info">
            <span class="option-text">设为置顶</span>
          </div>
          <el-switch :model-value="isTop" @change="handleTopChange" />
        </div>

        <!-- 删除聊天记录选项 -->
        <div class="option-item danger" @click="handleDeleteChatHistory">
          <div class="option-info">
            <span class="option-text">删除聊天记录</span>
          </div>
        </div>

        <div class="option-item delete" @click="handleDeleteFriend">
          <div class="option-info">
            <span>删除好友</span>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.drawer-content {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  .option-list {
    .option-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;

      &:hover {
        background-color: #f9f9f9;
      }

      &.with-switch {
        cursor: default;
      }

      &.danger {
        .option-text {
          color: #f56c6c;
        }
      }

      &.delete {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ff4d4d;
      }

      .option-info {
        display: flex;
        align-items: center;

        .option-text {
          font-size: 15px;
          color: #333;
        }
      }

      .el-icon {
        color: #909399;
        font-size: 16px;
      }
    }
  }
}

:deep(.chat-drawer-modal) {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
