import { useUserInfoStore } from '@/store/user.js'
const useUserInfo = useUserInfoStore()
const token = useUserInfo.token

export default class WebSocketService {
  constructor() {
    this.socket = null
    this.callbacks = []
    this.onopenCallbacks = []
    this.oncloseCallbacks = []
  }

  // 连接 WebSocket
  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already open.')
      return
    }

    this.socket = new WebSocket(`ws://localhost:8080/chat?token=${token}`)

    this.socket.onopen = () => {
      console.log('WebSocket连接已打开')
      this.onopenCallbacks.forEach((callback) => callback())
    }

    this.socket.onmessage = (event) => {
      console.log('收到消息：', event.data)
      const data = JSON.parse(event.data)
      this.callbacks.forEach((callback) => callback(data))
    }

    this.socket.onclose = () => {
      console.log('WebSocket连接已关闭')
      this.oncloseCallbacks.forEach((callback) => callback())
    }
  }

  // 发送消息
  sendMessage(content, receiverId) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ content, receiverId }))
    } else {
      console.error("WebSocket is not open. Can't send message.")
    }
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.close()
    }
  }

  // 注册消息回调
  onMessage(callback) {
    this.callbacks.push(callback)
  }

  // 注册连接打开回调
  onOpen(callback) {
    this.onopenCallbacks.push(callback)
  }

  // 注册连接关闭回调
  onClose(callback) {
    this.oncloseCallbacks.push(callback)
  }
}
