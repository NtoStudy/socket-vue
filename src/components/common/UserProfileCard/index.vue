<template>
  <div class="user-profile-card">
    <div class="profile-header">
      <div class="profile-avatar-container">
        <img :src="userAvatar || ''" alt="用户头像" class="profile-avatar" />
      </div>
      <div class="profile-info">
        <div class="likes-count">{{ userInfo.username }}</div>
        <div class="qq-number">{{ userInfo.qqNumber }}</div>
      </div>

      <!-- 新增点赞按钮 -->
      <div class="like-button" @click="handleLike">
        <el-icon>
          <Trophy />
        </el-icon>
        <span class="like-count">{{ userInfo.likes }}</span>
      </div>
    </div>

    <!-- 在线状态 -->
    <div class="profile-status">
      <div class="status-dot" :class="currentStatus.class"></div>
      <span>{{ currentStatus.label }}</span>
    </div>

    <!-- 个人信息列表 -->
    <div class="profile-details">
      <div class="profile-item">
        <div class="item-label">签名</div>
        <div class="item-value">{{ userInfo.signature }}</div>
      </div>
      <div class="profile-item">
        <div class="item-label">所在地</div>
        <div class="item-value">{{ userInfo.location }}</div>
      </div>
      <div class="profile-item">
        <div class="item-label">兴趣爱好</div>
        <div class="item-value link">
          <el-tag v-for="tag in userInfo.tags" :key="tag.name" closable :type="tag.type">
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="profile-actions">
      <el-button class="action-btn edit-btn" @click="$emit('edit-profile')">编辑资料</el-button>
      <el-button class="action-btn message-btn" type="primary" @click="$emit('send-message')">发消息</el-button>
    </div>
  </div>
</template>

<script setup>
import { Trophy } from '@element-plus/icons-vue'

defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      qqNumber: '2943343011',
      likes: '9999',
      username: '阿宝',
      signature: '爱在黄昏日落时',
      location: '中国',
      tags: [
        { name: 'Tag 1', type: 'primary' },
        { name: 'Tag 2', type: 'success' },
        { name: 'Tag 3', type: 'info' },
        { name: 'Tag 4', type: 'warning' },
        { name: 'Tag 5', type: 'danger' },
      ],
    }),
  },
  currentStatus: {
    type: Object,
    required: true,
  },
  userAvatar: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['edit-profile', 'send-message', 'like'])

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

.profile-status {
  display: flex;
  align-items: center;
  padding: 12px 16px;

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;

    &.status-online {
      background-color: #4caf50;
    }

    &.status-happy {
      background-color: #ffeb3b;
    }

    &.status-away {
      background-color: #ffc107;
    }

    &.status-busy {
      background-color: #f44336;
    }

    &.status-dnd {
      background-color: #f44336;
    }

    &.status-invisible {
      background-color: #9e9e9e;
    }

    &.status-custom,
    &.status-battery,
    &.status-music,
    &.status-working,
    &.status-travel,
    &.status-empty,
    &.status-steps,
    &.status-weather,
    &.status-crush {
      background-color: #2196f3;
    }
  }
}

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
