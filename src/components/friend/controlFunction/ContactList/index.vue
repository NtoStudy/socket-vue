<template>
  <div class="contact-list">
    <!-- 分类标签 -->
    <div class="category-box">
      <div class="category-tabs">
        <div class="tab" :class="{ active: activeTab === 'friends' }" @click="switchTab('friends')">好友</div>
        <div class="tab" :class="{ active: activeTab === 'groups' }" @click="switchTab('groups')">群聊</div>
      </div>
    </div>

    <!-- 好友列表视图 -->
    <div v-if="activeTab === 'friends'">
      <div v-for="(item, index) in friendItems" :key="index">
        <!-- 分组标题 -->
        <div class="contact-item" @click="toggleGroup(item)" @contextmenu.prevent="showContextMenu($event, item)">
          <div class="item-left">
            <el-icon class="expand-icon" :class="{ 'is-expanded': expandedGroups.includes(item.groupId) }">
              <ArrowRight />
            </el-icon>
            <span class="contact-name">{{ item.groupName }}</span>
          </div>
          <div class="message-count" v-if="item.memberCount">
            {{ item.memberCount }}
          </div>
        </div>

        <!-- 好友列表 -->
        <div class="friend-list" v-if="expandedGroups.includes(item.groupId)">
          <div
            v-for="(friend, friendIndex) in friendGroupMap[item.groupId] || []"
            :key="friendIndex"
            class="friend-item"
            @click="selectFriend(friend)"
          >
            <div class="friend-avatar">
              <img :src="friend.avatar || ''" alt="头像" />
              <div class="status-dot" :class="getStatusClass(friend.status)"></div>
            </div>
            <div class="friend-info">
              <div class="friend-name">{{ friend.username }}</div>
              <div class="friend-signature">{{ friend.signature || '这个人很懒，什么都没留下' }}</div>
            </div>
          </div>
          <div class="empty-tip" v-if="!friendGroupMap[item.groupId] || friendGroupMap[item.groupId].length === 0">
            该分组下暂无好友
          </div>
        </div>
      </div>
    </div>

    <!-- 群聊列表视图 -->
    <div v-else>
      <div class="contact-item" v-for="(item, index) in groupItems" :key="index">
        <div class="item-left">
          <span class="expand-icon">></span>
          <span class="contact-name">{{ item.name }}</span>
        </div>
        <div class="message-count" v-if="item.count">
          {{ item.count }}
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-show="contextMenuVisible"
      class="context-menu"
      :style="{ top: contextMenuTop + 'px', left: contextMenuLeft + 'px' }"
    >
      <div class="menu-item" @click="handleAddGroup">
        <el-icon><Plus /></el-icon>
        <span>添加分组</span>
      </div>
      <div class="menu-item" @click="handleRenameGroup">
        <el-icon><Edit /></el-icon>
        <span>重命名该组</span>
      </div>
      <div class="menu-item" @click="handleDeleteGroup">
        <el-icon><Delete /></el-icon>
        <span>删除分组</span>
      </div>
    </div>

    <!-- 分组对话框 -->
    <el-dialog
      v-model="groupDialogVisible"
      :title="dialogType === 'add' ? '添加分组' : '重命名分组'"
      width="30%"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-content">
        <el-input v-model="groupName" placeholder="填写分组" maxlength="20" show-word-limit />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelGroupDialog" plain>取消</el-button>
          <el-button type="primary" @click="confirmGroupDialog" :disabled="!groupName.trim()">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ArrowRight, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getFriendGroupFriendList } from '@/api/friendGroups.js'
import { getUsersInfoById } from '@/api/user.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 状态管理
const activeTab = ref('friends')
const expandedGroups = ref([])
const friendGroupMap = reactive({})

// 右键菜单状态
const contextMenuVisible = ref(false)
const contextMenuTop = ref(0)
const contextMenuLeft = ref(0)
const currentGroup = ref(null)

// 对话框状态
const groupDialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'rename'
const groupName = ref('')

// 定义属性
const props = defineProps({
  friendItems: {
    type: Array,
    default: () => [],
  },
  groupItems: {
    type: Array,
    default: () => [],
  },
})

// 定义事件
const emit = defineEmits(['tabChange', 'selectFriend', 'addGroup', 'renameGroup', 'deleteGroup'])

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab
  emit('tabChange', tab)
}

// 切换分组展开/收起状态
const toggleGroup = (group) => {
  const groupId = group.groupId
  const index = expandedGroups.value.indexOf(groupId)

  if (index === -1) {
    expandedGroups.value.push(groupId)
    // 如果该分组还没有加载过好友，则加载好友列表
    if (!friendGroupMap[groupId]) {
      loadFriendGroupList(groupId)
    }
  } else {
    expandedGroups.value.splice(index, 1)
  }
}

// 选择好友
const selectFriend = (friend) => {
  emit('selectFriend', friend)
}

// 获取状态样式类
const getStatusClass = (status) => {
  const statusMap = {
    在线: 'status-online',
    离开: 'status-away',
    忙碌: 'status-busy',
    隐身: 'status-invisible',
  }
  return statusMap[status] || 'status-offline'
}

// 加载好友分组列表
const loadFriendGroupList = async (groupId) => {
  try {
    // 初始化该分组的好友列表为空数组
    friendGroupMap[groupId] = []

    const res = await getFriendGroupFriendList(groupId)
    if (res.data && res.data.data) {
      // 使用 Promise.all 等待所有请求完成
      const promises = res.data.data.map(async (friend) => {
        const userRes = await getUsersInfoById(friend.friendId)
        if (userRes.data && userRes.data.data) {
          return userRes.data.data
        }
        return null
      })

      // 等待所有请求完成后一次性更新好友列表
      const friendsData = await Promise.all(promises)
      friendGroupMap[groupId] = friendsData.filter((item) => item !== null)
    }
  } catch (error) {
    console.error('加载好友列表失败:', error)
  }
}

// 显示右键菜单
const showContextMenu = (event, group) => {
  event.preventDefault()
  contextMenuTop.value = event.clientY
  contextMenuLeft.value = event.clientX
  contextMenuVisible.value = true
  currentGroup.value = group
}

// 处理删除分组
const handleDeleteGroup = () => {
  if (!currentGroup.value) return

  ElMessageBox.confirm(`确定要删除分组 "${currentGroup.value.groupName}" 吗？`, '删除分组', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('deleteGroup', currentGroup.value)
      contextMenuVisible.value = false
    })
    .catch(() => {
      contextMenuVisible.value = false
    })
}

// 点击其他地方关闭右键菜单
const handleClickOutside = () => {
  contextMenuVisible.value = false
}

// 处理添加分组
const handleAddGroup = () => {
  contextMenuVisible.value = false
  dialogType.value = 'add'
  groupName.value = ''
  groupDialogVisible.value = true
}

// 处理重命名分组
const handleRenameGroup = () => {
  if (!currentGroup.value) return

  contextMenuVisible.value = false
  dialogType.value = 'rename'
  groupName.value = currentGroup.value.groupName
  groupDialogVisible.value = true
}

// 确认对话框操作
const confirmGroupDialog = () => {
  if (!groupName.value.trim()) {
    ElMessage.warning('分组名称不能为空')
    return
  }

  if (dialogType.value === 'add') {
    emit('addGroup', groupName.value.trim())
  } else {
    emit('renameGroup', {
      groupId: currentGroup.value.groupId,
      newName: groupName.value.trim(),
    })
  }

  groupDialogVisible.value = false
  groupName.value = ''
}

// 取消对话框操作
const cancelGroupDialog = () => {
  groupDialogVisible.value = false
  groupName.value = ''
}

// 添加和移除全局点击事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.contact-list {
  .category-box {
    display: flex;
    justify-content: center;
    align-items: center;

    .category-tabs {
      width: 80%;
      display: flex;
      background-color: #f9f9f9;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 15px;

      .tab {
        flex: 1;
        text-align: center;
        padding: 10px 0;
        cursor: pointer;
        font-size: 14px;
        color: #666;

        &.active {
          background-color: #fff;
          color: #0099ff;
          font-weight: 500;
        }
      }
    }
  }

  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }

    .item-left {
      display: flex;
      align-items: center;

      .expand-icon {
        margin-right: 10px;
        color: #999;
        font-size: 12px;
        transition: transform 0.3s;

        &.is-expanded {
          transform: rotate(90deg);
        }
      }

      .contact-name {
        font-size: 14px;
        color: #333;
      }
    }

    .message-count {
      font-size: 12px;
      color: #999;
    }
  }

  .friend-list {
    background-color: #f9f9f9;

    .friend-item {
      display: flex;
      align-items: center;
      padding: 10px 15px 10px 35px;
      cursor: pointer;

      &:hover {
        background-color: #f0f0f0;
      }

      .friend-avatar {
        position: relative;
        width: 40px;
        height: 40px;
        margin-right: 10px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #fff;

          &.status-online {
            background-color: #4caf50;
          }
          &.status-away {
            background-color: #ff9800;
          }
          &.status-busy {
            background-color: #f44336;
          }
          &.status-invisible {
            background-color: #9e9e9e;
          }
          &.status-offline {
            background-color: #bdbdbd;
          }
        }
      }

      .friend-info {
        flex: 1;

        .friend-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 2px;
        }

        .friend-signature {
          font-size: 12px;
          color: #999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .empty-tip {
      padding: 10px 15px 10px 35px;
      font-size: 12px;
      color: #999;
      font-style: italic;
    }
  }
}

.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 5px 0;
  min-width: 150px;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #f5f5f5;
    }

    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}

.dialog-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 10px;
}

:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 15px 20px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__body) {
  padding: 10px 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
  border-top: none;
}

:deep(.el-button) {
  min-width: 100px;
  border-radius: 4px;
}
</style>
