<template>
  <Sidebar @createGroup="handleCreateGroup" @addContact="handleAddContact" >
    <!-- 通知区域 -->
    <div class="notification-section">
      <div class="notification-item" :class="{ active: selectedMenu === 'friend' }" @click="selectMenu('friend')">
        <div class="item-content">
          <span>好友通知</span>
          <span class="arrow-icon">></span>
        </div>
      </div>
      <div class="notification-item" :class="{ active: selectedMenu === 'group' }" @click="selectMenu('group')">
        <div class="item-content">
          <span>群通知</span>
          <span class="arrow-icon">></span>
        </div>
      </div>
    </div>

    <!-- 联系人列表组件 -->
    <ContactList :friendItems="friendItems" :groupItems="groupItems" @tabChange="handleTabChange" />
  </Sidebar>
</template>

<script setup>
//TODO处理当前页面发消息跳转到消息页面的问题
import { useFriendManagerStore } from '@/store/friendManager.js'
import { onMounted, ref } from 'vue'
import { chatRoomNumber, friendNumber } from '@/api/notification.js'
import Sidebar from './components/Sidebar.vue'
import ContactList from './components/ContactList.vue'

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

// 模拟好友数据
const friendItems = ref([
  { name: '我的设备', count: 1 },
  { name: '特别关心', count: '0/1' },
  { name: '干净的圈子', count: '243/435' },
  { name: '大美女', count: '0/0' },
])

// 模拟群聊数据，按照图片中的样式
const groupItems = ref([
  { name: '置顶群聊', count: 3 },
  { name: '未命名的群聊', count: 2 },
  { name: '我创建的群聊', count: 17 },
  { name: '我管理的群聊', count: 11 },
  { name: '我加入的群聊', count: 58 },
])

// 处理标签切换
const handleTabChange = (tab) => {
  console.log('当前标签:', tab)
}

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

// 处理创建群聊事件
const handleCreateGroup = () => {
  console.log('好友页面处理创建群聊')
}

// 处理添加好友/群事件
const handleAddContact = () => {
  console.log('好友页面处理添加好友/群')
}



// 在组件挂载时获取未读消息数量
onMounted(() => {
  handleRequestCount()
})
</script>

<style lang="scss" scoped>
// 通知区域样式
.notification-section {
  margin-bottom: 15px;

  .notification-item {
    background-color: #f0f0f0;
    padding: 10px 15px;
    margin-bottom: 1px;
    cursor: pointer;

    .item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 14px;
        color: #333;
      }

      .arrow-icon {
        color: #999;
      }
    }
  }
}
</style>
