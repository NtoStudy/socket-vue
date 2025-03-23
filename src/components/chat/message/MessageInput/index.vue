<script setup>
import { ref } from 'vue'
import { uploadMethod, uploadVideo } from '@/api/upload.js'
import { ElMessage } from 'element-plus'
import ToolBar from './components/ToolBar.vue'
import TextArea from './components/TextArea.vue'
import UploadProgress from './components/UploadProgress.vue'

// 响应式变量：记录文件上传进度
const uploadProgress = ref(0)
// 响应式变量：表示上传状态（是否正在上传）
const uploading = ref(false)
// 定义一个事件发射器，用于通知父组件发送消息
const emit = defineEmits(['send-message', 'open-more-options'])

/**
 * 触发文件选择框点击事件（图片上传）
 */
const sendPicture = () => {
  const input = document.getElementById('imageUpload')
  input.click()
}

/**
 * 触发文件选择框点击事件（视频上传）
 */
const sendVideo = () => {
  const input = document.getElementById('videoUpload')
  input.click()
}

/**
 * 处理视频上传逻辑
 * @param {Event} event - 文件上传事件
 */
const handleVideoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const chunkSize = 1024 * 1024 // 每个分片大小为 1MB
  const chunks = Math.ceil(file.size / chunkSize) // 计算总分片数
  let uploadedChunks = 0 // 已上传的分片数

  uploading.value = true // 设置上传状态为正在上传

  try {
    // 将文件拆分成多个分片并逐个上传
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize // 分片起始位置
      const end = start + chunkSize // 分片结束位置
      const chunk = file.slice(start, end) // 获取分片

      const formData = new FormData()
      formData.append('file', chunk) // 添加分片文件
      formData.append('fileName', file.name) // 添加文件名
      formData.append('chunkNumber', i) // 添加分片编号
      formData.append('totalChunks', chunks) // 添加总分片数

      // 使用封装后的 Axios 方法上传分片
      await uploadVideo(formData)
      uploadedChunks++
      uploadProgress.value = Math.round((uploadedChunks / chunks) * 100) // 更新上传进度
    }

    event.target.value = null // 清除文件输入框
    ElMessage.success('视频发送成功') // 显示成功提示
  } catch (error) {
    console.error('Video upload failed:', error)
    ElMessage.error('上传分片时出错') // 显示错误提示
  } finally {
    uploading.value = false // 重置上传状态
    uploadProgress.value = 0 // 重置上传进度
  }
}

/**
 * 处理图片上传逻辑
 * @param {Event} event - 文件上传事件
 */
const handleImageUpload = async (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    const file = files[0]

    try {
      const res = await uploadMethod(file) // 调用上传方法
      const imageUrl = res.data.data // 将图片路径存储
      emit('send-message', { type: 'image', content: imageUrl }) // 发送图片消息
    } catch (error) {
      console.error('Upload failed:', error)
      ElMessage.error('图片上传失败') // 显示错误提示
    } finally {
      event.target.value = null // 清除文件输入框
    }
  }
}

/**
 * 处理文本消息发送
 * @param {String} message - 文本消息内容
 */
const handleSendTextMessage = (message) => {
  emit('send-message', { type: 'text', content: message })
}

/**
 * 处理更多选项按钮点击
 */
const handleMoreOptions = () => {
  emit('open-more-options')
}
</script>

<template>
  <div class="input-area">
    <!-- 隐藏的图片上传文件输入框 -->
    <input type="file" id="imageUpload" style="display: none" @change="handleImageUpload" />
    <!-- 隐藏的视频上传文件输入框 -->
    <input type="file" id="videoUpload" style="display: none" @change="handleVideoUpload" />

    <!-- 工具栏组件 -->
    <ToolBar @send-picture="sendPicture" @send-video="sendVideo" @more-options="handleMoreOptions" />

    <!-- 文本输入区域组件 -->
    <TextArea @send-message="handleSendTextMessage" />

    <!-- 上传进度组件 -->
    <UploadProgress :percentage="uploadProgress" :show="uploading" />
  </div>
</template>

<style lang="scss" scoped>
.input-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}
</style>
