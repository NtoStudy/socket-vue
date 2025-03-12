<script setup>
import { ref } from 'vue'

// 模拟朋友圈数据
const momentsList = ref([
  {
    id: 1,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '南航科院帮帮团 人满加2号ramelsa',
    content: '【投稿】想问一下学校哪里可以现金换位置钱',
    time: '3小时前',
    likes: ['小羽','小羽'],
    comments: [
      {
        username: '南航科院帮帮团 人满加2号ramelsa',
        content: '给兄弟买包瓜子去'
      },
      {
        username: '南航科院帮帮团 人满加2号ramelsa',
        content: '哈哈，本人来了，没想到只是随手一捡就被发到表白墙了'
      }
    ],
    isLiked: false,
    showActions: true
  },
  {
    id: 2,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    username: '南航科院帮帮团 人满加2号ramelsa',
    content: '【投稿】瑶瑶 问一下有没有人收isoo澳门场的票 22号的 朋友帮忙多抢了四张 998和900的各多两张💰 有的加我一下～到时候可以一起去🧩',
    time: '2分钟前',
    images: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
    likes: [],
    comments: [],
    isLiked: false,
    showActions: false
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
    showActions: false
  }
])

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
}

// 处理评论
const handleComment = (item) => {
  console.log('评论', item)
  item.showActions = false
  // 这里可以添加评论逻辑
}

// 切换操作菜单显示状态
const toggleActions = (item) => {
  // 先关闭所有其他项的操作菜单
  momentsList.value.forEach(moment => {
    if (moment.id !== item.id) {
      moment.showActions = false
    }
  })
  // 切换当前项的操作菜单
  item.showActions = !item.showActions
}
</script>

<template>
  <div class="moments-container">
    <!-- 顶部导航栏 -->
    <div class="moments-header">
      <div class="title">朋友圈</div>
    </div>

    <!-- 朋友圈内容列表 -->
    <div class="moments-content">
      <div class="moments-wrapper">
        <div v-for="item in momentsList" :key="item.id" class="moment-item">
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
            <div v-if="item.images && item.images.length" class="images-container">
              <div 
                v-for="(image, index) in item.images" 
                :key="index" 
                class="image-item"
                @click="handleImageClick(image)"
              >
                <img :src="image" alt="moment image" />
              </div>
            </div>
            
            <!-- 点赞和评论区域 -->
            <div v-if="item.likes.length > 0 || item.comments.length > 0" class="interaction-area">
              <!-- 点赞区域 -->
              <div v-if="item.likes.length > 0" class="likes-area">
                <div class="like-icon">❤️</div>
                <div class="like-users">
                  <span v-for="(like, index) in item.likes" :key="index">
                    {{ like }}{{ index < item.likes.length - 1 ? '、' : '' }}
                  </span>
                </div>
              </div>
              
              <!-- 评论区域 -->
              <div v-if="item.comments.length > 0" class="comments-area">
                <div v-for="(comment, index) in item.comments" :key="index" class="comment-item">
                  <span class="comment-username">{{ comment.username }}:</span>
                  <span class="comment-content">{{ comment.content }}</span>
                </div>
              </div>
            </div>
            
            <!-- 底部信息：时间和操作按钮 -->
            <div class="moment-footer">
              <div class="time">{{ item.time }}</div>
              <div class="actions-wrapper">
                <!-- 操作按钮 -->
                <div class="action-button" @click="toggleActions(item)">
                  <i class="action-dots">⋯</i>
                </div>
                
                <!-- 操作菜单 -->
                <div v-if="item.showActions" class="action-menu">
                  <div class="action-menu-item" @click="handleLike(item)">
                    <el-icon style="position: relative; top: 2px; right: 2px;"><Apple /></el-icon >
                    <span>{{ item.isLiked ? '取消' : '' }}赞</span>
                  </div>
                  <div class="action-menu-item" @click="handleComment(item)">
                    <el-icon  style="position: relative; top: 2px; right: 2px;"><ChatLineSquare /></el-icon>
                    <span>评论</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  
  .moments-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px;
    background-color: #fff;
    border-bottom: 1px solid #eaeaea;
    position: sticky;
    top: 0;
    z-index: 10;
    
    .title {
      font-size: 16px;
      font-weight: 500;
    }
  }
  
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
        
        .images-container {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
          
          .image-item {
            width: 33.33%;
            padding: 2px;
            box-sizing: border-box;
            cursor: pointer;
            
            img {
              width: 100%;
              height: 100px;
              object-fit: cover;
              border-radius: 4px;
            }
          }
        }
        
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
        
        .moment-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .time {
            font-size: 12px;
            color: #999;
          }
          
          .actions-wrapper {
            position: relative;
            
            .action-button {
              cursor: pointer;
              padding: 5px;
              
              .action-dots {
                font-size: 18px;
                color: #999;
                font-style: normal;
              }
            }
            
            .action-menu {
              display: flex;
              position: absolute;
              right: 0;
              bottom: 30px;
              background-color: #333;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
              z-index: 10;
              
              &::after {
                content: '';
                position: absolute;
                bottom: -5px;
                right: 10px;
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid #333;
              }
              
              .action-menu-item {
                padding: 8px 15px;
                color: white;
                font-size: 14px;
                cursor: pointer;
                white-space: nowrap;
                
                &:hover {
                  background-color: #444;
                }
                
                &:not(:last-child) {
                  border-bottom: 1px solid #444;
                }
              }
            }
          }
        }
      }
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
  }
}
</style>