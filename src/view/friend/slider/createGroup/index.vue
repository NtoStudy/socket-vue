<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserInfoByNumber } from '@/api/user/index.js'
import { chatRoomCreate } from '@/api/ChatRoom/index.js'
import { getFriendList } from '@/api/friend/index.js'

// 响应式对象初始化
const selectedNumber = ref(0)
const FriendList = ref([])
const selectedFriends = ref([])

// 定义组件接收的属性
const props = defineProps({
  isCreateDialogVisible: {
    type: Boolean,
    default: false,
  },
})
// 定义组件发出的事件
const emit = defineEmits(['closeCreate'])
// 关闭创建群聊对话框
const handleClose = () => {
  emit('closeCreate', false)
}
// 创建群聊逻辑
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
    // 获取选中好友的userId
    const userIdsPromises = selectedFriend.map((friend) =>
      getUserInfoByNumber(friend.number).then((res) => res.data.data.userId),
    )
    // 等待所有请求完成
    const userIds = await Promise.all(userIdsPromises)
    // 调用创建聊天室的方法
    const res = await chatRoomCreate(value, userIds)
    if (res.data.code === 200) {
      ElMessage.success('群聊创建成功')
      handleClose()
    }
    ElMessage({
      type: 'success',
      message: '群聊创建成功',
    })
  })
}
// 切换好友选中状态
const toggleSelection = (friend) => {
  friend.selected = !friend.selected
  handleSelectedList()
}
// 更新已选好友列表
const handleSelectedList = () => {
  selectedFriends.value = FriendList.value.filter((friend) => friend.selected)
}
// 获取好友列表
const handleFriendList = async () => {
  const res = await getFriendList()
  FriendList.value = res.data.data.map((friend) => ({
    ...friend,
    selected: false,
  }))
}

// 暴露给父组件的方法
defineExpose({
  handleFriendList,
})
</script>

<template>
  <el-dialog :model-value="props.isCreateDialogVisible" @close="handleClose" :close-on-click-modal="false">
    <div class="create-group-container">
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
          <el-button @click="handleClose">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
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
</style>
