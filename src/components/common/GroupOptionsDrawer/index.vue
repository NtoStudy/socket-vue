<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import { chatRoomUser } from '@/api/chatRoom.js'
import { getUsersInfoInChatRoom } from '@/api/user.js'

// 定义组件的属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  isTop: {
    type: Boolean,
    default: false,
  },
  isGroupTop: {
    // 新增群聊置顶状态
    type: Boolean,
    default: false,
  },
  groupInfo: {
    type: Object,
    default: () => ({}),
  },
  isGroupOwner: {
    type: Boolean,
    default: false,
  },
  isGroupAdmin: {
    type: Boolean,
    default: false,
  },
})

// 定义组件的事件
const emit = defineEmits([
  'close',
  'topChange',
  'exitGroup',
  'dissolveGroup',
  'viewGroupInfo',
  'manageMembers',
  'changeGroupName',
  'changeGroupNotice',
  'muteAll',
  'changeJoinMethod',
])

// 使用计算属性处理抽屉可见性
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('close', value),
})

// 模拟群成员数据 (实际应用中应该从API获取)
const groupMembers = ref()
const getChatRoomUser = async () => {
  const res = await chatRoomUser(props.groupInfo.roomId)
  if (res.data.code === 200) {
    const userPromises = res.data.data.map((item) => getUsersInfoInChatRoom(item, props.groupInfo.roomId))
    const responses = await Promise.all(userPromises)
    groupMembers.value = responses
      .map((response) => ({
        userId: response.data.data.userId,
        username: response.data.data.username,
        avatar: response.data.data.avatar,
        nickname: response.data.data.nickname,
        number: response.data.data.number,
        role: response.data.data.role,
      }))
      .sort((a, b) => {
        if (a.role === '群主') return -1
        if (b.role === '群主') return 1
        if (a.role === '管理员') return -1
        if (b.role === '管理员') return 1
        return 0
      })
  }
  console.log('groupMembers', groupMembers.value)
}

/**
 * 处理抽屉关闭事件
 */
const handleClose = () => {
  emit('close', false)
}

/**
 * 处理置顶状态变更
 * @param {Boolean} value - 新的置顶状态
 */
const handleTopChange = (value) => {
  emit('topChange', value)
}

/**
 * 处理退出群聊点击
 */
const handleExitGroup = () => {
  ElMessageBox.confirm('确定要退出该群聊吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('exitGroup')
      handleClose()
    })
    .catch(() => {})
}

/**
 * 处理解散群聊点击
 */
const handleDissolveGroup = () => {
  ElMessageBox.confirm('确定要解散该群聊吗？此操作不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger',
  })
    .then(() => {
      emit('dissolveGroup')
      handleClose()
    })
    .catch(() => {})
}

// 添加本地状态来跟踪群昵称和群名称
const myNickname = ref(props.groupInfo?.myNickname || '')
const groupName = ref(props.groupInfo?.roomName || '')

// 监听 props 变化，更新本地状态
watch(
  () => props.groupInfo?.myNickname,
  (newValue) => {
    if (newValue !== undefined) {
      myNickname.value = newValue
    }
  },
)

watch(
  () => props.groupInfo?.roomName,
  (newValue) => {
    if (newValue) {
      groupName.value = newValue
    }
  },
)

/**
 * 处理我的本群昵称变更
 * @param {String} value - 新的昵称
 */
const handleNicknameChange = (value) => {
  myNickname.value = value
}

/**
 * 保存我的本群昵称
 */
const saveMyNickname = () => {
  emit('changeGroupNickName', myNickname.value)
}

/**
 * 处理群名称变更
 * @param {String} value - 新的群名称
 */
const handleGroupNameChange = (value) => {
  groupName.value = value
}

/**
 * 保存群名称
 */
const saveGroupName = () => {
  emit('changeGroupName', groupName.value)
}
/**
 * 处理修改群公告
 */
const handleChangeGroupNotice = () => {
  emit('changeGroupNotice')
}
const addGroupMember = () => {
  console.log('添加群成员')
}
/**
 * 处理全员禁言状态变更
 * @param {Boolean} value - 新的禁言状态
 */
const handleMuteAll = (value) => {
  emit('muteAll', value)
}

onMounted(() => {
  getChatRoomUser()
})

watch(
  () => props.groupInfo.roomId,
  () => {
    getChatRoomUser()
  },
)
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    :show-close="false"
    direction="rtl"
    size="400px"
    :modal-class="'chat-drawer-modal'"
    :with-header="false"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    @closed="handleClose"
  >
    <div class="drawer-content">
      <el-scrollbar>
        <!-- 群聊信息头部 -->
        <div class="group-header">
          <div class="group-avatar">
            <img :src="groupInfo.avatarUrl || ''" alt="群头像" />
          </div>
          <div class="group-info">
            <div class="group-name">{{ groupInfo.roomName || '群聊' }}</div>
            <div class="group-id">群号：{{ groupInfo.groupNumber || '' }}</div>
          </div>
        </div>

        <!-- 群成员列表 -->
        <div class="group-members-section">
          <div class="section-title">群聊成员</div>
          <div class="members-grid">
            <div v-for="member in groupMembers" :key="member.id" class="member-item">
              <div class="member-avatar">
                <img :src="member.avatar" alt="成员头像" />
              </div>
              <div class="member-name">{{ member.nickname ? member.nickname : member.username }}</div>
            </div>
            <div class="member-item add-member" @click="addGroupMember">
              <div class="member-avatar add-icon">
                <el-icon><plus /></el-icon>
              </div>
              <div class="member-name">邀请</div>
            </div>
          </div>
        </div>

        <!-- 选项列表 - 不折叠 -->
        <div class="option-list">
          <!-- 置顶选项 -->
          <div class="option-item with-switch">
            <div class="option-info">
              <span class="option-text">设为置顶</span>
            </div>
            <el-switch :model-value="props.isGroupTop" @change="handleTopChange" />
          </div>

          <!-- 我的本群昵称 -->
          <div class="option-item input-option">
            <div class="option-label">我的本群昵称</div>
            <el-input
              v-model="myNickname"
              placeholder="填写我在本群的昵称"
              @change="handleNicknameChange"
              @blur="saveMyNickname"
            />
          </div>

          <!-- 修改群名称 -->
          <div class="option-item input-option">
            <div class="option-label">群聊昵称</div>
            <el-input
              v-model="groupName"
              placeholder="填写群名称"
              @change="handleGroupNameChange"
              @blur="saveGroupName"
            />
          </div>

          <!-- 修改群公告 -->
          <div class="option-item" @click="handleChangeGroupNotice">
            <div class="option-info">
              <span class="option-text">设置群公告</span>
            </div>
            <el-icon><ArrowRight /></el-icon>
          </div>

          <!-- 全员禁言 -->
          <div class="option-item with-switch">
            <div class="option-info">
              <span class="option-text">全员禁言</span>
            </div>
            <el-switch :model-value="groupInfo.muteAll" @change="handleMuteAll" />
          </div>

          <!-- 退出群聊 -->
          <div class="option-item danger" @click="handleExitGroup">
            <div class="option-info">
              <span class="option-text">退出群聊</span>
            </div>
          </div>

          <!-- 解散群聊 -->
          <div class="option-item delete" @click="handleDissolveGroup">
            <div class="option-info">
              <span class="option-text">解散群聊</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
@use './group.scss';
</style>
