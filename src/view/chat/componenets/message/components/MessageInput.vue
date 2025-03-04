<script setup>
import { Film, Microphone, VideoCamera } from '@element-plus/icons-vue'
import { uploadMethod, uploadVideo } from '@/api/upload.js'

import { ElMessage } from 'element-plus' // 引入 Element Plus 的消息提示组件
import { ref } from 'vue' // 引入 Vue 的响应式变量

// 响应式变量：记录文件上传进度
const uploadProgress = ref(0)
// 响应式变量：表示上传状态（是否正在上传）
const uploading = ref(false)
// 响应式变量：绑定用户输入的消息
const InputMessage = ref('')
// 定义一个事件发射器，用于通知父组件发送消息
const emit = defineEmits(['send-message'])

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
      InputMessage.value = res.data.data // 将图片路径存储到 InputMessage 中
      emit('send-message', { type: 'image', content: InputMessage.value }) // 发送图片消息
      InputMessage.value = '' // 清空输入框
    } catch (error) {
      console.error('Upload failed:', error)
      ElMessage.error('图片上传失败') // 显示错误提示
    } finally {
      event.target.value = null // 清除文件输入框
    }
  }
}

/**
 * 处理文本消息发送逻辑
 */
const handleTextMessage = () => {
  if (InputMessage.value.trim()) {
    emit('send-message', { type: 'text', content: InputMessage.value }) // 发送文本消息
    InputMessage.value = '' // 清空输入框
  }
}
</script>

<template>
  <div class="input-area">
    <!-- 隐藏的图片上传文件输入框 -->
    <input type="file" id="imageUpload" style="display: none" @change="handleImageUpload" />
    <!-- 隐藏的视频上传文件输入框 -->
    <input type="file" id="videoUpload" style="display: none" @change="handleVideoUpload" />
    <!-- 图标按钮组 -->
    <div class="icon-group">
      <!-- 语音输入图标（未绑定事件） -->
      <el-icon>
        <Microphone />
      </el-icon>
      <!-- 图片上传图标 -->
      <el-icon @click="sendPicture">
        <Picture />
        <!-- 需要引入对应的图标组件-->
      </el-icon>
      <!-- 视频上传图标 -->
      <el-icon @click="sendVideo">
        <Film />
      </el-icon>
      <!-- 视频通话图标（未绑定事件） -->
      <el-icon>
        <VideoCamera />
      </el-icon>
    </div>
    <!-- 输入框与发送按钮 -->
    <div class="input-wrapper">
      <!-- 消息输入框 -->
      <textarea
        class="message-input"
        placeholder="输入消息"
        v-model="InputMessage"
        @keyup.enter="handleTextMessage()"
      ></textarea>
      <!-- 发送按钮 -->
      <div class="send-button-wrapper">
        <button class="send-button" @click="handleTextMessage()">发送</button>
      </div>
    </div>
    <!-- 上传进度条 -->
    <el-progress :percentage="uploadProgress" v-if="uploading" style="width: 200px; margin: 10px 0"></el-progress>
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

  .icon-group {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;

    .el-icon {
      cursor: pointer;
      font-size: 20px;
      color: #666;

      &:hover {
        color: #007bff;
      }
    }
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;

    .message-input {
      flex: 1;
      margin-right: 10px;
      padding: 8px;
      border: 1px solid #f5f5f5;
      border-radius: 4px;
      resize: none;
      outline: none;
      min-height: 40px;
      background-color: #f5f5f5;
    }

    .send-button-wrapper {
      display: flex;
      justify-content: flex-end;

      .send-button {
        margin-right: 10px;
        padding: 8px 16px;
        width: 70px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #0056b3;
        }
      }
    }
  }
}
</style>
