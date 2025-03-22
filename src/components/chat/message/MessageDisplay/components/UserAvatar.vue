<script setup>
//TODO登录之后会自动设置online
import { computed } from 'vue'
import { useUserInfoStore } from '@/store/user.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import UserProfileCard from '@/components/common/UserProfileCard/index.vue'

defineProps({
  isSelf: {
    type: Boolean,
    default: false,
  },
})

const useUserInfo = useUserInfoStore()
const friendOrChatRoom = chatFriendOrChatRoomStore()
console.log(useUserInfo.userInfo, 'userinof')
// 计算当前用户状态
const currentStatus = computed(() => {
  return {
    id: '1',
    label: useUserInfo.userInfo.status || '在线',
  }
})

defineEmits(['like'])
</script>

<template>
  <el-popover :placement="isSelf ? 'left' : 'right'" :width="300" trigger="click" popper-class="user-profile-popover">
    <template #reference>
      <div class="avatar">{{ isSelf ? '我' : 'AI' }}</div>
    </template>

    <!-- 自己的个人资料卡片 -->
    <UserProfileCard v-if="isSelf" :user-info="useUserInfo.userInfo" :current-status="currentStatus" :user-avatar="''">
      <el-button class="action-btn" type="primary">发消息</el-button>
    </UserProfileCard>

    <!-- 好友的个人资料卡片 -->
    <UserProfileCard
      v-else
      @like="$emit('like')"
      :user-info="friendOrChatRoom.friendInfo"
      :current-status="{ id: '1', label: '在线' }"
      :user-avatar="''"
    >
      <template #remark>
        <slot name="remark"></slot>
      </template>
      <el-button class="action-btn">音视频通话</el-button>
      <el-button type="primary">发消息</el-button>
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

:deep(.user-profile-popover) {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .el-popper__arrow {
    display: none;
  }
}
.action-btn {
  flex: 1;
  height: 36px;
}
</style>
