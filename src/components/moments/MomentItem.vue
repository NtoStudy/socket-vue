<template>
  <div class="moment-item">
    <!-- 用户头像 -->
    <div class="user-avatar">
      <img :src="item.avatar" alt="avatar" />
    </div>

    <!-- 朋友圈内容区 -->
    <div class="moment-content">
      <!-- 用户名和内容 -->
      <div class="user-info">
        <div class="username">{{ item.username }}</div>
        <div class="content">{{ item.content }}</div>
      </div>

      <!-- 图片区域 -->
      <moment-images v-if="item.images && item.images.length" :images="item.images" @image-click="handleImageClick" />

      <!-- 点赞和评论区域 -->
      <moment-interactions
        v-if="item.likes.length > 0 || item.comments.length > 0"
        :likes="item.likes"
        :comments="item.comments"
      />

      <!-- 底部信息：时间和操作按钮 -->
      <div class="moment-footer">
        <div class="time">{{ item.time }}</div>
        <moment-actions :item="item" @toggle="toggleActions" @like="handleLike" @comment="handleComment" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import MomentImages from './MomentImages.vue'
import MomentInteractions from './MomentInteractions.vue'
import MomentActions from './MomentActions.vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:item'])

// 处理图片点击事件
const handleImageClick = (image) => {
  console.log('查看图片', image)
}

// 处理点赞
const handleLike = (item) => {
  if (item.isLiked) {
    // 取消点赞
    const index = item.likes.indexOf('当前用户')
    if (index !== -1) {
      item.likes.splice(index, 1)
    }
  } else {
    // 添加点赞
    item.likes.push('当前用户')
  }
  item.isLiked = !item.isLiked
  item.showActions = false
  emit('update:item', item)
}

// 处理评论
const handleComment = (item) => {
  console.log('评论', item)
  item.showActions = false
  emit('update:item', item)
  // 这里可以添加评论逻辑
}

// 切换操作菜单显示状态
const toggleActions = (item) => {
  emit('update:item', { ...item, showActions: !item.showActions })
}
</script>

<style lang="scss" scoped>
.moment-item {
  display: flex;
  padding: 15px;
  background-color: #fff;
  margin-bottom: 10px;

  .user-avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      object-fit: cover;
    }
  }

  .moment-content {
    flex: 1;

    .user-info {
      margin-bottom: 8px;

      .username {
        font-size: 14px;
        font-weight: 500;
        color: #07c160;
        margin-bottom: 5px;
      }

      .content {
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        word-break: break-all;
      }
    }

    .moment-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .time {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .moment-item {
    .moment-content {
      .images-container {
        .image-item {
          img {
            height: 80px;
          }
        }
      }
    }
  }
}
</style>
