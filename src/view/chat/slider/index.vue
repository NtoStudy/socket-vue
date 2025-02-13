<template>
  <div class="chat-list">
    <!-- 按钮拨片切换 -->
    <div class="chat-switcher">
      <div
          class="chat-switcher-item"
          :class="{ active: isActive === 'friend' }"
          @click="toggleList('friend')"
      >
        好友列表
      </div>
      <div
          class="chat-switcher-item"
          :class="{ active: isActive === 'group' }"
          @click="toggleList('group')"
      >
        群聊列表
      </div>
    </div>
    <!-- 根据切换显示不同内容 -->
    <Friend v-if="isActive==='friend'"/>
    <ChatRoom v-else/>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import Friend from './Friend/index.vue'
import ChatRoom from './ChatRoom/index.vue'

const isActive = ref("friend"); // 初始显示好友列表

// 切换列表
const toggleList = (type) => {
  if (type === "friend" || type === "group") {
    isActive.value = type === "friend" ? "friend" : "group";
  }
};
onMounted(() => {

});
</script>

<style lang="scss" scoped>
.chat-list {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .chat-switcher {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    .chat-switcher-item {
      padding: 5px 10px;
      border-radius: 20px;
      background-color: #e0e0e0;
      margin: 0 5px;
      cursor: pointer;
      transition: background-color 0.3s;

      &.active {
        background-color: #007bff;
        color: #fff;
      }

      &:hover {
        background-color: #007bff;
        color: #fff;
      }
    }
  }

  .chat-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .chat-avatar {
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
      }
    }

    .chat-content {
      flex: 1;

      .chat-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;

        .chat-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .chat-time {
          font-size: 12px;
          color: #666;
        }
      }

      .chat-message {
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;

        .chat-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .chat-badge {
      width: 18px;
      height: 18px;
      background-color: #ff4d4d;
      color: #fff;
      border-radius: 50%;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
    }
  }
}
</style>
