<template>
  <div class="sidebar">
    <div class="sidebar-search">
      <el-input :prefix-icon="Search" :placeholder="searchPlaceholder" style="width: 80%" />
      <el-popover placement="bottom" trigger="click">
        <template #reference>
          <el-button :icon="Plus" />
        </template>
        <el-menu>
          <!-- 修改点击事件处理 -->
          <el-menu-item @click="handleCreateGroup" style="height: 30px">
            <el-icon>
              <ChatRound />
            </el-icon>
            创建群聊
          </el-menu-item>
          <el-menu-item @click="handleAddContact" style="height: 30px">
            <el-icon>
              <User />
            </el-icon>
            加好友/群
          </el-menu-item>
        </el-menu>
      </el-popover>
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
import { ref } from 'vue'
import search from '@/view/friend/slider/search/index.vue'
import createGroup from '@/view/friend/slider/createGroup/index.vue'

// 定义属性
const props = defineProps({
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

// 处理创建群聊点击事件
const handleCreateGroup = () => {
  try {
    isCreateDialogVisible.value = true
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
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  box-sizing: border-box;
  width: 260px;

  .sidebar-search {
    display: flex;
    padding: 10px;
    justify-content: space-around;
  }
}
</style>
