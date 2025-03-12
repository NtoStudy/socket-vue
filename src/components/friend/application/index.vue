<template>
  <div class="friend-requests">
    <h2 class="title">{{ selectedMenu === 'friend' ? '好友通知' : '群通知' }}</h2>
    <div class="request-list">
      <!-- 动态渲染请求列表 -->
      <div v-for="(request, index) in currentRequests" :key="index" class="request-item">
        <div class="request-avatar">
          <img :src="request.avatarUrl" alt="avatar" />
        </div>
        <div class="request-content">
          <div class="request-right">
            <div class="request-header">
              <span class="request-name">{{ request.username }}</span>
              <span class="request-date">{{ request.createdAt }}</span>
            </div>
            <div class="request-message">
              <p>留言：{{ request.content }}</p>
            </div>
          </div>
          <div class="request-left">
            <el-dropdown
              split-button
              type="primary"
              v-if="request.status === 0"
              @click="handleFriendOrRequestRequest(request, 1)"
            >
              同意
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleFriendOrRequestRequest(request, 2)">拒绝</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <p v-if="request.status === 1">已同意</p>
            <p v-if="request.status === 2">已拒绝</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFriendManagerStore } from '@/store/friendManager.js'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { handleFriend } from '@/api/friend.js'
import { chatRoomHandle } from '@/api/chatRoom.js'

const store = useFriendManagerStore()
const { selectedMenu, friendRequests, groupRequests } = storeToRefs(store)

// 计算当前要显示的请求列表
const currentRequests = computed(() => {
  return selectedMenu.value === 'friend' ? friendRequests.value : groupRequests.value
})

const handleFriendOrRequestRequest = async (request, status) => {
  if (request.relationId) {
    const res = await handleFriend(request.relationId, status)
    if (res.data.code === 200) {
      await store.handleFriendList()
    }
  }
  if (request.roomId) {
    const res = await chatRoomHandle(request.roomId, status)
    if (res.data.code === 200) {
      await store.handleGroupList()
    }
  }
}

onMounted(() => {
  store.handleFriendList()
  store.handleGroupList()
})
</script>

<style lang="scss" scoped>
.friend-requests {
  height: 100%;
  flex:1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;

  .title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #333;
    padding-bottom: 12px;
    border-bottom: 1px solid #eaeaea;
  }

  .request-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .request-item {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    padding: 10px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
  }

  .request-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #f0f0f0;
    }
  }

  .request-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    .request-right {
      flex: 1;
      
      .request-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .request-name {
          font-size: 16px;
          font-weight: 600;
          margin-right: 12px;
          color: #333;
        }

        .request-date {
          font-size: 12px;
          color: #999;
          background-color: #f5f5f5;
          padding: 2px 8px;
          border-radius: 10px;
        }
      }

      .request-message {
        margin-bottom: 5px;

        p {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }
      }
    }

    .request-left {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      min-width: 100px;
      
      p {
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 14px;
        
        &:nth-child(1) {
          background-color: #f0f9eb;
          color: #67c23a;
        }
        
        &:nth-child(2) {
          background-color: #f4f4f5;
          color: #909399;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .friend-requests {
    padding: 15px;
    
    .request-item {
      flex-direction: column;
      align-items: flex-start;
      
      .request-avatar {
        margin-bottom: 10px;
      }
      
      .request-content {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        
        .request-left {
          margin-top: 15px;
          width: 100%;
          justify-content: flex-start;
        }
      }
    }
  }
}
</style>