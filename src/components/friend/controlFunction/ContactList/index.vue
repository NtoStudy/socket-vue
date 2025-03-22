<template>
  <div class="contact-list">
    <!-- 分类标签 -->
    <CategoryTabs :modelValue="activeTab" @update:modelValue="activeTab = $event" />

    <!-- 好友列表视图 -->
    <FriendList
      v-if="activeTab === 'friends'"
      :friendItems="friendItems"
      @select-friend="handleSelectFriend"
      @context-menu="showContextMenu"
    />

    <!-- 群聊列表视图 -->
    <GroupChatList v-else :groupItems="groupItems" @select-group-chat="handleSelectGroupChat" />
  </div>

  <!-- 右键菜单 -->
  <ContextMenu
    :visible="contextMenuVisible"
    :top="contextMenuTop"
    :left="contextMenuLeft"
    @add-group="handleAddGroup"
    @rename-group="handleRenameGroup"
    @delete-group="handleDeleteGroup"
  />

  <!-- 分组对话框 -->
  <GroupDialog
    v-model="groupDialogVisible"
    :type="dialogType"
    :groupName="groupName"
    @confirm="confirmGroupDialog"
    @cancel="cancelGroupDialog"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import CategoryTabs from './components/CategoryTabs.vue'
import FriendList from './components/FriendList.vue'
import GroupChatList from './components/GroupChatList.vue'
import ContextMenu from './components/ContextMenu.vue'
import GroupDialog from './components/GroupDialog.vue'

// 状态管理
const activeTab = ref('friends')

// 右键菜单状态
const contextMenuVisible = ref(false)
const contextMenuTop = ref(0)
const contextMenuLeft = ref(0)
const currentGroup = ref(null)

// 对话框状态
const groupDialogVisible = ref(false)
const dialogType = ref('add')
const groupName = ref('')

// 定义属性
defineProps({
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
const emit = defineEmits(['tabChange', 'selectFriend', 'addGroup', 'renameGroup', 'deleteGroup', 'selectGroupChat'])

// 处理标签切换
const handleTabChange = (tab) => {
  emit('tabChange', tab)
}

// 监听标签变化
watch(
  () => activeTab.value,
  (newVal) => {
    handleTabChange(newVal)
  },
)

// 处理选择好友
const handleSelectFriend = (friend) => {
  emit('selectFriend', friend)
}

// 处理选择群聊
const handleSelectGroupChat = (group) => {
  emit('selectGroupChat', group)
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
const confirmGroupDialog = (name) => {
  if (dialogType.value === 'add') {
    emit('addGroup', name)
  } else {
    emit('renameGroup', {
      groupId: currentGroup.value.groupId,
      newName: name,
    })
  }
}

// 取消对话框操作
const cancelGroupDialog = () => {
  // 对话框取消操作
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
}
</style>
