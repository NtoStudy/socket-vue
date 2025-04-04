<template>
  <div class="moment-item">
    <!-- 用户头像 -->
    <div class="user-avatar">
      <img :src="userInfo.avatarUrl" alt="avatar" />
    </div>

    <!-- 朋友圈内容区 -->
    <div class="moment-content" @click="navigateToDetail()">
      <!-- 用户名和内容 -->
      <div class="user-info">
        <div class="username">{{ userInfo.username }}</div>
        <div class="content">{{ item.content }}</div>
      </div>

      <!-- 图片区域 -->
      <moment-images
        v-if="item.mediaUrl && item.mediaUrl.length"
        :images="item.mediaUrl"
        @image-click="handleImageClick"
      />

      <!-- 点赞和评论区域 -->
      <moment-interactions
        v-if="item.likeCount > 0 || item.commentCount > 0"
        :likes="item.likeCount"
        :comments="item.commentCount"
      />

      <!-- 底部信息：时间和操作按钮 -->
      <div class="moment-footer">
        <div class="time">{{ formatSentTime(item.createdAt) }}</div>
        <moment-actions :item="item" @toggle="toggleActions" @like="handleLike" @comment="handleComment" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MomentImages from './MomentImages.vue'
import MomentInteractions from './MomentInteractions.vue'
import MomentActions from './MomentActions.vue'
import { formatSentTime } from '@/utils/messageUtils.js'
import { getInfoByIdInMoment } from '@/api/index.js'

const router = useRouter()
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
// 用户信息缓存Map
const userInfoMap = ref({})
// 获取当前用户信息的计算属性
const userInfo = computed(() => {
  if (props.item.userId && userInfoMap.value[props.item.userId]) {
    return userInfoMap.value[props.item.userId]
  }
  return { avatarUrl: props.item.avatar, username: props.item.username }
})

// 获取用户信息
const fetchUserInfo = async () => {
  if (!props.item.userId || userInfoMap.value[props.item.userId]) {
    return
  }

  try {
    const response = await getInfoByIdInMoment(props.item.userId)
    if (response.data.code) {
      // 将用户信息存储到Map中
      userInfoMap.value[props.item.userId] = {
        avatarUrl: response.data.data.avatarUrl,
        username: response.data.data.username,
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}
// 导航到详情页
const navigateToDetail = () => {
  router.push({
    name: 'MomentDetail',
    params: { id: props.item.postId },
  })
}

// 处理图片点击事件
const handleImageClick = (image) => {
  // 阻止事件冒泡，避免触发navigateToDetail
  event.stopPropagation()
  // 直接导航到详情页
  navigateToDetail()
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})

const emit = defineEmits(['update:item'])

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
  // 导航到详情页并聚焦评论区
  router.push({
    name: 'MomentDetail',
    params: { id: props.item.id },
    state: {
      moment: props.item,
      userInfo: userInfo.value,
      focusComment: true,
    },
  })
  emit('update:item', item)
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
    background-color: #00bcd4;
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
    cursor: pointer;

    &:hover {
      background-color: #f9f9f9;
      border-radius: 4px;
    }

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
</style>
