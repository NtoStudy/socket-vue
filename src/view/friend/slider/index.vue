<template>
  <div class="sidebar">
    <div class="sidebar-search">
      <el-input :prefix-icon="Search" placeholder="搜索" style="width: 80%" />
      <el-popover placement="bottom" trigger="click">
        <template #reference>
          <el-button :icon="Plus" />
        </template>
        <el-menu>
          <el-menu-item @click="createGroupChat" style="height: 30px">
            <el-icon>
              <ChatRound />
            </el-icon>
            创建群聊
          </el-menu-item>
          <el-menu-item @click="addContactOrGroup" style="height: 30px">
            <el-icon>
              <User />
            </el-icon>
            加好友/群
          </el-menu-item>
        </el-menu>
      </el-popover>
    </div>

    <div class="sidebar-items">
      <div class="sidebar-item" :class="{ active: selectedMenu === 'friend' }" @click="selectMenu('friend')">
        <div class="item-avatar">
          <img src="https://example.com/friend-notification-icon.png" alt="friend notification" />
          <span>好友通知</span>
        </div>
        <span class="messageCount" v-if="friendCount !== 0">{{ friendCount }}</span>
      </div>
      <div class="sidebar-item" :class="{ active: selectedMenu === 'group' }" @click="selectMenu('group')">
        <div class="item-avatar">
          <img src="https://example.com/friend-notification-icon.png" alt="friend notification" />
          <span>群通知</span>
        </div>
        <span class="messageCount" v-if="groupCount !== 0">{{ groupCount }}</span>
      </div>
    </div>

    <search :isAddDialogVisible="isAddDialogVisible" @close="closeAddDialogVisible" />
    <createGroup
      :isCreateDialogVisible="isCreateDialogVisible"
      @closeCreate="closeCreateDialogVisible"
      ref="childRef"
    />
  </div>
</template>

<script setup>
//TODO处理当前页面发消息跳转到消息页面的问题
import { useFriendManagerStore } from '@/store/friendManager.js'
import { ChatRound, Plus, Search, User } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { chatRoomNumber, friendNumber } from '@/api/notification.js'
import search from './search/index.vue'
import createGroup from './createGroup/index.vue'

// 初始化未读消息数量的Ref
const friendCount = ref()
const groupCount = ref()
// 初始化Pinia store
const store = useFriendManagerStore()
// 初始化选中的菜单项
const selectedMenu = ref('friend')
// 初始化对话框可见性的Ref
const isAddDialogVisible = ref(false)
const isCreateDialogVisible = ref(false)
// 初始化子组件的Ref
const childRef = ref()
// 选择菜单项的方法
const selectMenu = (menu) => {
  store.setSelectedMenu(menu)
}
// 获取未读消息数量的方法
const handleRequestCount = async () => {
  const resFriend = await friendNumber()
  friendCount.value = resFriend.data.data
  const resChatRoom = await chatRoomNumber()
  groupCount.value = resChatRoom.data.data
}
// 创建群聊的方法
const createGroupChat = () => {
  isCreateDialogVisible.value = true
  childRef.value.handleFriendList()
}
// 添加好友或群的方法
const addContactOrGroup = () => {
  isAddDialogVisible.value = true
}
// 关闭添加对话框的方法
const closeAddDialogVisible = () => {
  isAddDialogVisible.value = false
}
// 关闭创建群聊对话框的方法
const closeCreateDialogVisible = () => {
  isCreateDialogVisible.value = false
}
// 在组件挂载时获取未读消息数量
onMounted(() => {
  handleRequestCount()
})
</script>

<style lang="scss" scoped>
.sidebar {
  width: 300px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding: 10px;

  .sidebar-search {
    display: flex;
    justify-content: space-around;
    margin-bottom: 18px;
  }

  .sidebar-items {
    display: flex;
    flex-direction: column;

    .sidebar-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition:
        transform 0.2s,
        box-shadow 0.2s;

      &.active {
        background-color: #e5e5e5;
      }

      &:hover {
        transform: translateY(-2px);
      }

      .item-avatar {
        display: flex;
        align-items: center;

        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }

        span {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
      }

      .messageCount {
        width: 18px;
        height: 18px;
        background-color: #ff4d4d;
        color: #fff;
        border-radius: 50%;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
      }
    }
  }
}
</style>
