<template>
  <div class="moments-header">
    <div class="header-left">
      <el-icon class="header-icon" @click="showNotificationDialog = true"><Bell /></el-icon>
      <el-icon class="header-icon" @click="showPublishDialog = true"><Camera /></el-icon>
      <el-icon class="header-icon" @click="handleRefresh"><Refresh /></el-icon>
    </div>
    <div class="title">朋友圈</div>
  </div>

  <!-- 通知列表弹窗 -->
  <el-dialog v-model="showNotificationDialog" :show-close="false" width="400px" class="notification-dialog">
    <div class="notification-header">
      <span>消息</span>
      <span class="clear-btn" @click="clearNotifications">清空</span>
    </div>

    <div class="notification-list">
      <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
        <!-- 用户头像 -->
        <div class="user-avatar">
          <img :src="notification.userAvatar" alt="用户头像" />
        </div>

        <!-- 通知内容 -->
        <div class="notification-content">
          <div class="user-name">{{ notification.userName }}</div>

          <!-- 点赞通知 -->
          <div v-if="notification.type === 'like'" class="notification-text">
            <el-icon><Star /></el-icon>
          </div>

          <!-- 评论通知 -->
          <div v-else-if="notification.type === 'comment'" class="notification-text">
            {{ notification.content }}
          </div>

          <!-- 回复评论通知 -->
          <div v-else-if="notification.type === 'reply'" class="notification-text">
            回复 {{ notification.replyTo }}: {{ notification.content }}
          </div>

          <!-- 时间 -->
          <div class="notification-time">{{ notification.time }}</div>
        </div>

        <!-- 朋友圈图片 -->
        <div v-if="notification.momentImage" class="moment-image">
          <img :src="notification.momentImage" alt="朋友圈图片" />
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- 发布朋友圈弹窗 -->
  <el-dialog v-model="showPublishDialog" width="400px" class="publish-dialog">
    <!-- 现有的发布朋友圈弹窗内容 -->
    <div class="publish-container">
      <textarea v-model="momentContent" class="publish-textarea" placeholder="这一刻的想法..."></textarea>

      <div class="emoji-container">
        <el-icon class="emoji-icon" @click="addEmoji"><View /></el-icon>
      </div>

      <div class="image-upload-container">
        <div class="image-preview" v-if="mediaUrl">
          <img :src="mediaUrl" alt="预览图片" />
          <el-icon class="remove-image" @click="mediaUrl = null">
            <Close />
          </el-icon>
        </div>
        <div v-else class="image-upload-box" @click="triggerImageUpload">
          <el-icon>
            <Plus />
          </el-icon>
        </div>
        <input type="file" ref="imageInput" accept="image/*" style="display: none" @change="handleImageSelect" />
      </div>

      <div class="publish-actions">
        <el-button class="cancel-btn" @click="showPublishDialog = false">取消</el-button>
        <el-button class="publish-btn" type="primary" @click="publishMoment">发表</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
//TODO上传图片之后再做
import { ref } from 'vue'
import { Bell, Camera, Refresh, Plus, Close, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { createPost } from '@/api/modules/userPost.js'

// 弹窗显示状态
const showPublishDialog = ref(false)
const showNotificationDialog = ref(false)

// 朋友圈内容
const momentContent = ref('')
// 选中的图片
const mediaUrl = ref('')
const mediaType = ref('')
// 图片上传input引用
const imageInput = ref('')

// 模拟通知数据
const notifications = ref([
  {
    id: 1,
    userName: '上官轩纪',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    type: 'like',
    time: '2小时前',
    momentImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
  },
  {
    id: 2,
    userName: '上官轩纪',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    type: 'comment',
    content: '真的给我骗到了呢😂',
    time: '2小时前',
    momentImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
  },
  {
    id: 3,
    userName: '不吃鱼饼',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    type: 'like',
    time: '3小时前',
    momentImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
  },
  {
    id: 4,
    userName: '杨雅婷',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    type: 'reply',
    replyTo: 'Uied fovik',
    content: '不需要啦，点满就行了',
    time: '2天前',
    momentImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
  },
  {
    id: 5,
    userName: '赵悦佳',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    type: 'comment',
    content: '好的，我知道了',
    time: '2天前',
    momentImage: null,
  },
])

// 清空通知
const clearNotifications = () => {
  notifications.value = []
  ElMessage.success('已清空所有消息')
  showNotificationDialog.value = false
}

// 处理刷新点击
const handleRefresh = () => {
  console.log('刷新朋友圈')
  ElMessage.success('刷新成功')
}

// 触发图片上传
const triggerImageUpload = () => {
  imageInput.value.click()
}

// 处理图片选择
const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      mediaUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 添加表情
const addEmoji = () => {
  console.log('添加表情')
}

// 发布朋友圈
const publishMoment = async () => {
  if (!momentContent.value.trim()) {
    ElMessage.warning('朋友圈内容不能为空')
    return
  }
  const res = await createPost(momentContent.value, mediaType.value, mediaUrl.value)
  if (res.data.code === 200) {
    momentContent.value = ''
    mediaUrl.value = ''
    mediaType.value = ''
    showPublishDialog.value = false
    ElMessage.success('发布成功')
  }
}
</script>

<style lang="scss" scoped>
.moments-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;

  .header-left {
    position: absolute;
    left: 15px;
    display: flex;
    gap: 20px;

    .header-icon {
      font-size: 20px;
      color: #333;
      cursor: pointer;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 500;
  }
}

/* 通知弹窗样式 */
.notification-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  font-size: 16px;
  font-weight: 500;

  .clear-btn {
    color: #409eff;
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
  }
}

.notification-divider {
  padding: 10px 15px;
  background-color: #f7f7f7;
  color: #999;
  font-size: 14px;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;

  .notification-item {
    display: flex;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;

    .user-avatar {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .notification-content {
      flex: 1;
      min-width: 0;

      .user-name {
        font-size: 14px;
        color: #07c160;
        margin-bottom: 5px;
        font-weight: 500;
      }

      .notification-text {
        font-size: 14px;
        color: #333;
        margin-bottom: 5px;
        word-break: break-all;
      }

      .notification-time {
        font-size: 12px;
        color: #999;
      }
    }

    .moment-image {
      width: 50px;
      height: 50px;
      margin-left: 10px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }
    }
  }
}

/* 发布朋友圈弹窗样式 */
.publish-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.publish-container {
  display: flex;
  flex-direction: column;
  padding: 15px;

  .publish-textarea {
    width: 100%;
    min-height: 120px;
    border: none;
    resize: none;
    font-size: 16px;
    outline: none;
    padding: 10px 0;
  }

  .emoji-container {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;

    .emoji-icon {
      font-size: 24px;
      color: #666;
      cursor: pointer;
    }
  }

  .image-upload-container {
    margin-bottom: 20px;

    .image-preview {
      position: relative;
      width: 100px;
      height: 100px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .remove-image {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 50%;
        padding: 2px;
        cursor: pointer;
      }
    }

    .image-upload-box {
      width: 100px;
      height: 100px;
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .el-icon {
        font-size: 30px;
        color: #999;
      }
    }
  }

  .publish-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .cancel-btn,
    .publish-btn {
      flex: 1;
    }

    .cancel-btn {
      margin-right: 10px;
    }
  }
}
</style>
