<script setup>
import { ref } from 'vue'
import MomentsHeader from '@/components/moments/MomentsHeader.vue'
import MomentItem from '@/components/moments/MomentItem.vue'

// 模拟朋友圈数据
const momentsList = ref([
  {
    id: 1,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '南航科院帮帮团 人满加2号ramelsa',
    content: '【投稿】想问一下学校哪里可以现金换位置钱',
    time: '3小时前',
    likes: ['小羽', '小羽'],
    comments: [
      {
        username: '南航科院帮帮团 人满加2号ramelsa',
        content: '给兄弟买包瓜子去',
      },
      {
        username: '南航科院帮帮团 人满加2号ramelsa',
        content: '哈哈，本人来了，没想到只是随手一捡就被发到表白墙了',
      },
    ],
    isLiked: false,
    showActions: false,
  },
  {
    id: 2,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '南航科院帮帮团 人满加2号ramelsa',
    content:
      '【投稿】瑶瑶 问一下有没有人收isoo澳门场的票 22号的 朋友帮忙多抢了四张 998和900的各多两张💰 有的加我一下～到时候可以一起去🧩',
    time: '2分钟前',
    images: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
    likes: [],
    comments: [],
    isLiked: false,
    showActions: false,
  },
  {
    id: 3,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '南航科院帮帮团 人满加2号ramelsa',
    content: '【投稿】找个明天早八代课女生',
    time: '刚刚',
    images: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
    likes: [],
    comments: [],
    isLiked: false,
    showActions: false,
  },
])

// 更新朋友圈项目
const updateMomentItem = (updatedItem) => {
  const index = momentsList.value.findIndex((item) => item.id === updatedItem.id)
  if (index !== -1) {
    // 先关闭所有其他项的操作菜单
    momentsList.value.forEach((moment) => {
      if (moment.id !== updatedItem.id) {
        moment.showActions = false
      }
    })
    // 更新当前项
    momentsList.value[index] = updatedItem
  }
}
</script>

<template>
  <div class="moments-container">
    <!-- 顶部导航栏 -->
    <moments-header />

    <!-- 朋友圈内容列表 -->
    <div class="moments-content">
      <div class="moments-wrapper">
        <moment-item v-for="item in momentsList" :key="item.id" :item="item" @update:item="updateMomentItem" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moments-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f7f7;

  .moments-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
    display: flex;
    justify-content: center;

    .moments-wrapper {
      width: 100%;
      max-width: 600px;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .moments-container {
    .moments-content {
      .moments-wrapper {
        width: 100%;
      }
    }
  }
}
</style>
