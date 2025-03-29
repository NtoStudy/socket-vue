<template>
  <div class="sidebar">
    <div class="sidebar-search">
      <el-input :prefix-icon="Search" :placeholder="searchPlaceholder" style="width: 80%" />

      <!-- 替换el-popover为自定义下拉菜单 -->
      <div class="custom-dropdown">
        <el-button :icon="Plus" @click="toggleDropdown" />
        <div class="dropdown-menu" v-show="isDropdownVisible">
          <div @click="handleCreateGroup" class="dropdown-item">
            <el-icon class="dropdown-icon">
              <ChatRound />
            </el-icon>
            <span class="dropdown-text">创建群聊</span>
          </div>
          <div @click="handleAddContact" class="dropdown-item">
            <el-icon class="dropdown-icon">
              <User />
            </el-icon>
            <span class="dropdown-text">加好友/群</span>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>

    <!-- 添加搜索和创建群聊对话框 -->
    <search v-if="isAddDialogVisible" :isAddDialogVisible="isAddDialogVisible" @close="closeAddDialogVisible" />
    <createGroup
      v-if="isCreateDialogVisible"
      :isCreateDialogVisible="isCreateDialogVisible"
      @closeCreate="closeCreateDialogVisible"
      ref="childRef"
    />
  </div>
</template>

<script setup>
import { ChatRound, Plus, Search, User } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'
import search from '@/components/common/search/index.vue'
import createGroup from '@/components/common/createGroup/index.vue'

// 定义属性
defineProps({
  searchPlaceholder: {
    type: String,
    default: '搜索',
  },
})

// 定义事件
const emit = defineEmits(['createGroup', 'addContact'])

// 初始化对话框可见性的Ref
const isAddDialogVisible = ref(false)
const isCreateDialogVisible = ref(false)
// 初始化子组件的Ref
const childRef = ref()
// 下拉菜单可见性
const isDropdownVisible = ref(false)

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.custom-dropdown')
  if (dropdown && !dropdown.contains(event.target) && isDropdownVisible.value) {
    isDropdownVisible.value = false
  }
}

// 处理创建群聊点击事件
const handleCreateGroup = () => {
  try {
    isCreateDialogVisible.value = true
    isDropdownVisible.value = false // 关闭下拉菜单
    // 安全地调用子组件方法
    if (childRef.value && typeof childRef.value.handleFriendList === 'function') {
      childRef.value.handleFriendList()
    }
    // 发出事件
    emit('createGroup')
  } catch (error) {
    console.error('创建群聊处理错误:', error)
  }
}

// 处理添加好友/群点击事件
const handleAddContact = () => {
  try {
    isAddDialogVisible.value = true
    isDropdownVisible.value = false // 关闭下拉菜单
    // 发出事件
    emit('addContact')
  } catch (error) {
    console.error('添加好友/群处理错误:', error)
  }
}

// 关闭添加对话框的方法
const closeAddDialogVisible = () => {
  isAddDialogVisible.value = false
}

// 关闭创建群聊对话框的方法
const closeCreateDialogVisible = () => {
  isCreateDialogVisible.value = false
}

// 添加和移除点击事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  box-sizing: border-box;
  width: 300px;

  .sidebar-search {
    display: flex;
    padding: 10px;
    justify-content: space-around;
  }
}

/* 自定义下拉菜单样式 */
.custom-dropdown {
  position: relative;

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 120px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 10;
    margin-top: 5px;
    padding: 5px 0;

    &::before {
      content: '';
      position: absolute;
      top: -5px;
      right: 10px;
      width: 10px;
      height: 10px;
      background-color: white;
      transform: rotate(45deg);
      box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.03);
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f5f7fa;
    }

    .dropdown-icon {
      font-size: 16px;
      margin-right: 8px;
      color: #606266;
    }

    .dropdown-text {
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
