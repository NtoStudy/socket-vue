<template>
  <div class="friend-requests">
    <h2 class="title">好友通知</h2>
    <div class="request-list">
      <div
          v-for="(request, index) in requests"
          :key="index"
          class="request-item"
      >
        <div class="request-avatar">
          <img :src="request.avatar" alt="avatar"/>
        </div>
        <div class="request-content">
          <div class="request-header">
            <span class="request-name">{{ request.name }}</span>
            <span class="request-date">{{ request.date }}</span>
          </div>
          <p class="request-message">
            留言：问题1:留备注 回答:{{ request.message }}
          </p>
          <span class="request-status">已同意</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

// 模拟数据
const requests = ref([
  {
    avatar: '', // 替换为实际头像 URL
    name: '240603414姚文艳',
    date: '昨天',
    message: '240603414姚文艳',
  },
  {
    avatar: '', // 替换为实际头像 URL
    name: '谕小花',
    date: '2025/01/27',
    message: '我是谕小花老师',
  },
  {
    avatar: '', // 替换为实际头像 URL

    name: '240603330～吴前龙',
    date: '2025/01/20',
    message: '吴前龙',
  },
  {
    avatar: '', // 替换为实际头像 URL

    name: '240602330-张放（前端）',
    date: '2025/01/16',
    message: '张放',
  },
  {
    avatar: '', // 替换为实际头像 URL

    name: '杨蕊慈',
    date: '2024/12/30',
    message: '杨蕊慈',
  },
  {
    avatar: '', // 替换为实际头像 URL

    name: '240603422-班长-吴骞',
    date: '2024/12/20',
    message: '吴骞',
  },
  {
    avatar: '', // 替换为实际头像 URL

    name: '小新超人😊',
    date: '2024/11/28',
    message: '240201405_邓志蓉',
  },
]);
</script>

<style lang="scss" scoped>
.friend-requests {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f2f2f2;
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
