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

        <!-- 群成员列表部分 -->
        <MemberList
          :members="groupMembers"
          :is-group-owner="chatRoomRole === '群主'"
          :is-group-admin="chatRoomRole === '管理员'"
          @send-message="handleSendMessageToMember"
          @set-admin="handleSetAdmin"
          @kick-member="handleKickMember"
          @transfer-owner="handleTransferOwner"
          @add-member="addGroupMember"
        />

        <!-- 群设置选项 -->
        <GroupSettings
          :is-group-top="props.isGroupTop"
          :nickname="myNickname"
          :group-name="groupName"
          :is-group-owner="chatRoomRole === '群主'"
          :is-group-admin="chatRoomRole === '管理员'"
          @top-change="handleTopChange"
          :group-notice="currentNotice"
          @save-nickname="saveMyNickname"
          @save-group-name="saveGroupName"
          @change-notice="showNoticePanel = true"
          @dissolve-group="handleDissolveGroup"
        />

        <!-- 群公告面板 -->
        <el-dialog
          v-model="showNoticePanel"
          title="群公告"
          width="600px"
          :close-on-click-modal="true"
          :show-close="true"
        >
          <GroupNoticePanel
            :notices="groupNotices"
            :is-group-owner="chatRoomRole === '群主'"
            :is-group-admin="chatRoomRole === '管理员'"
            @publish-notice="handlePublishNotice"
          />
        </el-dialog>
      </el-scrollbar>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { chatRoomUser, setChatRoomAdmin, transferChatRoomOwner } from '@/api/modules'
import router from '@/router/index.js'
import { chatFriendOrChatRoomStore } from '@/store/chat.js'
import MemberList from './components/MemberList.vue'
import GroupSettings from './components/GroupSettings.vue'
import GroupNoticePanel from '@/components/common/GroupNoticePacel/index.vue'
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
    type: Boolean,
    default: false,
  },
  groupInfo: {
    type: Object,
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
// 定义事件
const emit = defineEmits([
  'close',
  'topChange',
  'exitGroup',
  'dissolveGroup',
  'changeGroupName',
  'changeGroupNotice',
  'changeGroupNickName',
])
const showNoticePanel = ref(false)
const groupNotices = ref([])
const currentNotice = computed(() => {
  if (groupNotices.value.length === 0) return null
  // 返回置顶公告或最新公告
  const pinnedNotice = groupNotices.value.find((notice) => notice.isPinned)
  return pinnedNotice || groupNotices.value[0]
})
// 处理发布公告
const handlePublishNotice = async (noticeData) => {
  try {
    // 这里应该调用API发布公告
    // const res = await publishGroupNotice(props.groupInfo.roomId, noticeData)

    // 模拟API调用成功
    const newNotice = {
      id: Date.now().toString(),
      content: noticeData.content,
      publisherId: '当前用户ID', // 应该从用户store中获取
      publisherName: '当前用户名', // 应该从用户store中获取
      publisherAvatar: 'https://example.com/avatar.jpg', // 应该从用户store中获取
      publishTime: new Date().toISOString(),
      isPinned: noticeData.isPinned,
    }

    // 更新本地公告列表
    if (noticeData.isPinned) {
      // 如果是置顶公告，取消其他公告的置顶状态
      groupNotices.value = groupNotices.value.map((notice) => ({
        ...notice,
        isPinned: false,
      }))
    }

    groupNotices.value = [newNotice, ...groupNotices.value]
  } catch (error) {
    console.error('发布公告失败:', error)
  }
}

// 获取群公告列表
const getGroupNotices = async () => {
  if (!props.groupInfo?.roomId) return

  try {
    // 这里应该调用API获取群公告列表
    // const res = await getGroupNoticeList(props.groupInfo.roomId)

    // 模拟API调用结果
    groupNotices.value = [
      {
        id: '1',
        content: '辩论赛海报27.08剩余210.92',
        publisherId: 'user1',
        publisherName: '斯人',
        publisherAvatar: 'https://example.com/avatar1.jpg',
        publishTime: '2023-09-12T16:00:00Z',
        isPinned: true,
      },
      {
        id: '2',
        content: '打印表花费5元剩余238元',
        publisherId: 'user2',
        publisherName: '斯人',
        publisherAvatar: 'https://example.com/avatar2.jpg',
        publishTime: '2023-09-22T17:56:00Z',
        isPinned: false,
      },
      {
        id: '3',
        content: '班费花费50剩余243',
        publisherId: 'user3',
        publisherName: '斯人',
        publisherAvatar: 'https://example.com/avatar3.jpg',
        publishTime: '2023-04-29T22:45:00Z',
        isPinned: false,
      },
    ]
  } catch (error) {
    console.error('获取群公告失败:', error)
  }
}

// 在组件挂载和群ID变化时获取群公告
onMounted(() => {
  getGroupNotices()
})

// 使用计算属性处理抽屉可见性
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('close', value),
})
// 群成员数据
const groupMembers = ref([])
const chatRoomRole = computed(() => {
  console.log('chatRoomRole', props.groupInfo.role)
  return props.groupInfo.role
})
import { useProfilesStore } from '@/store/profiles.js'
const profilesStore = useProfilesStore()

// 获取群成员信息
const getChatRoomUser = async () => {
  if (!props.groupInfo?.roomId) return

  try {
    // 1. 获取群成员ID列表
    const res = await chatRoomUser(props.groupInfo.roomId)
    if (res.data.code === 200) {
      // 2. 使用 profilesStore 批量获取群成员信息
      const memberIds = res.data.data
      const members = await profilesStore.getGroupMembersProfiles(memberIds, props.groupInfo.roomId)

      // 3. 格式化并排序成员信息
      groupMembers.value = members
        .map((member) => ({
          userId: member.userId,
          username: member.username,
          avatar: member.avatar,
          number: member.number,
          role: member.role,
          avatarUrl: member.avatarUrl,
          status: member.status,
          customStatus: member.customStatus,
          hobbies: member.hobbies,
          likeCount: member.likeCount,
          nickname: member.nickname,
        }))
        .sort((a, b) => {
          if (a.role === '群主') return -1
          if (b.role === '群主') return 1
          if (a.role === '管理员') return -1
          if (b.role === '管理员') return 1
          return 0
        })
    }
  } catch (error) {
    console.error('获取群成员失败:', error)
  }
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
 * 处理解散群聊点击
 */
const handleDissolveGroup = () => {
  const message =
    chatRoomRole.value === '群主' ? '确定要解散该群聊吗？此操作不可恢复。' : '确定要退出群聊吗？此操作不可恢复'
  ElMessageBox.confirm(message, '提示', {
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
const myNickname = ref(props.groupInfo?.nickname || '')
const groupName = ref(props.groupInfo?.roomName || '')

// 监听 props 变化，更新本地状态
watch(
  () => props.groupInfo.nickname,
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
 * 保存我的本群昵称
 */
const saveMyNickname = (value) => {
  emit('changeGroupNickName', value)
}

/**
 * 保存群名称
 */
const saveGroupName = (value) => {
  emit('changeGroupName', value)
}

/**
 * 添加群成员
 */
const addGroupMember = () => {
  console.log('添加群成员')
}

// 初始化和监听
onMounted(() => {
  getChatRoomUser()
})

watch(
  () => props.groupInfo.roomId,
  () => {
    getChatRoomUser()
  },
)

const chatStore = chatFriendOrChatRoomStore()

/**
 * 处理发送消息给群成员
 * @param {Object} member - 群成员信息
 */
const handleSendMessageToMember = (member) => {
  // 关闭抽屉
  emit('close')

  // 设置聊天对象为该成员
  chatStore.setFriendId(member.userId)

  // 跳转到聊天页面
  router.push('/main/chat')
}

/**
 * 处理设置管理员
 * @param {Object} member - 群成员信息
 */
const handleSetAdmin = async (member) => {
  // 这里可以添加权限检查
  console.log('设置管理员:', member)
  //TODO页面实时更新
  let res
  if (member.role === '管理员') {
    res = await setChatRoomAdmin(chatStore.chatRoomId, member.userId, 0)
    ElMessage.success('取消管理员成功')
  } else {
    res = await setChatRoomAdmin(chatStore.chatRoomId, member.userId, 1)
    ElMessage.success('设置管理员成功')
  }
  console.log(res.data)
}

/**
 * 处理踢出群成员
 * @param {Object} member - 群成员信息
 */
const handleKickMember = (member) => {
  // 这里可以添加权限检查
  console.log('踢出群成员:', member)
  // 后续实现踢出群成员的逻辑
}

/**
 * 处理转让群主
 * @param {Object} member - 群成员信息
 */
const handleTransferOwner = async (member) => {
  // 这里可以添加权限检查
  console.log('转让群主给:', member)
  // 后续实现转让群主的逻辑

  ElMessageBox.confirm('确定要转让群主吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await transferChatRoomOwner(chatStore.chatRoomId, member.userId)
      console.log(res.data)
      ElMessage.success('转让群主成功')
    })
    .catch(() => {
      ElMessage.info('取消转让群主')
    })
}
</script>

<style lang="scss" scoped>
.drawer-content {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  .group-header {
    padding: 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    background-color: #f9f9f9;

    .group-avatar {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 12px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        background-color: #ff4d4d;
        object-fit: cover;
      }
    }

    .group-info {
      flex: 1;
      overflow: hidden;

      .group-name {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .group-id {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// 自定义抽屉样式
:deep(.el-drawer) {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

:deep(.el-drawer__body) {
  padding: 0;
  overflow: hidden;
}

:deep(.el-scrollbar) {
  height: 100%;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-select .el-input__inner) {
  height: 32px;
}

:deep(.el-switch) {
  --el-switch-on-color: #409eff;
}

:deep(.user-profile-popover) {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .el-popper__arrow {
    display: none;
  }
}
</style>
