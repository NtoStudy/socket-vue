import { ElMessage, ElMessageBox } from 'element-plus'
import { chatRoomDelete } from '@/api/chatRoom.js'
import { messageDelete } from '@/api/friend.js'

/**
 * 消息操作相关逻辑
 * @param {Function} onMessageDeleted - 消息删除后的回调函数
 * @returns {Object} - 消息操作相关的方法
 */
export function useMessageActions(onMessageDeleted) {
  /**
   * 处理右键点击消息事件
   * @param {Object} message - 被点击的消息对象
   * @param {Event} event - 事件对象
   */
  const handleRightClickMessage = (message, event) => {
    console.log(message, 'deletemessage')
    // 防止默认的右键行为
    event.preventDefault()

    // 弹出确认框，确认是否删除消息
    ElMessageBox.confirm('确定要删除该消息吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      callback: async (action) => {
        if (action === 'confirm') {
          // 确认删除，调用删除消息函数
          await deleteMessage(message.messageId, message.chatRoomId, message)
        }
      },
    })
  }

  /**
   * 删除消息函数
   * @param {number} messageId - 消息ID
   * @param {number} chatRoomId - 聊天室ID，如果消息属于聊天室则提供
   * @param {Object} message - 完整的消息对象
   */
  const deleteMessage = async (messageId, chatRoomId, message) => {
    try {
      let res
      if (chatRoomId) {
        // 如果是聊天室消息，调用聊天室消息删除API
        res = await chatRoomDelete(chatRoomId, messageId)
      } else {
        // 如果是个人消息，调用个人消息删除API
        res = await messageDelete(messageId)
      }
      if (res.data.code === 200) {
        // 消息删除成功，显示成功提示
        ElMessage.success('消息已删除')
        // 触发消息删除事件
        onMessageDeleted(message)
      }
    } catch (error) {
      // 消息删除失败，显示错误提示
      console.error('删除消息时出错:', error)
      ElMessage.error('删除消息失败')
    }
  }

  return {
    handleRightClickMessage,
    deleteMessage,
  }
}
