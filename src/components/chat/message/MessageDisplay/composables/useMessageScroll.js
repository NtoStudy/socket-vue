import { ref, onMounted, watch } from 'vue'

/**
 * 消息滚动相关逻辑
 * @param {Function} loadMore - 加载更多消息的回调函数
 * @param messages
 * @param loading
 * @returns {Object} - 滚动相关的方法和状态
 */
export function useMessageScroll(loadMore, messages, loading) {
  const messagesContainer = ref(null)
  const isScrolledToBottom = ref(true)

  /**
   * 滚动到消息框底部
   */
  const scrollToBottom = () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      isScrolledToBottom.value = true
    }
  }

  /**
   * 处理滚动事件
   */
  const handleScroll = () => {
    if (!messagesContainer.value) return

    // 检测是否滚动到顶部，触发加载更多
    if (messagesContainer.value.scrollTop < 50 && !loading.value) {
      loadMore()
    }

    // 检测是否滚动到底部
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
    isScrolledToBottom.value = scrollTop + clientHeight >= scrollHeight - 10
  }

  // 监听消息变化，如果用户在底部，则自动滚动到底部
  watch(
    () => messages.value,
    () => {
      if (isScrolledToBottom.value) {
        setTimeout(scrollToBottom, 50)
      }
    },
    { deep: true },
  )

  // 组件挂载后设置滚动事件监听
  onMounted(() => {
    if (messagesContainer.value) {
      messagesContainer.value.addEventListener('scroll', handleScroll)
    }
  })

  return {
    messagesContainer,
    isScrolledToBottom,
    scrollToBottom,
    handleScroll,
  }
}
