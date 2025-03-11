import { ref, onMounted, onUnmounted } from 'vue'
import WebSocketService from '@/services/websocket.js'

/**
 * WebSocket组合式函数
 * @param {Function} onMessageCallback - 接收消息时的回调函数
 * @returns {Object} - WebSocket相关方法和状态
 */
export function useWebSocket(onMessageCallback) {
  const websocket = new WebSocketService()
  const isConnected = ref(false)
  
  // 连接WebSocket
  const connect = () => {
    websocket.connect()
    isConnected.value = true
  }
  
  // 断开WebSocket连接
  const disconnect = () => {
    websocket.disconnect()
    isConnected.value = false
  }
  
  // 发送消息
  const sendMessage = (type, content, receiverId, chatRoomId, messageType) => {
    return websocket.sendMessage(type, content, receiverId, chatRoomId, messageType)
  }
  
  // 在组件挂载时连接WebSocket
  onMounted(() => {
    connect()
    websocket.onMessage(onMessageCallback)
  })
  
  // 在组件卸载时断开WebSocket连接
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  }
}