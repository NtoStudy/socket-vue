<template>
  <div class="group-members-section">
    <div class="section-title">群聊成员</div>
    <div class="members-grid">
      <div v-for="member in members" :key="member.userId" class="member-item">
        <el-popover placement="right" :width="300" trigger="click" popper-class="user-profile-popover">
          <template #reference>
            <div class="member-avatar-wrapper">
              <div class="member-avatar">
                <img :src="member.avatar" alt="成员头像" />
              </div>
              <div class="member-name">{{ member.nickname ? member.nickname : member.username }}</div>
            </div>
          </template>
          <UserProfileCard
            :user-info="member"
            @like="handleLike(member)"
            :current-status="getMemberStatus(member)"
            :user-avatar="member.avatar"
            :user-type="'groupMember'"
            @send-message="handleSendMessage(member)"
          >
            <!-- 自定义底部按钮 -->
            <template #default>
              <div class="profile-action-buttons">
                <el-button class="action-btn message-btn" type="primary" @click="handleSendMessage(member)">
                  发消息
                </el-button>
                <el-button
                  v-if="isGroupOwner || isGroupAdmin"
                  class="action-btn admin-btn"
                  @click="handleSetAdmin(member)"
                >
                  设置管理
                </el-button>
                <el-button
                  v-if="isGroupOwner || isGroupAdmin"
                  class="action-btn kick-btn"
                  type="danger"
                  @click="handleKickMember(member)"
                >
                  踢出群聊
                </el-button>
                <el-button v-if="isGroupOwner" class="action-btn transfer-btn" @click="handleTransferOwner(member)">
                  转让群主
                </el-button>
              </div>
            </template>
          </UserProfileCard>
        </el-popover>
      </div>
      <div class="member-item add-member" @click="$emit('add-member')">
        <div class="member-avatar add-icon">
          <el-icon>
            <Plus />
          </el-icon>
        </div>
        <div class="member-name">邀请</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import UserProfileCard from '@/components/common/UserProfileCard/index.vue'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/store/user.js'

const props = defineProps({
  members: {
    type: Array,
    default: () => [],
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

// 计算好友状态对象
const getMemberStatus = (member) => {
  return {
    id: member.userId || '',
    label: member.status || '在线',
  }
}
console.log('members:', props.members)
const emit = defineEmits(['send-message', 'set-admin', 'kick-member', 'transfer-owner', 'add-member'])
const handleLike = async (member) => {
  console.log(member.userId)
  if (member.userId === useUserInfoStore().userInfo.userId) {
    ElMessage.warning('不能点赞自己')
  } else {
    //TODO点赞用websocket来实现
    // const res = await putUsersLike(member.userId)
    // if (res.data.code === 200) {
    //   // 此时点赞成功，应该更新点赞状态
    //   ElMessage.success('点赞成功')
    //   await profile.getGroupMemberProfile(member.userId, chatInfo.chatRoomId)
    // }
  }
}
// 处理发送消息给群成员
const handleSendMessage = (member) => {
  emit('send-message', member)
}

// 处理设置管理员
const handleSetAdmin = (member) => {
  emit('set-admin', member)
}

// 处理踢出群成员
const handleKickMember = (member) => {
  emit('kick-member', member)
}

// 处理转让群主
const handleTransferOwner = (member) => {
  emit('transfer-owner', member)
}
</script>

<style lang="scss" scoped>
.group-members-section {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: #333;
  }

  .members-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;

    .member-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      &.add-member {
        .member-avatar {
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;

          .el-icon {
            font-size: 20px;
            color: #999;
          }
        }
      }

      .member-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 4px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .member-name {
        font-size: 12px;
        color: #666;
        width: 100%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.member-avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.profile-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.action-btn {
  flex: 1;
  height: 36px;

  &.message-btn {
    background-color: #1890ff;
    border-color: #1890ff;
  }

  &.admin-btn {
    background-color: #ffffff;
    color: #1890ff;
    border-color: #1890ff;
  }

  &.kick-btn {
    background-color: #ffffff;
    color: #f56c6c;
    border-color: #f56c6c;
  }

  &.transfer-btn {
    background-color: #ffffff;
    color: #67c23a;
    border-color: #67c23a;
  }
}
.el-button + .el-button {
  margin-left: 0;
}
</style>
