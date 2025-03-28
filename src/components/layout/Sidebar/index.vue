<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="avatar-container">
        <el-popover placement="right" :width="300" trigger="click" popper-class="user-profile-popover">
          <template #reference>
            <div class="avatar-wrapper">
              <img :src="userAvatar" alt="Logo" class="logo" />
              <div class="status-indicator" :class="statusClass" @click.stop="showStatusPopup = true"></div>
            </div>
          </template>
          <UserProfileCard
            :user-info="userInfo"
            :current-status="currentStatus"
            :user-avatar="userAvatar"
            :user-type="'self'"
            :show-like-button="true"
            :show-edit-button="true"
            :show-message-button="false"
            @edit-profile="handleEditProfile"
          />
        </el-popover>
      </div>
    </div>

    <div class="sidebar-body">
      <div
        v-for="(item, index) in sidebarItems"
        :key="index"
        class="sidebar-item"
        :class="{ active: activeRoute === item.route }"
      >
        <el-tooltip :content="item.tooltip" placement="right" effect="light">
          <span class="sidebar-icon" @click="handleRoute(item.route)">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
          </span>
        </el-tooltip>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-item" @click="handleRoute('/main/settings')">
        <el-tooltip content="设置" placement="right" effect="light">
          <span class="sidebar-icon">
            <el-icon><Setting /></el-icon>
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>

  <StatusSelector
    v-model="currentStatus"
    v-model:visible="showStatusPopup"
    :status-options="allStatuses"
    :show-custom-input="showCustomInput"
    @toggle-custom-input="showCustomInput = !showCustomInput"
    @set-custom-status="handleSetCustomStatus"
  />

  <ProfileEditor v-model="profileForm" v-model:visible="showEditProfileDialog" @save="saveProfile" />
</template>

<script setup>
import { ref, computed, markRaw, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Setting, ChatDotRound, User, PictureFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import UserProfileCard from '@/components/common/UserProfileCard/index.vue'
import StatusSelector from '@/components/common/StatusSelector/index.vue'
import ProfileEditor from '@/components/common/ProfileEditor/index.vue'
import { useUserInfoStore } from '@/store/user.js'
import { getStatusClass } from '@/utils/statusUtils.js'
const router = useRouter()
const route = useRoute()

// 计算当前活动路由
const activeRoute = computed(() => route.path)

// 用户信息
const userInfo = ref(useUserInfoStore().userInfo)

// 侧边栏项目数据
// 使用 markRaw 包装图标组件
const sidebarItems = ref([
  { icon: markRaw(ChatDotRound), badge: false, route: '/main/chat', tooltip: '聊天' },
  { icon: markRaw(User), badge: false, route: '/main/friend', tooltip: '联系人' },
  { icon: markRaw(PictureFilled), badge: false, route: '/main/moments', tooltip: '朋友圈' },
])

// 用户头像
const userAvatar = ref('')

// 用户状态相关
const showStatusPopup = ref(false)
const showCustomInput = ref(false)
const currentStatus = ref({
  id: '1',
  label: useUserInfoStore().userInfo.status || '在线',
})
// 修改状态样式类的计算方式
const statusClass = computed(() => {
  return getStatusClass(currentStatus.value.label)
})

// 所有状态列表
const allStatuses = ref([
  { id: '1', label: '在线' },
  { id: '2', label: 'Q我吧' },
  { id: '3', label: '离开' },
  { id: '4', label: '忙碌' },
  { id: '5', label: '请勿打扰' },
  { id: '6', label: '隐身' },
  { id: '7', label: '我的电量' },
  { id: '8', label: '听歌中' },
  { id: '9', label: '做好事' },
  { id: '10', label: '出去浪' },
  { id: '11', label: '被掏空' },
  { id: '12', label: '今日步数' },
  { id: '13', label: '今日天气' },
  { id: '14', label: '我crush了' },
])

// 编辑资料相关
const showEditProfileDialog = ref(false)
const profileForm = ref(useUserInfoStore().userInfo)

// 路由跳转处理
const handleRoute = (path) => {
  router.push(path)
}

// 处理自定义状态设置
const handleSetCustomStatus = (statusText) => {
  console.log('设置自定义状态:', statusText)
  currentStatus.value = {
    id: 'custom',
    label: statusText,
  }
  showStatusPopup.value = false
  showCustomInput.value = false
}

// 处理编辑资料
const handleEditProfile = () => {
  showEditProfileDialog.value = true
}

// 保存用户资料
const saveProfile = () => {
  ElMessage.success('资料保存成功')
}
watch(
  () => useUserInfoStore().userInfo,
  () => {
    userInfo.value = useUserInfoStore().userInfo
  },
)

// 添加对用户状态的监听
watch(
  () => useUserInfoStore().userInfo.status,
  (newStatus) => {
    if (newStatus) {
      // 找到匹配的状态对象
      const matchedStatus = allStatuses.value.find((s) => s.label === newStatus)
      if (matchedStatus) {
        currentStatus.value = matchedStatus
      } else {
        // 如果没有匹配的预设状态，则设为自定义状态
        currentStatus.value = {
          id: 'custom',
          label: newStatus,
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
@use '@/assets/status.scss';

.sidebar {
  width: 60px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;

  .sidebar-header {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center; // 添加水平居中

    .avatar-container {
      position: relative;

      .avatar-wrapper {
        position: relative;
        cursor: pointer;

        .logo {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          background-color: #4caf50;
        }

        .status-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #f5f5f5;
          cursor: pointer;
        }
      }
    }
  }

  .sidebar-body,
  .sidebar-footer {
    width: 100%;
    display: flex;

    .sidebar-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #e0e0e0;
      }

      .sidebar-icon {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.45);

        .el-icon {
          font-size: 20px;
        }
      }
    }
  }

  .sidebar-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    flex: 1;
    padding-top: 15px;

    .sidebar-item.active {
      background-color: #e6f7ff;

      .sidebar-icon {
        color: #1890ff;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 3px;
        height: 20px;
        background-color: #1890ff;
        border-radius: 0;
      }
    }
  }

  .sidebar-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto; // 将footer推到底部
    padding-bottom: 20px; // 改用padding替代margin
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
</style>
