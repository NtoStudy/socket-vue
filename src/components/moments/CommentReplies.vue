<template>
  <div class="replies-container">
    <div v-for="reply in allReplies" :key="reply.commentId" class="reply-item">
      <img :src="defaultAvatar" alt="" class="comment-avatar" />
      <div class="comment-content-wrapper">
        <div class="comment-user">
          {{ reply.username }}
          <span class="reply-to">回复</span>
          <span class="replied-user">{{ getReplyTargetName(reply) }}</span>
        </div>
        <div class="comment-content">{{ reply.content }}</div>
        <div class="comment-footer">
          <span class="comment-time">{{ formatSentTime(reply.createdAt) }}</span>
          <span class="reply-btn" @click="$emit('reply', reply)">回复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatSentTime } from '@/utils/messageUtils.js'

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
  parentId: {
    type: Number,
    required: true,
  },
  defaultAvatar: {
    type: String,
    default: '',
  },
})
console.log('allReplies', props)
defineEmits(['reply'])

// 获取所有与当前父评论相关的回复（包括直接回复和间接回复）
const allReplies = computed(() => {
  // 先找出直接回复当前评论的评论
  const directReplies = props.comments.filter((comment) => comment.parentCommentId === props.parentId)
  // 创建一个集合来存储所有相关回复
  const allRelatedReplies = [...directReplies]
  // 递归查找所有间接回复
  const findNestedReplies = (replyIds) => {
    if (replyIds.length === 0) return
    const newReplies = props.comments.filter((comment) => replyIds.includes(comment.parentCommentId))
    if (newReplies.length > 0) {
      allRelatedReplies.push(...newReplies)
      findNestedReplies(newReplies.map((reply) => reply.commentId))
    }
  }
  // 查找所有间接回复
  findNestedReplies(directReplies.map((reply) => reply.commentId))
  // 按时间排序
  return allRelatedReplies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
})
// 获取回复目标的用户名
const getReplyTargetName = (reply) => {
  const parent = props.comments.find((c) => c.commentId === reply.parentCommentId)
  return parent ? parent.username : ''
}
</script>

<style scoped lang="scss">
.replies-container {
  margin-left: 48px; /* 所有回复都只缩进一次 */
}

.reply-item {
  display: flex;
  margin-bottom: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.comment-content-wrapper {
  flex: 1;
}

.comment-user {
  font-size: 14px;
  font-weight: 500;
  color: #07c160;
  margin-bottom: 4px;
}

.reply-to {
  font-size: 12px;
  color: #999;
  margin: 0 4px;
}

.replied-user {
  color: #07c160;
}

.comment-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 4px;
  word-break: break-all;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.reply-btn {
  color: #07c160;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
