<template>
  <div class="friend-requests">
    <h2 class="title">{{ selectedMenu === 'friend' ? '好友通知' : '群通知' }}</h2>
    <div class="request-list">
      <!-- 动态渲染请求列表 -->
      <div
          v-for="(request, index) in currentRequests"
          :key="index"
          class="request-item"
      >
        <div class="request-avatar">
          <img :src="request.avatar" alt="avatar" />
        </div>
        <div class="request-content">
          <div class="request-header">
            <span class="request-name">{{ request.name }}</span>
            <span class="request-date">{{ request.date }}</span>
          </div>
          <p class="request-message">留言：{{ request.message }}</p>
          <span class="request-status">{{ request.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useFriendManagerStore} from '@/store/friendManager.js';
import {storeToRefs} from 'pinia';
import {computed} from "vue";

const store = useFriendManagerStore();
const {selectedMenu, friendRequests, groupRequests} = storeToRefs(store);

// 计算当前要显示的请求列表
const currentRequests = computed(() => {
  return selectedMenu.value === 'friend' ? friendRequests.value : groupRequests.value;
});
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
    align-items: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 15px;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .request-avatar {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
    }
  }

  .request-content {
    flex: 1;

    .request-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;

      .request-name {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .request-date {
        font-size: 12px;
        color: #666;
      }
    }

    .request-message {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    .request-status {
      font-size: 12px;
      color: #888;
      text-align: right;
    }
  }
}
</style>

