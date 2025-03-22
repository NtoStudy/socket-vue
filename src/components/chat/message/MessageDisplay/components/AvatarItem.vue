<script setup>
import UserProfileCard from '@/components/common/UserProfileCard/index.vue'
import { computed } from 'vue'

const props = defineProps({
  isCurrentUser: {
    type: Boolean,
    default: false,
  },
  userInfo: {
    type: Object,
    default: () => ({}),
  },
  currentStatus: {
    type: Object,
  },
  remark: {
    type: String,
    default: '',
  },
  isEditingRemark: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['like', 'edit-remark', 'save-remark'])

// 计算头像显示文本
const avatarText = computed(() => {
  return props.isCurrentUser ? '我' : 'AI'
})

// 处理点赞事件
const handleLike = () => {
  emit('like')
}

// 处理备注编辑
const handleRemarkEdit = () => {
  emit('edit-remark')
}

// 处理备注保存
const handleRemarkSave = () => {
  emit('save-remark')
}
</script>

<template>
  <el-popover
    :placement="isCurrentUser ? 'left' : 'right'"
    :width="300"
    trigger="click"
    popper-class="user-profile-popover"
  >
    <template #reference>
      <div class="avatar">{{ avatarText }}</div>
    </template>

    <UserProfileCard
      v-if="!isCurrentUser"
      @like="handleLike"
      :user-info="userInfo"
      :current-status="currentStatus"
      :user-avatar="''"
    >
      <template #remark>
        <div class="remark-container">
          <div class="remark-display">
            <span class="remark-label">备注：</span>
            <div v-if="!isEditingRemark" class="remark-value" @click="handleRemarkEdit">
              {{ remark || '点击添加备注' }}
            </div>
            <div v-else class="remark-edit">
              <el-input
                :model-value="remark"
                @update:model-value="$emit('update:remark', $event)"
                placeholder="请输入备注"
                size="small"
                @blur="handleRemarkSave"
                @keyup.enter="handleRemarkSave"
              ></el-input>
            </div>
          </div>
        </div>
      </template>
      <el-button class="action-btn call-btn"> 音视频通话</el-button>
      <el-button type="primary"> 发消息</el-button>
    </UserProfileCard>

    <UserProfileCard v-else :user-info="userInfo" :current-status="currentStatus" :user-avatar="''">
      <el-button class="action-btn call-btn" type="primary"> 发消息</el-button>
    </UserProfileCard>
  </el-popover>
</template>

<style lang="scss" scoped>
.avatar {
  min-width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #666666;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}

.remark {
  &-container {
    padding: 8px 16px;
    border-bottom: 1px solid #eee;
  }

  &-display {
    display: flex;
    align-items: center;
    padding: 8px 0;
  }

  &-label {
    width: 42px;
    color: #666;
    font-size: 14px;
    flex-shrink: 0;
  }

  &-value {
    flex: 1;
    color: #333;
    padding: 4px 8px;
    min-height: 20px;
    border-radius: 3px;
    cursor: pointer;

    &:empty::after {
      content: '点击添加备注';
      color: #999;
    }

    &:hover {
      background-color: #f5f5f5;
    }
  }

  &-edit {
    flex: 1;
    margin: 0;
    padding: 0;

    .el-input {
      width: 100%;
    }
  }
}
</style>
