<template>
  <el-dialog
    :model-value="isCreateDialogVisible"
    @update:model-value="$emit('closeCreate', $event)"
    title="创建群聊"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="create-group-container">
      <!-- 左侧好友列表 -->
      <div class="friend-list-container">
        <div class="search-box">
          <el-input
            v-model="searchText"
            placeholder="搜索好友"
            prefix-icon="Search"
            clearable
            @clear="handleClearSearch"
            @input="handleSearch"
          />
        </div>

        <!-- 使用FriendList组件 -->
        <FriendList :friendItems="filteredGroups" @select-friend="handleSelectFriend" />
      </div>

      <!-- 右侧已选择好友 -->
      <div class="selected-friends-container">
        <div class="selected-title">已选择的好友 ({{ selectedFriends.length }})</div>
        <div class="selected-list">
          <div v-if="selectedFriends.length === 0" class="empty-selected">请从左侧选择好友</div>
          <div v-else class="selected-friends">
            <div v-for="(friend, index) in selectedFriends" :key="index" class="selected-friend-item">
              <img :src="friend.avatar || ''" alt="头像" class="selected-avatar" />
              <span class="selected-name">
                {{ friend.username }}
                <span v-if="friend.remark">({{ friend.remark }})</span>
              </span>
              <el-icon class="remove-icon" @click.stop="removeSelected(friend)">
                <Close />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleCreateGroup" :disabled="selectedFriends.length === 0">
          创建群聊
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFriendGroupList, chatRoomCreate } from '@/api/modules'
// 导入FriendList组件
import FriendList from '@/components/friend/controlFunction/ContactList/components/FriendList.vue'

// 响应式对象初始化
const searchText = ref('')
const friendGroups = ref([])
const selectedFriends = ref([])

// 定义组件接收的属性
defineProps({
  isCreateDialogVisible: {
    type: Boolean,
    default: false,
  },
})

// 定义组件发出的事件
const emit = defineEmits(['closeCreate'])

// 根据搜索文本过滤好友分组
const filteredGroups = computed(() => {
  if (!searchText.value) {
    return friendGroups.value
  }

  // 返回包含搜索文本的分组（这里只是简单过滤分组名称，实际可能需要更复杂的逻辑）
  return friendGroups.value.map((group) => ({
    ...group,
    // 这里添加一个标记，告诉FriendList组件这个分组需要展开并过滤
    shouldFilter: true,
  }))
})

// 关闭创建群聊对话框
const handleClose = () => {
  // 重置状态
  searchText.value = ''
  selectedFriends.value = []
  emit('closeCreate', false)
}

// 创建群聊逻辑
const handleCreateGroup = () => {
  if (selectedFriends.value.length === 0) {
    ElMessage.warning('请至少选择一个好友')
    return
  }

  ElMessageBox.prompt('请输入群聊名称', '创建群聊', {
    confirmButtonText: '创建',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入群聊名称',
  })
    .then(async ({ value }) => {
      if (!value.trim()) {
        ElMessage.warning('群聊名称不能为空')
        return
      }

      try {
        // 获取选中好友的userId
        const userIds = selectedFriends.value.map((friend) => friend.userId)

        // 调用创建聊天室的方法
        const res = await chatRoomCreate(value, userIds)

        if (res.data.code === 200) {
          ElMessage.success('群聊创建成功')
          handleClose()
        } else {
          ElMessage.error(res.data.message || '创建群聊失败')
        }
      } catch (error) {
        console.error('创建群聊失败:', error)
        ElMessage.error('创建群聊失败，请稍后重试')
      }
    })
    .catch(() => {
      // 用户取消输入，不做任何操作
    })
}

// 获取所有好友分组
const loadFriendGroups = async () => {
  try {
    const res = await getFriendGroupList()
    if (res.data && res.data.data) {
      friendGroups.value = res.data.data
    }
  } catch (error) {
    console.error('获取好友分组失败:', error)
  }
}
const handleSelectFriend = (friend) => {
  console.log('选中的好友:', friend) // 添加日志查看完整好友对象

  // 检查是否已经选择了该好友
  const index = selectedFriends.value.findIndex((item) => {
    // 使用更严格的比较条件
    return (
      (item.friendId && friend.friendId && item.friendId === friend.friendId) ||
      (item.userId && friend.userId && item.userId === friend.userId) ||
      (item?.userId && friend?.userId && item.userId === friend.userId)
    )
  })

  if (index === -1) {
    // 添加到已选择列表
    selectedFriends.value.push(friend)
    const username = friend.username || friend?.username || '未知用户'
    ElMessage.success(`已选择好友: ${username}`)
  } else {
    // 已经选择了，提示用户
    const username = friend.username || friend?.username || '未知用户'
    ElMessage.info(`已经选择了该好友: ${username}`)
  }
}

// 从已选择列表中移除好友
const removeSelected = (friend) => {
  const index = selectedFriends.value.findIndex((item) => {
    // 使用相同的严格比较条件
    return (
      (item.friendId && friend.friendId && item.friendId === friend.friendId) ||
      (item.userId && friend.userId && item.userId === friend.userId) ||
      (item?.userId && friend?.userId && item.userId === friend.userId)
    )
  })

  if (index !== -1) {
    const removedFriend = selectedFriends.value[index]
    selectedFriends.value.splice(index, 1)
    const username = removedFriend.username || removedFriend.users?.username || '未知用户'
    ElMessage.info(`已移除好友: ${username}`)
  }
}
// 处理搜索
const handleSearch = () => {
  // 这里可以添加搜索逻辑，如果需要的话
  console.log('搜索:', searchText.value)
}

// 清除搜索
const handleClearSearch = () => {
  searchText.value = ''
}

// 组件挂载时加载好友分组
onMounted(() => {
  loadFriendGroups()
})
</script>

<style lang="scss" scoped>
.create-group-container {
  display: flex;
  height: 400px;

  .friend-list-container {
    flex: 1;
    border-right: 1px solid #ebeef5;
    padding-right: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .search-box {
      margin-bottom: 10px;
    }
  }

  .selected-friends-container {
    width: 200px;
    padding-left: 10px;
    display: flex;
    flex-direction: column;

    .selected-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 10px;
      padding: 10px 0;
    }

    .selected-list {
      flex: 1;
      overflow-y: auto;

      .empty-selected {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #909399;
        font-size: 14px;
      }

      .selected-friends {
        .selected-friend-item {
          display: flex;
          align-items: center;
          padding: 8px;
          margin-bottom: 5px;
          background-color: #f5f5f5;
          border-radius: 4px;

          .selected-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 8px;
          }

          .selected-name {
            flex: 1;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .remove-icon {
            color: #909399;
            cursor: pointer;

            &:hover {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
