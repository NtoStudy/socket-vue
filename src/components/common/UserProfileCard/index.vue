<template>
  <div class="user-profile-card">
    <div class="profile-header">
      <div class="profile-avatar-container">
        <img :src="userAvatar || ''" alt="用户头像" class="profile-avatar" />
      </div>
      <div class="profile-info">
        <div class="username-container">
          <div class="likes-count">{{ userInfo?.username || '未知用户' }}</div>
          <el-tag
            v-if="userType === 'groupMember' && userInfo?.role"
            :type="getRoleTagType(userInfo.role)"
            size="small"
            class="role-tag"
          >
            {{ userInfo.role }}
          </el-tag>
        </div>
        <div class="qq-number">{{ userInfo?.number || '' }}</div>
      </div>

      <!-- 点赞按钮 -->
      <div class="like-button" @click="handleLikeUser" v-if="showLikeButton">
        <el-icon>
          <Trophy />
        </el-icon>
        <span class="like-count">{{ userInfo?.likeCount || 0 }}</span>
      </div>
    </div>

    <!-- 在线状态 -->
    <StatusIndicator :status="currentStatus" />

    <!-- 备注信息插槽 -->
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
        <el-button v-if="showEditButton" class="action-btn edit-btn" @click="$emit('edit-profile')">
          编辑资料
        </el-button>
        <el-button v-if="showMessageButton" class="action-btn message-btn" type="primary" @click="handleSendMessage">
          发消息
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { Trophy } from '@element-plus/icons-vue'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatusIndicator from '@/components/common/StatusIndicator/index.vue'
import { useProfilesStore } from '@/store/profiles.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'

const router = useRouter()
const profilesStore = useProfilesStore()
const chatStore = chatFriendOrChatRoomStore()

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
  currentStatus: {
    type: Object,
    default: () => ({ label: '在线' }),
  },
  userAvatar: {
    type: String,
    default: '',
  },
  // 控制按钮显示
  showLikeButton: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: false,
  },
  showMessageButton: {
    type: Boolean,
    default: true,
  },
  // 用户类型
  userType: {
    type: String,
    default: 'friend', // 'friend', 'groupMember', 'self'
    validator: (value) => ['friend', 'groupMember', 'self'].includes(value),
  },
})
const getRoleTagType = (role) => {
  switch (role) {
    case '群主':
      return 'danger'
    case '管理员':
      return 'warning'
    default:
      return 'info'
  }
}

const emit = defineEmits(['edit-profile', 'send-message', 'like'])

// 计算兴趣爱好标签
const hobbies = computed(() => {
  if (!props.userInfo || !props.userInfo.hobbies) {
    return []
  }
  return props.userInfo.hobbies.split(',').filter((item) => item.trim() !== '')
})

// 处理点赞事件
const handleLikeUser = async () => {
  if (props.userInfo?.userId) {
    emit('like')
  }
}

// 处理发送消息
const handleSendMessage = () => {
  if (props.userInfo?.userId) {
    // 设置聊天对象
    chatStore.setFriendId(props.userInfo.userId)
    // 跳转到聊天页面
    //TODO可以设置路由/:id然后跳转到id
    router.push('/main/chat')
    emit('send-message')
  }
}

// 组件挂载时，尝试获取完整用户信息
onMounted(async () => {
  if (props.userInfo?.userId && props.userType === 'friend') {
    //TODO这里传递的是好友id
    await profilesStore.getUserProfile(props.userInfo.userId)
  }
})
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

  .username-container {
    display: flex;
    align-items: center;
    gap: 8px;

    .role-tag {
      font-size: 10px;
      padding: 0 5px;
      height: 20px;
      line-height: 18px;
    }
  }

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
</style>
