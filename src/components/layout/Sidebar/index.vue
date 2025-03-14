<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="avatar-container">
        <el-popover placement="right" :width="300" trigger="click" popper-class="user-profile-popover">
          <template #reference>
            <div class="avatar-wrapper">
              <img src="" alt="Logo" class="logo" />
              <div class="status-indicator" :class="currentStatus.class" @click.stop="showStatusPopup = true"></div>
            </div>
          </template>

          <!-- 用户信息卡片内容 -->
          <div class="user-profile-card">
            <!-- 顶部区域：头像、性别、QQ号和点赞 -->
            <div class="profile-header">
              <div class="profile-avatar-container">
                <img src="" alt="用户头像" class="profile-avatar" />
              </div>
              <div class="profile-info">
                <div class="qq-number">QQ 2943343011</div>
                <div class="likes-count">
                  <el-icon>
                    <Trophy />
                  </el-icon>
                  <span>9999+</span>
                </div>
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
                <div class="item-value">爱在黄昏日落时</div>
              </div>
              <div class="profile-item">
                <div class="item-label">所在地</div>
                <div class="item-value">中国</div>
              </div>
              <div class="profile-item">
                <div class="item-label">兴趣爱好</div>
                <div class="item-value link">
                  <el-tag v-for="tag in tags" :key="tag.name" closable :type="tag.type">
                    {{ tag.name }}
                  </el-tag>
                </div>
              </div>
            </div>

            <!-- 底部按钮 -->
            <div class="profile-actions">
              <el-button class="action-btn edit-btn" @click="handleEditProfile">编辑资料</el-button>
              <el-button class="action-btn message-btn" type="primary">发消息</el-button>
            </div>
          </div>
        </el-popover>
      </div>
    </div>

    <div class="sidebar-body">
      <div
        class="sidebar-item"
        v-for="(item, index) in sidebarItems"
        :key="index"
        :class="{ active: activeRoute === item.route }"
      >
        <el-tooltip :content="item.tooltip" placement="right" effect="light">
          <span class="sidebar-icon" @click="handleRoute(item.route)">
            <el-icon>
              <component :is="item.icon"></component>
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
  <div v-if="showStatusPopup" class="custom-popup-overlay" @click="showStatusPopup = false">
    <div class="custom-popup" @click.stop>
      <div class="popup-header">
        <span class="popup-close" @click="showStatusPopup = false">×</span>
      </div>

      <div class="status-popup">
        <!-- 当前状态显示区域 -->
        <div class="current-status-section">
          <div class="status-icon large" :class="currentStatus.class"></div>
          <span class="status-text">{{ currentStatus.label }}</span>
        </div>

        <!-- 状态选择区域 -->
        <div class="status-grid-container">
          <div class="status-grid">
            <!-- 自定义状态按钮 -->
            <div class="status-item" @click="showCustomInput = !showCustomInput">
              <div class="status-icon custom-icon">
                <el-icon>
                  <Plus />
                </el-icon>
              </div>
              <span class="status-text">自定义</span>
            </div>

            <!-- 所有状态选项 -->
            <div
              v-for="status in allStatuses"
              :key="status.id"
              class="status-item"
              :class="{ active: currentStatus.id === status.id }"
              @click="setUserStatus(status)"
            >
              <div class="status-icon" :class="status.class"></div>
              <span class="status-text">{{ status.label }}</span>
            </div>
          </div>
        </div>

        <!-- 自定义状态输入区域 (条件显示) -->
        <div v-if="showCustomInput" class="custom-status-input">
          <el-input v-model="customStatusText" placeholder="设置自定义状态" clearable @keyup.enter="setCustomStatus">
            <template #append>
              <el-button @click="setCustomStatus">确定</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="showEditProfileDialog"
    title="编辑资料"
    width="500px"
    :close-on-click-modal="false"
    custom-class="edit-profile-dialog"
  >
    <div class="edit-profile-container">
      <!-- 头像编辑区域 -->
      <div class="avatar-edit-section">
        <div class="avatar-wrapper">
          <img :src="userAvatar || ''" alt="用户头像" class="edit-avatar" />
          <div class="avatar-overlay">
            <el-icon><Plus /></el-icon>
          </div>
        </div>
      </div>

      <!-- 表单区域 -->
      <el-form :model="profileForm" label-width="70px" class="profile-form">
        <el-form-item label="昵称">
          <el-input v-model="profileForm.nickname" maxlength="36">
            <template #append>
              <span class="input-counter">{{ profileForm.nickname.length }}/36</span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="个性签名">
          <el-input
            v-model="profileForm.signature"
            type="textarea"
            :rows="2"
            maxlength="80"
            show-word-limit
            resize="none"
          ></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-select v-model="profileForm.gender" placeholder="请选择">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
            v-model="profileForm.birthday"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="国家">
          <el-select v-model="profileForm.country" placeholder="请选择">
            <el-option label="中国" value="china"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="省份">
          <el-select v-model="profileForm.province" placeholder="请选择" :disabled="profileForm.country !== 'china'">
            <el-option label="请选择" value=""></el-option>
            <el-option
              v-for="province in provinces"
              :key="province.value"
              :label="province.label"
              :value="province.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地区">
          <el-select v-model="profileForm.city" placeholder="请选择" :disabled="!profileForm.province">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="city in cities" :key="city.value" :label="city.label" :value="city.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showEditProfileDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// 脚本部分保持不变
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserInfoStore } from '@/store/user.js'
import { Plus, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserInfoStore()

// 计算当前活动路由
const activeRoute = computed(() => {
  return route.path
})
const tags = ref([
  { name: 'Tag 1', type: 'primary' },
  { name: 'Tag 2', type: 'success' },
  { name: 'Tag 3', type: 'info' },
  { name: 'Tag 4', type: 'warning' },
  { name: 'Tag 5', type: 'danger' },
])
// 侧边栏项目数据
const sidebarItems = ref([
  { icon: 'ChatDotRound', badge: false, route: '/main/chat', tooltip: '聊天' },
  { icon: 'User', badge: false, route: '/main/friend', tooltip: '联系人' },
  { icon: 'PictureFilled', badge: false, route: '/main/moments', tooltip: '朋友圈' },
])

// 路由跳转处理
const handleRoute = (path) => {
  router.push(path)
}

// 用户状态相关
const showStatusPopup = ref(false)
const customStatusText = ref('')
const showCustomInput = ref(false)

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

// 当前用户状态
const currentStatus = ref(allStatuses.value[0])

// 设置用户状态
const setUserStatus = (status) => {
  currentStatus.value = status
  showStatusPopup.value = false
  showCustomInput.value = false

  // 这里可以添加将状态保存到后端的逻辑
  // 例如：updateUserStatus(userStore.userInfo.id, status.id)
}

// 设置自定义状态
const setCustomStatus = () => {
  if (customStatusText.value.trim()) {
    const newStatus = {
      id: 'custom',
      label: customStatusText.value,
      class: 'status-custom',
    }
    currentStatus.value = newStatus
    customStatusText.value = ''
    showStatusPopup.value = false
    showCustomInput.value = false

    // 这里可以添加将自定义状态保存到后端的逻辑
  }
}

// 编辑资料相关
const showEditProfileDialog = ref(false)
const userAvatar = ref('')

// 表单数据
const profileForm = ref({
  nickname: '.',
  signature: '爱在黄昏日落时',
  gender: 'male',
  birthday: '1988-01-01',
  country: 'china',
  province: '',
  city: '',
})

// 省份数据（示例数据，实际应用中可能需要从API获取）
const provinces = ref([
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广东', value: 'guangdong' },
  { label: '江苏', value: 'jiangsu' },
  { label: '浙江', value: 'zhejiang' },
  // 可以添加更多省份
])

// 城市数据（根据选择的省份动态变化）
const cities = computed(() => {
  const provinceCities = {
    beijing: [{ label: '北京市', value: 'beijing' }],
    shanghai: [{ label: '上海市', value: 'shanghai' }],
    guangdong: [
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
      { label: '珠海', value: 'zhuhai' },
    ],
    jiangsu: [
      { label: '南京', value: 'nanjing' },
      { label: '苏州', value: 'suzhou' },
      { label: '无锡', value: 'wuxi' },
    ],
    zhejiang: [
      { label: '杭州', value: 'hangzhou' },
      { label: '宁波', value: 'ningbo' },
      { label: '温州', value: 'wenzhou' },
    ],
  }

  return profileForm.value.province ? provinceCities[profileForm.value.province] || [] : []
})

// 监听省份变化，重置城市选择
watch(
  () => profileForm.value.province,
  () => {
    profileForm.value.city = ''
  },
)

// 打开编辑资料弹窗
const openEditProfileDialog = () => {
  // 这里可以从用户数据中加载当前信息
  // profileForm.value = { ...userStore.userInfo }
  showEditProfileDialog.value = true
}

// 保存用户资料
const saveProfile = () => {
  // 这里添加保存逻辑，例如调用API更新用户信息
  console.log('保存用户资料:', profileForm.value)

  // 模拟保存成功
  ElMessage.success('资料保存成功')
  showEditProfileDialog.value = false

  // 实际应用中，这里应该调用API保存数据
  // await updateUserProfile(profileForm.value)
}

// 修改编辑资料按钮的点击事件
const handleEditProfile = () => {
  openEditProfileDialog()
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

        &.status-busy {
          background-color: #f44336;
        }

        &.status-dnd {
          background-color: #f44336;
        }

        &.status-invisible {
          background-color: #9e9e9e;
        }

        &.status-happy {
          background-color: #ffeb3b;
        }

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

  .sidebar-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;
    flex: 1;

    .sidebar-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        background-color: #e0e0e0;
      }

      &.active {
        background-color: #e6f7ff;

        .sidebar-icon {
          color: #1890ff; // 选中时图标变为蓝色
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

      .sidebar-icon {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.45); // 透明度颜色

        .el-icon {
          font-size: 20px;
        }
      }
    }
  }

  .sidebar-footer {
    margin-bottom: 20px;
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
        color: rgba(0, 0, 0, 0.45); // 透明度颜色

        .el-icon {
          font-size: 20px;
        }
      }
    }
  }
}

// 自定义弹窗样式
.custom-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.custom-popup {
  width: 400px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: popup-fade 0.2s ease-out;
}

@keyframes popup-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-header {
  padding: 10px 15px;
  background-color: #66b0ff;
  display: flex;
  justify-content: right;
  align-items: center;

  .popup-close {
    color: white;
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
  }
}

.status-popup {
  border-radius: 0 0 8px 8px;
  overflow: hidden;

  .current-status-section {
    padding: 30px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #66b0ff, #96c8ff);
    position: relative;

    .status-icon.large {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-bottom: 10px;
      background-color: #4caf50;
      position: relative;
      z-index: 1;

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

    .status-text {
      font-size: 16px;
      font-weight: 500;
      color: white;
      position: relative;
      z-index: 1;
    }
  }

  .status-grid-container {
    background: linear-gradient(to bottom, #96c8ff, #e1ecff);

    padding: 15px;

    .status-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 8px;
      padding: 15px;
    }
  }

  .status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #b7d0eb;
    }

    &.active {
      background-color: #0099ff;
    }

    .status-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.custom-icon {
        background-color: #e0e0e0;
        color: #666;
      }

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

      &.status-battery {
        background-color: #8bc34a;
      }

      &.status-music {
        background-color: #ff5722;
      }

      &.status-working {
        background-color: #ff9800;
      }

      &.status-travel {
        background-color: #03a9f4;
      }

      &.status-empty {
        background-color: #9c27b0;
      }

      &.status-steps {
        background-color: #ffeb3b;
      }

      &.status-weather {
        background-color: #00bcd4;
      }

      &.status-crush {
        background-color: #e91e63;
      }

      &.status-custom {
        background-color: #2196f3;
      }
    }

    .status-text {
      font-size: 12px;
      color: #333;
      text-align: center;
    }
  }

  .custom-status-input {
    padding: 15px;
    background-color: #f0f0f0;
  }
}

// 用户资料弹出框样式
:deep(.user-profile-popover) {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .el-popper__arrow {
    display: none;
  }
}

.user-profile-card {
  padding: 0;

  .profile-header {
    display: flex;
    padding: 16px;
    border-radius: 8px 8px 0 0;

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

      .gender-icon {
        position: absolute;
        right: -4px;
        top: -4px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #42a5f5;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
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
}

// 修改用户资料卡片中的编辑按钮点击事件
.user-profile-card {
  // ... 现有样式 ...

  .profile-actions {
    // ... 现有样式 ...

    .action-btn {
      // ... 现有样式 ...

      &.edit-btn {
        margin-right: 8px;
      }

      &.message-btn {
        background-color: #1890ff;
      }
    }
  }
}

// 编辑资料弹窗样式
:deep(.edit-profile-dialog) {
  .el-dialog__header {
    margin: 0;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 500;
    }

    .el-dialog__headerbtn {
      top: 15px;
    }
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    padding: 10px 20px;
    border-top: 1px solid #eee;
  }
}

.edit-profile-container {
  .avatar-edit-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .avatar-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;

      .edit-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: #e0e0e0;
      }

      .avatar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;

        .el-icon {
          font-size: 24px;
          color: white;
        }
      }

      &:hover .avatar-overlay {
        opacity: 1;
      }
    }
  }

  .profile-form {
    .input-counter {
      font-size: 12px;
      color: #999;
    }

    .el-form-item {
      margin-bottom: 15px;
    }
  }
}
</style>
