<script setup>
import { Loading } from '@element-plus/icons-vue'
import { computed } from 'vue'

// 导入拆分后的组件
import MessageItem from './components/MessageItem.vue'

import { useMessageScroll } from './composables/useMessageScroll.js'
import { useMessageActions } from './composables/useMessageActions.js'

// 定义组件接收的属性
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  messageWindowStatus: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// 定义组件事件
const emit = defineEmits(['load-more', 'message-deleted', 'edit-profile', 'send-message'])

// 使用消息操作相关的 Composable
const { handleRightClickMessage } = useMessageActions((message) => {
  emit('message-deleted', message)
})

// 使用消息滚动相关的 Composable
const { messagesContainer, scrollToBottom } = useMessageScroll(
  () => emit('load-more'),
  computed(() => props.messages),
  computed(() => props.loading),
)

// 定义组件暴露的方法
defineExpose({
  scrollToBottom,
})
</script>

<template>
  <div class="messages" ref="messagesContainer">
    <!-- 加载中提示 -->
    <div v-if="loading" class="loading-indicator">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      <span>加载更多消息...</span>
    </div>

    <!-- 使用 MessageItem 组件替代原来的消息项 -->
    <MessageItem
      v-for="message in messages"
      :key="message.messageId || message.id"
      :message="message"
      @right-click="handleRightClickMessage"
    />
  </div>
</template>

<style lang="scss" scoped>
.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  position: relative;
  scroll-behavior: smooth;

  .loading-indicator {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;

    .el-icon {
      margin-right: 5px;
    }
  }
}
</style>
