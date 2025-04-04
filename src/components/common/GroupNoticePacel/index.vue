<template>
  <div class="group-notice-panel">
    <div class="panel-header">
      <div class="title">群公告</div>
      <el-button type="primary" @click="handleNewNotice" v-if="isGroupOwner || isGroupAdmin"> 发布新公告</el-button>
    </div>

    <div class="notice-list" v-if="notices && notices.length > 0">
      <el-card v-for="notice in processedNotices" :key="notice.id" class="notice-card">
        <template #header>
          <div class="card-header">
            <div class="publisher-info">
              <img :src="notice.publisherAvatar" alt="发布者头像" class="publisher-avatar" />
              <div class="publisher-name">{{ notice.publisherName }}</div>
              <el-icon class="icon-style" @click="handleEdit(notice)">
                <EditPen />
              </el-icon>
              <el-icon class="icon-style" @click="handleDelete(notice)">
                <Delete />
              </el-icon>
            </div>

            <div class="publish-time">{{ formatSentTime(notice.updatedAt ? notice.updatedAt : createdAt) }}</div>
          </div>
        </template>
        <div class="notice-content">{{ notice.content }}</div>
      </el-card>
    </div>

    <div class="empty-notice" v-else>
      <el-empty description="暂无群公告" />
    </div>
    <el-dialog
      v-model="showPublishForm"
      :title="isEditing ? '编辑公告' : '发布新公告'"
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
            <el-button type="primary" @click="submitNotice" :disabled="!newNoticeContent.trim()">
              {{ isEditing ? '保存' : '发布' }}
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatSentTime } from '@/utils/messageUtils.js'
import { getUsersInfoInChatRoom } from '@/api/index.js'
import { deleteAnnouncement, publishAnnouncement, updateAnnouncement } from '@/api/modules/chatRoomAnnouncements.js'

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
  roomId: {
    type: Number,
  },
})

console.log(props.notices, '123')

// 发布新公告相关状态
const showPublishForm = ref(false)
const newNoticeContent = ref('')
const isPinned = ref(false)
// 处理后的公告列表
const processedNotices = ref([])
const isEditing = ref(false)
const currentEditingNotice = ref(null)

// 处理公告数据，添加发布者信息
const processNotices = async () => {
  if (!props.notices || props.notices.length === 0) {
    processedNotices.value = []
    return
  }
  const processed = []
  for (const notice of props.notices) {
    // 复制公告对象
    const processedNotice = { ...notice }

    // 获取发布者ID
    const userId = notice.lastUpdaterId ? notice.lastUpdaterId : notice.creatorId

    try {
      // 获取用户信息
      const res = await getUsersInfoInChatRoom(userId, props.roomId)
      if (res && res.data && res.data.data) {
        // 添加发布者信息到公告对象
        processedNotice.publisherAvatar = res.data.data.avatarUrl || ''
        processedNotice.publisherName = res.data.data.nickname || res.data.data.username || '未知用户'
      } else {
        // 设置默认值
        processedNotice.publisherAvatar = ''
        processedNotice.publisherName = '未知用户'
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      processedNotice.publisherAvatar = ''
      processedNotice.publisherName = '未知用户'
    }

    // 将处理后的公告添加到数组
    processed.push(processedNotice)
  }

  // 更新处理后的公告列表
  processedNotices.value = processed
}
// 处理编辑公告
//TODO处理之后刷新公告列表
const handleEdit = (notice) => {
  isEditing.value = true
  currentEditingNotice.value = notice
  console.log('编辑公告', currentEditingNotice.value)
  newNoticeContent.value = notice.content
  isPinned.value = notice.isPinned === 1
  showPublishForm.value = true
}
// 提交公告（发布或编辑）
const submitNotice = async () => {
  if (!newNoticeContent.value.trim()) {
    ElMessage.warning('公告内容不能为空')
    return
  }

  if (isEditing.value && currentEditingNotice.value) {
    // 编辑现有公告
    const res = await updateAnnouncement(
      currentEditingNotice.value.announcementId,
      newNoticeContent.value,
      '',
      isPinned.value ? 1 : 0,
    )
    if (res.data.code === 200) {
      ElMessage.success('公告已更新')
    }
  } else {
    // 发布新公告
    const res = await publishAnnouncement(props.roomId, newNoticeContent.value, '', isPinned.value ? 1 : 0)
    if (res.data.code === 200) {
      ElMessage.success('公告已发布')
    }
  }

  // 重置表单
  newNoticeContent.value = ''
  isPinned.value = false
  showPublishForm.value = false
  isEditing.value = false
  currentEditingNotice.value = null
}
const handleNewNotice = () => {
  // 重置表单
  newNoticeContent.value = ''
  isPinned.value = false
  isEditing.value = false
  showPublishForm.value = true
}
const handleDelete = (notice) => {
  console.log(notice)
  ElMessageBox.confirm('确定删除该公告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // 删除公告逻辑
      console.log('删除公告', notice.announcementId)
      const res = await deleteAnnouncement(notice.announcementId, 0)
      if (res.data.code === 200) {
        ElMessage.success('公告已删除')
      }
    })
    .catch(() => {
      // 取消删除逻辑
      ElMessage.info('已取消删除')
    })
}
onMounted(() => {
  processNotices()
})
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

.icon-style {
  margin-left: 10px;
  cursor: pointer;
}
</style>
