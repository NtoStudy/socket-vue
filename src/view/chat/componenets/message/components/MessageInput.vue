<script setup>
import { ref } from 'vue'
import { ElIcon } from 'element-plus'
import { Film, Picture, VideoCamera, Microphone } from '@element-plus/icons-vue'

defineProps({
  uploadProgress: Number,
  uploading: Boolean,
})

const emit = defineEmits(['send-message', 'update:upload-progress', 'update:uploading'])

const newMessage = ref('')
const fileInput = ref(null)
const videoInput = ref(null)

const handleSend = () => {
  if (newMessage.value.trim()) {
    emit('send-message', 'text', newMessage.value)
    newMessage.value = ''
  }
}

const triggerFileUpload = (type) => {
  if (type === 'image') fileInput.value.click()
  if (type === 'video') videoInput.value.click()
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  emit('update:uploading', true)
  try {
    // 这里替换实际的上传逻辑
    const fakeUrl = URL.createObjectURL(file)
    emit('send-message', 'image', fakeUrl)
  } finally {
    event.target.value = null
    emit('update:uploading', false)
  }
}

const handleVideoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  emit('update:uploading', true)
  try {
    // 这里替换实际的分片上传逻辑
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      emit('update:upload-progress', progress)
      if (progress >= 100) clearInterval(interval)
    }, 200)

    const fakeUrl = URL.createObjectURL(file)
    emit('send-message', 'video', fakeUrl)
  } finally {
    event.target.value = null
    emit('update:uploading', false)
  }
}
</script>

<template>
  <div class="input-container">
    <div class="toolbar">
      <el-icon @click="triggerFileUpload('image')">
        <Picture />
      </el-icon>
      <el-icon @click="triggerFileUpload('video')">
        <Film />
      </el-icon>
      <el-icon>
        <VideoCamera />
      </el-icon>
      <el-icon>
        <Microphone />
      </el-icon>

      <input ref="fileInput" type="file" hidden accept="image/*" @change="handleImageUpload" />
      <input ref="videoInput" type="file" hidden accept="video/*" @change="handleVideoUpload" />
    </div>

    <div class="input-area">
      <textarea v-model="newMessage" placeholder="输入消息..." @keyup.enter.prevent="handleSend"></textarea>
      <button @click="handleSend">发送</button>
    </div>

    <div v-if="uploading" class="progress-container">
      <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
      <span>{{ uploadProgress }}%</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  padding: 12px;
  background: #f5f5f5;
  border-top: 1px solid #eee;

  .toolbar {
    display: flex;
    gap: 15px;
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

  .input-area {
    display: flex;
    gap: 10px;

    textarea {
      flex: 1;
      min-height: 40px;
      max-height: 120px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 18px;
      resize: none;
      outline: none;
      font-size: 14px;
      line-height: 1.5;
    }

    button {
      padding: 8px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 18px;
      cursor: pointer;

      &:hover {
        background: #0056b3;
      }
    }
  }

  .progress-container {
    margin-top: 8px;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    position: relative;

    .progress-bar {
      height: 100%;
      background: #007bff;
      transition: width 0.3s ease;
    }

    span {
      position: absolute;
      right: 0;
      top: -20px;
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
