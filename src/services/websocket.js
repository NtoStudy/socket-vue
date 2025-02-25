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
  connect() {
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

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ content: message }))
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
    }
  }

  onMessage(callback) {
    this.callbacks.push(callback)
  }

  onOpen(callback) {
    this.onopenCallbacks.push(callback)
  }

  onClose(callback) {
    this.oncloseCallbacks.push(callback)
  }
}
