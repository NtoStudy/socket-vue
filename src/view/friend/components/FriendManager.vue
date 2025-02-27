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
import { computed, onMounted, ref } from 'vue'
import { handleFriend } from '@/api/friend/index.js'
import { chatRoomHandle } from '@/api/ChatRoom/index.js'

const store = useFriendManagerStore()
const { selectedMenu, friendRequests, groupRequests } = storeToRefs(store)

// 计算当前要显示的请求列表
const currentRequests = computed(() => {
  return selectedMenu.value === 'friend' ? friendRequests.value : groupRequests.value
})

const handleFriendOrRequestRequest = async (request, status) => {
  if (request.relationId) {
    console.log(123)
    const res = await handleFriend(request.relationId, status)
    if (res.data.code === 200) {
      await store.handleFriendList()
    }
  }
  if (request.roomId) {
    console.log(456)
    const res = await chatRoomHandle(request.roomId, status)
    console.log(res.data)
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow-y: auto;

  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }

  .request-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .request-item {
    display: flex;
    align-items: flex-start;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px;
    transition:
      transform 0.2s,
      box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .request-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;

    img {
      display: flex;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
    }
  }

  .request-content {
    flex: 1;
    display: flex;
    justify-content: space-between;

    .request-right {
      .request-header {
        display: flex;
        margin-bottom: 20px;

        .request-name {
          font-size: 14px;
          margin-right: 30px;
          font-weight: 500;
          color: #333;
        }

        .request-date {
          font-size: 12px;
          color: #666;
        }
      }

      .request-message {
        margin-bottom: 10px;

        p {
          font-size: 12px;
          color: #666;
        }
      }
    }

    .request-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 20px;
      color: #66667a;
    }
  }
}
</style>
