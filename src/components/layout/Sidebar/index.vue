<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="avatar-container">
        <el-popover placement="right" :width="300" trigger="click" popper-class="user-profile-popover">
          <template #reference>
            <div class="avatar-wrapper">
              <img :src="userAvatar" alt="Logo" class="logo" />
              <div class="status-indicator" :class="currentStatus.class" @click.stop="showStatusPopup = true"></div>
            </div>
          </template>
          <UserProfileCard
            :user-info="userInfo"
            :current-status="currentStatus"
            :user-avatar="userAvatar"
            @edit-profile="handleEditProfile"
            @send-message="handleSendMessage"
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Setting, ChatDotRound, User, PictureFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import UserProfileCard from '@/components/common/UserProfileCard/index.vue'
import StatusSelector from '@/components/common/StatusSelector/index.vue'
import ProfileEditor from '@/components/common/ProfileEditor/index.vue'

const router = useRouter()
const route = useRoute()

// 计算当前活动路由
const activeRoute = computed(() => route.path)

// 用户信息
const userInfo = ref({
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
})

// 侧边栏项目数据
const sidebarItems = ref([
  { icon: ChatDotRound, badge: false, route: '/main/chat', tooltip: '聊天' },
  { icon: User, badge: false, route: '/main/friend', tooltip: '联系人' },
  { icon: PictureFilled, badge: false, route: '/main/moments', tooltip: '朋友圈' },
])

// 用户头像
const userAvatar = ref('')

// 用户状态相关
const showStatusPopup = ref(false)
const showCustomInput = ref(false)
const currentStatus = ref({ id: 'online', label: '在线', class: 'status-online' })

// 所有状态列表
const allStatuses = ref([
  { id: 'online', label: '在线', class: 'status-online' },
  { id: 'happy', label: 'Q我吧', class: 'status-happy' },
  { id: 'away', label: '离开', class: 'status-away' },
  { id: 'busy', label: '忙碌', class: 'status-busy' },
  { id: 'dnd', label: '请勿打扰', class: 'status-dnd' },
  { id: 'invisible', label: '隐身', class: 'status-invisible' },
  { id: 'battery', label: '我的电量', class: 'status-battery' },
  { id: 'music', label: '听歌中', class: 'status-music' },
  { id: 'working', label: '做好事', class: 'status-working' },
  { id: 'travel', label: '出去浪', class: 'status-travel' },
  { id: 'empty', label: '被掏空', class: 'status-empty' },
  { id: 'steps', label: '今日步数', class: 'status-steps' },
  { id: 'weather', label: '今日天气', class: 'status-weather' },
  { id: 'crush', label: '我crush了', class: 'status-crush' },
])

// 编辑资料相关
const showEditProfileDialog = ref(false)
const profileForm = ref({
  nickname: '.',
  signature: '爱在黄昏日落时',
  gender: 'male',
  birthday: '1988-01-01',
  country: 'china',
  province: '',
  city: '',
})

// 路由跳转处理
const handleRoute = (path) => {
  router.push(path)
}

// 处理自定义状态设置
const handleSetCustomStatus = (statusText) => {
  currentStatus.value = {
    id: 'custom',
    label: statusText,
    class: 'status-custom',
  }
  showStatusPopup.value = false
  showCustomInput.value = false
}

// 处理编辑资料
const handleEditProfile = () => {
  showEditProfileDialog.value = true
}

// 处理发送消息
const handleSendMessage = () => {
  router.push('/main/chat')
}

// 保存用户资料
const saveProfile = (formData) => {
  console.log('保存用户资料:', formData)
  ElMessage.success('资料保存成功')
}
</script>

<style lang="scss" scoped>
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
    margin-bottom: 30px;
    position: relative;

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

          &.status-online {
            background-color: #4caf50;
          }

          &.status-away {
            background-color: #ffc107;
          }

          &.status-busy,
          &.status-dnd {
            background-color: #f44336;
          }

          &.status-invisible {
            background-color: #9e9e9e;
          }

          &.status-happy {
            background-color: #ffeb3b;
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
    }
  }

  .sidebar-body,
  .sidebar-footer {
    width: 100%;
    display: flex;
    justify-content: center;

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
    flex-direction: column;
    align-items: center;
    gap: 15px;
    flex: 1;

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
    margin-bottom: 20px;
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
