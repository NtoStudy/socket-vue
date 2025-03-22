<script setup>
import { ref } from 'vue'
import UserProfileCard from '@/components/common/UserProfileCard/index.vue'
import { Edit } from '@element-plus/icons-vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
  currentStatus: {
    type: Object,
    default: () => ({ id: '1', label: '在线' }),
  },
  isSelf: {
    type: Boolean,
    default: false,
  },
})

// 备注相关状态
const isEditingRemark = ref(false)
const remarkValue = ref('')

// 开始编辑备注
const startEditRemark = () => {
  remarkValue.value = props.userInfo?.remark || ''
  isEditingRemark.value = true
}

defineEmits(['like', 'save-remark', 'cancel-edit-remark'])
</script>

<template>
  <el-popover :placement="isSelf ? 'left' : 'right'" :width="300" trigger="click" popper-class="user-profile-popover">
    <template #reference>
      <div class="avatar">{{ isSelf ? '我' : 'AI' }}</div>
    </template>

    <UserProfileCard @like="$emit('like')" :user-info="userInfo" :current-status="currentStatus" :user-avatar="''">
      <template #remark>
        <div class="profile-remark">
          <div class="remark-label">备注</div>
          <div v-if="!isEditingRemark" class="remark-value" @click="startEditRemark">
            {{ userInfo?.remark || '添加备注' }}
            <el-icon class="edit-icon"><Edit /></el-icon>
          </div>
          <div v-else class="remark-edit">
            <el-input
              v-model="remarkValue"
              size="small"
              placeholder="请输入备注"
              @blur="$emit('save-remark', remarkValue)"
              @keyup.enter="$emit('save-remark', remarkValue)"
              @keyup.esc="$emit('cancel-edit-remark')"
              ref="remarkInput"
              autofocus
            />
          </div>
        </div>
      </template>

      <el-button v-if="!isSelf" class="action-btn call-btn">音视频通话</el-button>
      <el-button :type="isSelf ? 'primary' : ''">发消息</el-button>
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

.profile-remark {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;

  .remark-label {
    width: 60px;
    color: #666;
    flex-shrink: 0;
  }

  .remark-value {
    flex: 1;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      color: #1890ff;
      .edit-icon {
        opacity: 1;
      }
    }

    .edit-icon {
      margin-left: 8px;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s;
      color: #1890ff;
    }
  }

  .remark-edit {
    flex: 1;
  }
}
</style>
