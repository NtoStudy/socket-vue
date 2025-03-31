<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { chatRoomInquire, groupAddChatRoom, getUserInfoByNumber, addFriend } from '@/api/index.js'
//TODO 搜索用户和群聊如果已经有好友则显示发信息
const tabs = ref(['用户', '群聊'])
const activeTab = ref('用户')
const recommendFriendChats = ref(null)
const recommendGroupChats = ref(null)
const inputFriend = ref('')
const loading = ref(false)

const changeTab = (tab) => {
  activeTab.value = tab
  recommendFriendChats.value = null
  recommendGroupChats.value = null
  inputFriend.value = ''
}

const selectFriendNumber = async () => {
  if (!inputFriend.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }

  loading.value = true
  try {
    if (activeTab.value === '用户') {
      const res = await getUserInfoByNumber(inputFriend.value)
      if (res.data.code === 200) {
        recommendFriendChats.value = res.data.data || null
        if (!res.data.data) {
          ElMessage.error('用户不存在')
        }
      }
    } else {
      const res = await chatRoomInquire(inputFriend.value)
      recommendGroupChats.value = res.data.data || null
      if (!res.data.data) {
        ElMessage.error('群聊不存在')
      }
    }
  } catch (error) {
    ElMessage.error('搜索失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAddFriend = async (user) => {
  try {
    const res = await addFriend(user.number)
    if (res.data.code === 200) {
      ElMessage.success('好友请求已发送')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('添加好友失败')
  }
}

const handleAddGroup = async (group) => {
  try {
    const res = await groupAddChatRoom(group.groupNumber)
    if (res.data.code === 200) {
      ElMessage.success('加群请求已发送')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('加入群聊失败')
  }
}

const props = defineProps({
  isAddDialogVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const handleClose = () => {
  activeTab.value = '用户'
  inputFriend.value = ''
  recommendFriendChats.value = null
  recommendGroupChats.value = null
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

    <el-input
      v-model="inputFriend"
      placeholder="输入号码查询用户/群聊"
      :prefix-icon="Search"
      clearable
      @keyup.enter="selectFriendNumber"
    >
      <template #append>
        <el-button @click="selectFriendNumber">搜索</el-button>
      </template>
    </el-input>

    <el-scrollbar height="400px" v-loading="loading">
      <template v-if="!loading">
        <el-empty v-if="activeTab === '用户' && recommendFriendChats === null" description="搜索好友" />
        <el-empty v-if="activeTab === '群聊' && recommendGroupChats === null" description="搜索群聊" />

        <div
          v-if="recommendFriendChats && activeTab === '用户'"
          class="chat-item"
          @click="handleAddFriend(recommendFriendChats)"
        >
          <div class="chat-avatar">
            <img :src="recommendFriendChats.avatarUrl" alt="头像" />
          </div>
          <div class="chat-content">
            <span class="chat-title"> {{ recommendFriendChats.userName }}({{ recommendFriendChats.number }}) </span>
          </div>
          <el-button>加好友</el-button>
        </div>

        <div
          v-if="recommendGroupChats && activeTab === '群聊'"
          class="chat-item"
          @click="handleAddGroup(recommendGroupChats)"
        >
          <div class="chat-avatar">
            <img :src="recommendGroupChats.avatarUrl" alt="群头像" />
          </div>
          <div class="chat-content">
            <span class="chat-title"> {{ recommendGroupChats.roomName }}({{ recommendGroupChats.groupNumber }}) </span>
          </div>
          <el-button>加群</el-button>
        </div>
      </template>
    </el-scrollbar>
  </el-dialog>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  div {
    cursor: pointer;
    color: #666;
    font-size: 16px;
    padding-bottom: 5px;

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
  margin-top: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }

  .chat-avatar {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
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
}
</style>
