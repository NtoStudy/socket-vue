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
            <el-icon><ChatRound /></el-icon>
            创建群聊
          </el-menu-item>
          <el-menu-item @click="addContactOrGroup" style="height: 30px">
            <el-icon><User /></el-icon>
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

    <!-- 搜索好友、搜索群 -->
    <el-dialog title="全网搜索" v-model="isAddDialogVisible" width="50%" :close-on-click-modal="false">
      <div class="tabs">
        <div v-for="tab in tabs" :key="tab" :class="{ active: activeTab === tab }" @click="changeTab(tab)">
          {{ tab }}
        </div>
      </div>
      <el-input :prefix-icon="Search" placeholder="输入号码查询用户/群聊" v-model="inputFriend">
        <template #append>
          <el-button @click="selectFriendNumber">搜索</el-button>
        </template>
      </el-input>

      <el-scrollbar height="400px">
        <el-empty v-if="activeTab === '用户' && recommendFriendChats === null" description="搜索好友" />
        <el-empty v-if="activeTab === '群聊' && recommendGroupChats === null" description="搜索群聊" />
        <div class="chat-item" v-if="recommendFriendChats" @click="handleAddFriend(recommendFriendChats)">
          <div class="chat-avatar">
            <img :src="recommendFriendChats.avatarUrl" alt="avatar" />
          </div>
          <div class="chat-content">
            <span class="chat-title">{{ recommendFriendChats.userName }}({{ recommendFriendChats.number }})</span>
          </div>
          <el-button v-if="!recommendFriendChats.isUser">加好友</el-button>
          <el-button v-else>发消息</el-button>
        </div>

        <div class="chat-item" v-if="recommendGroupChats" @click="handleAddGroup(recommendGroupChats)">
          <div class="chat-avatar">
            <img :src="recommendGroupChats.avatarUrl" alt="avatar" />
          </div>
          <div class="chat-content">
            <span class="chat-title">{{ recommendGroupChats.roomName }}({{ recommendGroupChats.groupNumber }})</span>
          </div>
          <el-button v-if="!recommendGroupChats.isContainer">加群</el-button>
          <el-button v-else>发消息</el-button>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!-- 创建群聊 -->
    <el-dialog v-model="isCreateDialogVisible" :close-on-click-modal="false">
      <div class="create-group-container">
        <!-- 左半边：朋友列表 -->
        <div class="friend-list">
          <el-input :prefix-icon="Search" placeholder="输入号码查询好友" />
          <el-scrollbar height="400px">
            <div class="chat-item" v-for="(friend, index) in FriendList" :key="index" @click="toggleSelection(friend)">
              <div class="chat-avatar">
                <img :src="friend.avatarUrl" alt="avatar" />
              </div>
              <div class="chat-content">
                <span class="chat-title">{{ friend.username }}({{ friend.number }})</span>
              </div>
              <div class="checkbox-circle" :class="{ selected: friend.selected }"></div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 右半边：已勾选列表 -->
        <div class="selected-list">
          <div class="selected-title">
            <span class="selected-title-text">创建群聊</span>
            <span class="selected-title-text">已选 {{ selectedNumber }} 个好友</span>
          </div>
          <div class="scrollBar">
            <div class="chat-item" v-for="(friend, index) in selectedFriends" :key="index">
              <div class="chat-avatar">
                <img :src="friend.avatarUrl" alt="avatar" />
              </div>
              <div class="chat-content">
                <span class="chat-title">{{ friend.username }}({{ friend.number }})</span>
              </div>
            </div>
          </div>
          <div class="confirmButton">
            <el-button type="primary" @click="handleCreateGroup">确定</el-button>
            <el-button @click="isCreateDialogVisible = false">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
//TODO处理当前页面发消息跳转到消息页面的问题
import { useFriendManagerStore } from '@/store/friendManager.js'
import { ChatRound, Plus, Search, User } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { chatRoomNumber, friendNumber } from '@/api/notification/index.js'
import { getUserInfoByNumber } from '@/api/user/index.js'
import { chatRoomCreate, chatRoomInquire, groupAddChatRoom } from '@/api/ChatRoom/index.js'
import { addFriend, getFriendList } from '@/api/friend/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'

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
const selectedFriends = ref([])
const selectedNumber = ref(0)
const changeTab = (tab) => {
  activeTab.value = tab
  if (activeTab.value === '用户') {
    recommendGroupChats.value = null

    inputFriend.value = ''
  }
  if (activeTab.value === '群聊') {
    recommendFriendChats.value = null

    inputFriend.value = ''
  }
}
const selectFriendNumber = async () => {
  if (activeTab.value === '用户') {
    const res = await getUserInfoByNumber(inputFriend.value)
    console.log(res.data)
    if (res.data.code === 200) {
      recommendFriendChats.value = res.data.data
      if (res.data.data === null) {
        ElMessage.error('用户不存在')
      }
    }
  }
  if (activeTab.value === '群聊') {
    const res = await chatRoomInquire(inputFriend.value)
    recommendGroupChats.value = res.data.data
    console.log(recommendGroupChats.value)
    if (res.data.data === null) {
      ElMessage.error('用户不存在')
    }
  }
}
const selectMenu = (menu) => {
  store.setSelectedMenu(menu)
}
const handleAddFriend = async () => {
  const res = await addFriend(inputFriend.value)
  if (res.data.code === 200) {
    ElMessage.success('请求已发送')
  }
}
const handleAddGroup = async () => {
  const res = await groupAddChatRoom(inputFriend.value)
  if (res.data.code === 200) {
    ElMessage.success('请求已发送')
  }
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
  isCreateDialogVisible.value = true
  toggleMenu() // 关闭菜单
  handleFriendList()
}
const addContactOrGroup = () => {
  toggleMenu() // 关闭菜单
  isAddDialogVisible.value = true // 打开对话框
}
const handleFriendList = async () => {
  const res = await getFriendList()

  FriendList.value = res.data.data.map((friend) => ({
    ...friend,
    selected: false,
  }))
}
const toggleSelection = (friend) => {
  friend.selected = !friend.selected
  handleSelectedList()
}
const handleSelectedList = () => {
  selectedFriends.value = FriendList.value.filter((friend) => friend.selected)
  console.log(selectedFriends.value)
}
const handleCreateGroup = () => {
  ElMessageBox.prompt('请输入群聊名称', {
    confirmButtonText: '创建',
    cancelButtonText: '取消',
  }).then(async ({ value }) => {
    const selectedFriend = selectedFriends.value

    if (!selectedFriend.length) {
      ElMessage.error('请选择至少一个好友')
      return
    }
    if (!value) {
      ElMessage.error('请输入群聊名称')
      return
    }
    const userIdsPromises = selectedFriend.map((friend) =>
      getUserInfoByNumber(friend.number).then((res) => res.data.data.userId),
    )

    // 等待所有请求完成
    const userIds = await Promise.all(userIdsPromises)

    // 调用创建聊天室的方法
    const res = await chatRoomCreate(value, userIds)
    console.log(res.data)
    if (res.data.code === 200) {
      ElMessage.success('群聊创建成功')
      isCreateDialogVisible.value = false
    }
    ElMessage({
      type: 'success',
      message: '群聊创建成功',
    })
  })
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

  .el-menu {
    border-right: #f0f0f0;
  }

  .tabs {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    div {
      cursor: pointer;
      color: #666;
      font-size: 16px;

      &.active {
        color: #0099ff;
        border-bottom: 2px solid #0099ff;
      }
    }
  }

  .chat-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      box-shadow 0.2s;

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

  .create-group-container {
    display: flex;
    width: 100%;

    .friend-list {
      width: 50%;
      padding: 20px;
      border-right: 1px solid #ccc;

      .el-scrollbar {
        height: 400px;
        overflow-y: auto;

        .chat-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          cursor: pointer;

          .chat-avatar img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .chat-content {
            flex: 1;
          }

          .checkbox-circle {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #999;
            margin-left: 10px;
            cursor: pointer;

            &.selected {
              background-color: #409eff;
              border-color: #409eff;
            }
          }
        }
      }
    }

    .selected-list {
      width: 50%;
      padding: 20px;

      .selected-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        font-size: 16px;
        color: #303133;

        .selected-title-text {
          font-weight: bold;
        }
      }

      .scrollBar {
        height: 400px;
        overflow-y: auto;

        .chat-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .chat-avatar img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .chat-content {
            flex: 1;
          }
        }
      }

      .confirmButton {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }
}
</style>
