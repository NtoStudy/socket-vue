<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getUserInfoByNumber } from '@/api/modules/user.js'
import { ElMessage } from 'element-plus'
import { chatRoomInquire, groupAddChatRoom } from '@/api/modules/chatRoom.js'
import { addFriend } from '@/api/modules/friend.js'

const tabs = ref(['用户', '群聊'])
const activeTab = ref('用户')
const recommendFriendChats = ref()
const recommendGroupChats = ref()
const inputFriend = ref('')

/**
 * 切换标签页的函数
 * @param {String} tab - 要激活的标签页
 */
const changeTab = (tab) => {
  activeTab.value = tab
  // 当切换到用户标签页时，重置群聊数据和输入框
  if (activeTab.value === '用户') {
    recommendGroupChats.value = null
    inputFriend.value = ''
  }
  // 当切换到群聊标签页时，重置好友数据和输入框
  if (activeTab.value === '群聊') {
    recommendFriendChats.value = null
    inputFriend.value = ''
  }
}

/**
 * 查询用户或群聊的函数
 */
const selectFriendNumber = async () => {
  // 根据活动标签页查询用户或群聊
  if (activeTab.value === '用户') {
    const res = await getUserInfoByNumber(inputFriend.value)
    if (res.data.code === 200) {
      recommendFriendChats.value = res.data.data
      // 如果查询结果为空，显示错误提示
      if (res.data.data === null) {
        ElMessage.error('用户不存在')
      }
    }
  }
  if (activeTab.value === '群聊') {
    const res = await chatRoomInquire(inputFriend.value)
    recommendGroupChats.value = res.data.data
    // 如果查询结果为空，显示错误提示
    if (res.data.data === null) {
      ElMessage.error('用户不存在')
    }
  }
}

/**
 * 添加好友的函数
 */
const handleAddFriend = async () => {
  const res = await addFriend(inputFriend.value)
  if (res.data.code === 200) {
    ElMessage.success('请求已发送')
  }
}

/**
 * 添加群聊的函数
 */
const handleAddGroup = async () => {
  const res = await groupAddChatRoom(inputFriend.value)
  if (res.data.code === 200) {
    ElMessage.success('请求已发送')
  }
}

const props = defineProps({
  isAddDialogVisible: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])

/**
 * 关闭对话框的函数
 */
const handleClose = () => {
  emit('close', false)
}
</script>

<template>
  <el-dialog
    title="全网搜索"
    :model-value="props.isAddDialogVisible"
    width="50%"
    @close="handleClose"
    :close-on-click-modal="false"
  >
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
        <el-button v-if="!(recommendFriendChats.isUser || recommendFriendChats.isContainer)">加好友</el-button>
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
</template>

<style lang="scss" scoped>
// 标签页样式
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
</style>
