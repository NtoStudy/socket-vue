<template>
  <div class="user-profile-card">
    <div class="profile-header">
      <div class="profile-avatar-container">
        <img :src="userAvatar || ''" alt="用户头像" class="profile-avatar" />
      </div>
      <div class="profile-info">
        <div class="likes-count">{{ userInfo?.username || '未知用户' }}</div>
        <div class="qq-number">{{ userInfo?.number || '' }}</div>
      </div>

      <!-- 新增点赞按钮 -->
      <div class="like-button" @click="handleLike">
        <el-icon>
          <Trophy />
        </el-icon>
        <span class="like-count">{{ userInfo?.likeCount || 0 }}</span>
      </div>
    </div>

    <!-- 在线状态 -->
    <StatusIndicator :status="currentStatus" />

    <slot name="remark"></slot>
    <!-- 个人信息列表 -->
    <div class="profile-details">
      <div class="profile-item">
        <div class="item-label">签名</div>
        <div class="item-value">{{ userInfo?.signature || '这个人很懒，什么都没留下' }}</div>
      </div>
      <div class="profile-item">
        <div class="item-label">所在地</div>
        <div class="item-value">{{ userInfo?.city || '未知' }}</div>
      </div>
      <div class="profile-item">
        <div class="item-label">兴趣爱好</div>
        <div class="item-value link">
          <template v-if="hobbies.length > 0">
            <el-tag v-for="tag in hobbies" :key="tag" closable :type="tag.type">
              {{ tag }}
            </el-tag>
          </template>
          <span v-else>暂无兴趣爱好</span>
        </div>
      </div>
    </div>

    <!-- 底部按钮区域使用插槽 -->
    <div class="profile-actions">
      <!-- 默认插槽内容 -->
      <slot>
        <el-button class="action-btn edit-btn" @click="$emit('edit-profile')">编辑资料</el-button>
        <el-button class="action-btn message-btn" type="primary" @click="$emit('send-message')">发消息</el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { Trophy } from '@element-plus/icons-vue'
import { computed } from 'vue'
import StatusIndicator from '@/components/common/StatusIndicator/index.vue'

const props = defineProps({
  userInfo: {
    type: Object,
  },
  currentStatus: {
    type: Object,
  },
  userAvatar: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['edit-profile', 'send-message', 'like'])
const hobbies = computed(() => {
  // 检查 userInfo 和 hobbies 是否存在
  if (!props.userInfo || !props.userInfo.hobbies) {
    return []
  }
  return props.userInfo.hobbies.split(',').filter((item) => item.trim() !== '')
})

// 处理点赞事件
const handleLike = () => {
  emit('like')
}
</script>

<style lang="scss" scoped>
.user-profile-card {
  padding: 0;

  .profile-header {
    display: flex;
    padding: 16px;
    border-radius: 8px 8px 0 0;
    align-items: center;
  }
}

.profile-avatar-container {
  position: relative;
  margin-right: 12px;

  .profile-avatar {
    width: 60px;
    height: 60px;
    background-color: red;
    border-radius: 6px;
    object-fit: cover;
  }
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .qq-number {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .likes-count {
    display: flex;
    align-items: center;
    color: #666;

    .el-icon {
      margin-right: 4px;
      color: #ff6b6b;
    }
  }
}

// 删除了重复的状态样式，现在从status.scss导入

.profile-details {
  padding: 16px;

  .profile-item {
    display: flex;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .item-label {
      width: 60px;
      color: #666;
      flex-shrink: 0;
    }

    .item-value {
      flex: 1;
      color: #333;

      &.link {
        color: #1890ff;
        cursor: pointer;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
    }
  }
}

.profile-actions {
  display: flex;
  padding: 16px;
  border-top: 1px solid #eee;

  .action-btn {
    flex: 1;
    height: 36px;

    &.edit-btn {
      margin-right: 8px;
    }

    &.message-btn {
      background-color: #1890ff;
    }
  }
}

.like-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.3s;

  .like-count {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-icon {
    color: #ff6b6b;
    font-size: 16px;
  }

  &:hover {
    background-color: #ffebee;
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
