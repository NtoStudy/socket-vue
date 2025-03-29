<template>
  <div class="group-notice-panel">
    <div class="panel-header">
      <div class="title">群公告</div>
      <el-button type="primary" @click="showPublishForm = true" v-if="isGroupOwner || isGroupAdmin">
        发布新公告
      </el-button>
    </div>

    <div class="notice-list" v-if="notices && notices.length > 0">
      <el-card v-for="notice in notices" :key="notice.id" class="notice-card">
        <template #header>
          <div class="card-header">
            <div class="publisher-info">
              <img :src="notice.publisherAvatar" alt="发布者头像" class="publisher-avatar" />
              <div class="publisher-name">{{ notice.publisherName }}</div>
            </div>
            <div class="publish-time">{{ formatTime(notice.publishTime) }}</div>
          </div>
        </template>
        <div class="notice-content">{{ notice.content }}</div>
      </el-card>
    </div>

    <div class="empty-notice" v-else>
      <el-empty description="暂无群公告" />
    </div>

    <!-- 发布新公告表单 -->
    <el-dialog
      v-model="showPublishForm"
      title="发布新公告"
      width="500px"
      :close-on-click-modal="false"
      :show-close="true"
    >
      <div class="publish-form">
        <el-input
          v-model="newNoticeContent"
          type="textarea"
          :rows="6"
          placeholder="填写公告，1-600字"
          maxlength="600"
          show-word-limit
          resize="none"
        />

        <div class="form-footer">
          <el-checkbox v-model="isPinned">置顶公告</el-checkbox>
          <div class="dialog-footer">
            <el-button @click="showPublishForm = false">取消</el-button>
            <el-button type="primary" @click="handlePublishNotice" :disabled="!newNoticeContent.trim()">
              发布
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  notices: {
    type: Array,
    default: () => [],
  },
  isGroupOwner: {
    type: Boolean,
    default: false,
  },
  isGroupAdmin: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['publish-notice'])

// 发布新公告相关状态
const showPublishForm = ref(false)
const newNoticeContent = ref('')
const isPinned = ref(false)

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 处理发布公告
const handlePublishNotice = () => {
  if (!newNoticeContent.value.trim()) {
    ElMessage.warning('公告内容不能为空')
    return
  }

  // 触发发布事件
  emit('publish-notice', {
    content: newNoticeContent.value,
    isPinned: isPinned.value,
  })

  // 重置表单
  newNoticeContent.value = ''
  isPinned.value = false
  showPublishForm.value = false

  ElMessage.success('公告发布成功')
}
</script>

<style lang="scss" scoped>
.group-notice-panel {
  padding: 16px;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .notice-list {
    .notice-card {
      margin-bottom: 16px;
      border-radius: 8px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .publisher-info {
          display: flex;
          align-items: center;

          .publisher-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
          }

          .publisher-name {
            font-size: 14px;
            font-weight: 500;
          }
        }

        .publish-time {
          font-size: 12px;
          color: #999;
        }
      }

      .notice-content {
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }

  .empty-notice {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }

  .publish-form {
    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;

      .dialog-footer {
        display: flex;
        gap: 12px;
      }
    }
  }
}
</style>
