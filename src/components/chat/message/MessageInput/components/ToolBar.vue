<script setup>
import { Film, Microphone, MoreFilled, VideoCamera, Picture } from '@element-plus/icons-vue'

// 定义组件的事件
const emit = defineEmits(['send-picture', 'send-video', 'more-options'])

/**
 * 触发图片上传事件
 */
const handleSendPicture = () => {
  emit('send-picture')
}

/**
 * 触发视频上传事件
 */
const handleSendVideo = () => {
  emit('send-video')
}

/**
 * 触发更多选项事件
 */
const handleMoreOptions = () => {
  emit('more-options')
}
</script>

<template>
  <div class="toolbar">
    <div class="icon-group">
      <!-- 语音输入图标（未绑定事件） -->
      <el-icon>
        <Microphone />
      </el-icon>
      <!-- 图片上传图标 -->
      <el-icon @click="handleSendPicture">
        <Picture />
      </el-icon>
      <!-- 视频上传图标 -->
      <el-icon @click="handleSendVideo">
        <Film />
      </el-icon>
      <!-- 视频通话图标（未绑定事件） -->
      <el-icon>
        <VideoCamera />
      </el-icon>
    </div>

    <div class="more-options">
      <el-icon @click="handleMoreOptions">
        <MoreFilled />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;

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

  .more-options {
    .el-icon {
      cursor: pointer;
      font-size: 20px;
      color: #666;

      &:hover {
        color: #007bff;
      }
    }
  }
}
</style>
