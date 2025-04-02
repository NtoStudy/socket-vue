<template>
  <div class="interaction-area">
    <!-- 点赞区域 -->
    <div v-if="likes.length > 0" class="likes-area">
      <div class="like-icon">❤️</div>
      <div class="like-users">
        <span v-for="(like, index) in likes" :key="index"> {{ like }}{{ index < likes.length - 1 ? '、' : '' }} </span>
      </div>
    </div>

    <!-- 评论区域 -->
    <div v-if="comments.length > 0" class="comments-area">
      <div v-for="(comment, index) in comments" :key="index" class="comment-item">
        <span class="comment-username">{{ comment.username }}:</span>
        <span class="comment-content">{{ comment.content }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  likes: {
    type: Array,
    default: () => [],
  },
  comments: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.interaction-area {
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 10px;

  .likes-area {
    display: flex;
    align-items: center;
    padding-bottom: 6px;
    border-bottom: 1px solid #eee;
    margin-bottom: 6px;

    .like-icon {
      font-size: 14px;
      margin-right: 5px;
    }

    .like-users {
      font-size: 13px;
      color: #07c160;
    }
  }

  .comments-area {
    .comment-item {
      font-size: 13px;
      margin-bottom: 4px;
      line-height: 1.5;

      .comment-username {
        color: #07c160;
        margin-right: 4px;
      }

      .comment-content {
        color: #333;
      }
    }
  }
}
</style>
