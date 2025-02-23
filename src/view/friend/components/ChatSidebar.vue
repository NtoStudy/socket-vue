<template>
  <div class="sidebar">
    <div class="sidebar-search">
      <el-input style="width: 80%" placeholder="搜索">
        <template #prepend>
          <el-button :icon="Search" />
        </template>
      </el-input>
      <el-popover
        placement="bottom"
        trigger="click"
      >
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
      <div
        class="sidebar-item"
        :class="{ active: selectedMenu === 'friend' }"
        @click="selectMenu('friend')"
      >
        <div class="item-avatar">
          <img src="https://example.com/friend-notification-icon.png" alt="friend notification" />
          <span>好友通知</span>
        </div>
        <span class="messageCount" v-if="friendCount!==0">{{friendCount}}</span>
      </div>
      <div
        class="sidebar-item"
        :class="{ active: selectedMenu === 'group' }"
        @click="selectMenu('group')"
      >
        <div class="item-avatar">
          <img src="https://example.com/friend-notification-icon.png" alt="friend notification" />
          <span>群通知</span>
        </div>
        <span class="messageCount" v-if="groupCount!==0">{{groupCount}}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFriendManagerStore } from '@/store/friendManager.js'
import { ChatRound, Plus, Search, User } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { chatRoomNumber, friendNumber } from '@/api/notification/index.js'

const friendCount = ref()
const groupCount = ref()


const store = useFriendManagerStore()

const selectedMenu = ref('friend')

const selectMenu = (menu) => {
  store.setSelectedMenu(menu)
}

const isMenuVisible = ref(false)

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}

const handleRequestCount = async () => {
  const resFriend = await friendNumber()
  friendCount.value = resFriend.data.data
  const resChatRoom = await chatRoomNumber()
  groupCount.value = resChatRoom.data.data
}

const createGroupChat = () => {
  console.log('创建群聊')
  toggleMenu() // 关闭菜单
}

const addContactOrGroup = () => {
  console.log('加好友/群')
  toggleMenu() // 关闭菜单
}

onMounted(()=>{
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
      transition: transform 0.2s, box-shadow 0.2s;

      .item-avatar{
        display: flex;
        align-items: center;
      }
      &:hover {
        transform: translateY(-2px);
      }

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

      .messageCount{
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

.el-menu {
  border-right: #f0f0f0;
}
</style>
