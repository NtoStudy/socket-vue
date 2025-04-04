<template>
  <el-scrollbar>
    <div class="moment-detail-view">
      <div class="detail-header">
        <div class="back-button" @click="goBack">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </div>
        <div class="header-title">朋友圈详情</div>
        <div class="placeholder"></div>
      </div>

      <div class="detail-content" v-if="moment">
        <div class="user-info">
          <img :src="userInfo.avatarUrl" alt="avatar" class="user-avatar" />
          <div class="user-name-time">
            <div class="username">{{ userInfo.username }}</div>
            <div class="time">{{ formatSentTime(moment.createdAt) }}</div>
          </div>
        </div>

        <div class="content-text">{{ moment.content }}</div>

        <!-- 图片区域 -->
        <div class="images-container" v-if="moment.mediaUrl">
          <el-image :src="moment.mediaUrl" :preview-src-list="moment.mediaUrl" fit="cover" class="detail-image" />
        </div>

        <!-- 点赞区域 -->
        <div class="likes-section">
          <div class="section-title">
            <el-icon>
              <Star />
            </el-icon>
            <span>点赞 {{ moment.likeCount }}</span>
          </div>
          <div class="likes-list">
            <div class="like-item" v-for="(like, index) in moment.likes" :key="index">
              <img :src="like.avatarUrl" alt="" class="friend-avatar" />
            </div>
          </div>
        </div>

        <!-- 评论区域 -->
        <div class="comments-section">
          <div class="section-title">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>评论 {{ moment.commentCount }}</span>
          </div>
          <div class="comments-list">
            <!-- 遍历顶级评论 -->
            <div v-for="(comment, index) in topLevelComments" :key="index" class="comment-thread">
              <!-- 顶级评论 -->
              <div class="comment-item">
                <img :src="defaultAvatar" alt="" class="comment-avatar" />
                <div class="comment-content-wrapper">
                  <div class="comment-user">{{ comment.username }}</div>
                  <div class="comment-content">{{ comment.content }}</div>
                  <div class="comment-footer">
                    <span class="comment-time">{{ formatSentTime(comment.createdAt) }}</span>
                    <span class="reply-btn" @click="replyToComment(comment)">回复</span>
                  </div>
                </div>
              </div>

              <!-- 递归渲染该评论的所有回复 -->
              <comment-replies
                :comments="moment.comments"
                :parent-id="comment.commentId"
                :default-avatar="defaultAvatar"
                @reply="replyToComment"
              />
            </div>
          </div>

          <!-- 没有评论时显示 -->
          <div v-if="!moment.comments || moment.comments.length === 0" class="no-comments">
            暂无评论，快来发表第一条评论吧
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="detail-footer" v-if="moment">
        <div class="action-item" @click="handleLike">
          <el-icon :class="{ liked: moment.isLiked }">
            <Star />
          </el-icon>
          <span>点赞</span>
        </div>
        <div class="action-item" @click="showCommentInput = true">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span>评论</span>
        </div>
      </div>

      <!-- 评论输入框 -->
      <div class="comment-input-container" v-if="showCommentInput">
        <el-input
          v-model="commentContent"
          placeholder="写评论..."
          :rows="2"
          type="textarea"
          resize="none"
          ref="commentInputRef"
        />
        <div class="comment-actions">
          <el-button @click="showCommentInput = false">取消</el-button>
          <el-button type="primary" @click="submitComment" :disabled="!commentContent.trim()">发送</el-button>
        </div>
      </div>

      <div class="loading-container" v-if="!moment">
        <el-empty description="加载中..." />
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Star, ChatDotRound } from '@element-plus/icons-vue'
import { formatSentTime } from '@/utils/messageUtils.js'
import { getPostDetail, getPostLikes, getPostComments, likePost, commentPost } from '@/api/modules/userPost.js'
import CommentReplies from './CommentReplies.vue'
const router = useRouter()
const route = useRoute()
const moment = ref(null)
const userInfo = ref({})
const showCommentInput = ref(false)
const commentContent = ref('')
const commentInputRef = ref(null)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' // 默认头像
// const replyingTo = ref(null) // 当前回复的评论
// 返回上一页
const goBack = () => {
  router.back()
}
// 计算顶级评论（没有父评论的评论）
const topLevelComments = computed(() => {
  if (!moment.value || !moment.value.comments) return []
  return moment.value.comments.filter((comment) => !comment.parentCommentId)
})

// 回复评论
const replyToComment = (comment) => {
  console.log('replyToComment', comment)
  // replyingTo.value = comment
  // showCommentInput.value = true
  // nextTick(() => {
  //   commentInputRef.value.focus()
  // })
}

// 获取朋友圈详情
console.log(route.params)
const fetchMomentDetail = async () => {
  const postId = route.params.id
  const res = await getPostDetail(Number(postId))
  if (res.data.code === 200) {
    moment.value = res.data.data
    const likesResponse = await getPostLikes(Number(postId))
    if (likesResponse.data.code === 200) {
      moment.value.likes = likesResponse.data.data
      console.log('likesResponse', moment.value.likes)
    }
    // 获取评论信息
    const commentsResponse = await getPostComments(Number(postId))
    if (commentsResponse.data.code === 200) {
      moment.value.comments = commentsResponse.data.data
      console.log('commentsResponse', moment.value.comments)
    }
  }
}

// 处理点赞
const handleLike = async () => {
  if (!moment.value) return

  try {
    const isCancel = moment.value.isLiked ? 1 : 0
    const response = await likePost(moment.value.id, isCancel)

    if (response.data.code === 200) {
      moment.value.isLiked = !moment.value.isLiked

      if (moment.value.isLiked) {
        moment.value.likeCount++
        // 添加当前用户到点赞列表
        if (!moment.value.likes) moment.value.likes = []
        moment.value.likes.push('当前用户')
      } else {
        moment.value.likeCount--
        // 从点赞列表中移除当前用户
        if (moment.value.likes) {
          const index = moment.value.likes.indexOf('当前用户')
          if (index !== -1) {
            moment.value.likes.splice(index, 1)
          }
        }
      }
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
  }
}

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim() || !moment.value) return

  try {
    const response = await commentPost(moment.value.id, commentContent.value)

    if (response.data.code === 200) {
      // 更新评论列表
      if (!moment.value.comments) moment.value.comments = []

      moment.value.comments.push({
        id: Date.now(), // 临时ID
        username: '我', // 当前用户
        content: commentContent.value,
        createdAt: new Date().toISOString(),
      })

      moment.value.commentCount++
      commentContent.value = ''
      showCommentInput.value = false
    }
  } catch (error) {
    console.error('评论失败:', error)
  }
}

onMounted(() => {
  fetchMomentDetail()
})
</script>

<style lang="scss" scoped>
.moment-detail-view {
  min-height: 100vh;
  width: 600px;
  margin: 0 auto;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;

  .detail-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    .back-button {
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
    }

    .header-title {
      font-size: 16px;
      font-weight: 500;
    }

    .placeholder {
      width: 24px;
    }
  }

  .detail-content {
    flex: 1;
    padding: 16px;
    background-color: #fff;
    margin: 10px;
    border-radius: 8px;

    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .user-avatar {
        width: 48px;
        height: 48px;
        background-color: #00bcd4;
        border-radius: 6px;
        margin-right: 12px;
        object-fit: cover;
      }

      .user-name-time {
        .username {
          font-size: 16px;
          font-weight: 500;
          color: #07c160;
          margin-bottom: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .content-text {
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      margin-bottom: 16px;
      word-break: break-all;
    }

    .images-container {
      display: flex;

      .detail-image {
        width: calc(33.33% - 6px);
        height: 120px;
        border-radius: 4px;
        cursor: pointer;
      }
    }

    .section-title {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #666;

      .el-icon {
        margin-right: 6px;
      }
    }

    .likes-section,
    .comments-section {
      padding: 12px 0;
      border-top: 1px solid #f0f0f0;
    }

    .likes-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .like-item {
        font-size: 14px;
        color: #07c160;
      }
    }

    .comments-list {
      .comment-item {
        display: flex;
        margin-bottom: 8px;

        .comment-user {
          font-size: 14px;
          color: #07c160;
          margin-right: 6px;
        }

        .comment-content {
          font-size: 14px;
          color: #333;
          flex: 1;
        }
      }
    }
  }

  .detail-footer {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    padding: 12px 0;
    background-color: #fff;
    box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.1);

    .action-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #666;

      .el-icon {
        margin-right: 6px;

        &.liked {
          color: #ff6b6b;
        }
      }

      &:hover {
        color: #07c160;
      }
    }
  }

  .comment-input-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 20;

    .comment-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
      gap: 8px;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
}

.friend-avatar {
  width: 32px;
  height: 32px;
  background-color: #00bcd4;
  border-radius: 6px;
  margin-right: 12px;
  object-fit: cover;
}
.comments-list {
  .comment-thread {
    margin-bottom: 16px;
  }

  .comment-item,
  .reply-item {
    display: flex;
    margin-bottom: 12px;

    .comment-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
    }

    .comment-content-wrapper {
      flex: 1;

      .comment-user {
        font-size: 14px;
        font-weight: 500;
        color: #07c160;
        margin-bottom: 4px;

        .reply-to {
          font-size: 12px;
          color: #999;
          margin: 0 4px;
        }

        .replied-user {
          color: #07c160;
        }
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

        .reply-btn {
          color: #07c160;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .reply-item {
    margin-left: 24px;
    margin-bottom: 8px;
  }
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 20px 0;
  font-size: 14px;
}

// 修改评论输入框样式
.comment-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 20;

  .replying-info {
    font-size: 12px;
    color: #07c160;
    margin-bottom: 8px;

    .cancel-reply {
      color: #999;
      margin-left: 8px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .comment-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    gap: 8px;
  }
}
</style>
