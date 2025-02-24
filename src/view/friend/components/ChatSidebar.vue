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
        <span class="messageCount" v-if="friendCount!==0">{{ friendCount }}</span>
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
        <span class="messageCount" v-if="groupCount!==0">{{ groupCount }}</span>
      </div>
    </div>

    <!-- 弹出对话框 -->
    <el-dialog
      title="全网搜索"
      v-model="isAddDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="tabs">
        <div
          v-for="tab in tabs"
          :key="tab"
          :class="{ active: activeTab === tab }"
          @click="changeTab(tab)"
        >
          {{ tab }}
        </div>
      </div>
      <el-input :prefix-icon="Search" placeholder="输入号码查询用户/群聊" v-model="inputFriend">
        <template #append>
          <el-button @click="selectFriendNumber">搜索</el-button>
        </template>
      </el-input>

      <el-scrollbar height="400px">
        <el-empty v-if="activeTab === '用户' && recommendFriendChats === null " description="搜索好友" />
        <el-empty v-if="activeTab === '群聊' && recommendGroupChats === null  " description="搜索群聊" />
        <div
          class="chat-item"
          v-if="recommendFriendChats"
        >
          <div class="chat-avatar">
            <img :src="recommendFriendChats.avatarUrl" alt="avatar" />
          </div>
          <div class="chat-content">
            <span class="chat-title">{{ recommendFriendChats.username }}({{ recommendFriendChats.number }})</span>
          </div>
          <el-button @click="handleAddFriend">加好友</el-button>

        </div>

        <div
          class="chat-item"
          v-if="recommendGroupChats"
        >
          <div class="chat-avatar">
            <img :src="recommendGroupChats.avatarUrl" alt="avatar" />
          </div>
          <div class="chat-content">
            <span class="chat-title">{{ recommendGroupChats.roomName }}({{ recommendGroupChats.groupNumber }})</span>
          </div>
          <el-button @click="handleAddGroup">加群</el-button>

        </div>
      </el-scrollbar>
    </el-dialog>


    <el-dialog
      v-model="isCreateDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="createGroup">
        <el-input :prefix-icon="Search" placeholder="输入号码查询好友" />
        <el-scrollbar height="400px">
          <div
            class="chat-item"
            v-for="(friend,index) in FriendList"
            :key="index"
          >
            <div class="chat-avatar">
              <img :src="friend.avatarUrl" alt="avatar" />
            </div>
            <div class="chat-content">
              <span class="chat-title">{{ friend.username }}({{ friend.number }})</span>
            </div>

          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { useFriendManagerStore } from '@/store/friendManager.js'
import { ChatRound, Plus, Search, User } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { chatRoomNumber, friendNumber } from '@/api/notification/index.js'
import { getUserInfoByNumber } from '@/api/user/index.js'
import { chatRoomInquire } from '@/api/ChatRoom/index.js'
import { addFriend } from '@/api/friend/index.js'
import { ElMessage } from 'element-plus'

const friendCount = ref()
const groupCount = ref()

const store = useFriendManagerStore()
const isMenuVisible = ref(false)
const selectedMenu = ref('friend')
const isAddDialogVisible = ref(false)
const isCreateDialogVisible = ref(false)
const tabs = ref(['用户', '群聊'])
const inputFriend = ref('')
const activeTab = ref('用户')
const recommendFriendChats = ref()
const recommendGroupChats = ref()
const FriendList = ref([])
const changeTab = (tab) => {
  activeTab.value = tab
  if (activeTab.value === '用户') {
    recommendGroupChats.value = null

    inputFriend.value = ''
  }
  if(activeTab.value === '群聊'){
    recommendFriendChats.value = null

    inputFriend.value = ''
  }

}
const selectFriendNumber = async () => {
  if (activeTab.value === '用户') {
    const res = await getUserInfoByNumber(inputFriend.value)
    if (res.data.code === 200) {

      recommendFriendChats.value = res.data.data
    }
  }
  if (activeTab.value === '群聊') {
   const res =  await chatRoomInquire(inputFriend.value)
    console.log(res.data)
    recommendGroupChats.value = res.data.data
  }

}
const selectMenu = (menu) => {
  store.setSelectedMenu(menu)
}

const handleAddFriend = async ()=>{
  const res =  await addFriend(inputFriend.value)
  console.log(res.data)
  if(res.data.code === 200){
    ElMessage.success('请求已发送')
  }
}
const handleAddGroup = ()=>{

}
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
  isCreateDialogVisible.value = true
  toggleMenu() // 关闭菜单
}

const addContactOrGroup = () => {
  console.log('加好友/群')
  toggleMenu() // 关闭菜单
  isAddDialogVisible.value = true // 打开对话框
}


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
      transition: transform 0.2s, box-shadow 0.2s;

      .item-avatar {
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

.el-menu {
  border-right: #f0f0f0;
}

.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tabs div {
  cursor: pointer;
  color: #666;
  font-size: 16px;
}

.tabs div.active {
  color: #0099ff;
  border-bottom: 2px solid #0099ff;
}

.createGroup {
  width: 50%;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .chat-avatar {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
    }
  }

  .chat-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;

    .chat-title {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

  }

  .chat-badge {
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
</style>
