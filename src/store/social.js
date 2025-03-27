import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export const useSocialStore = defineStore('social', () => {
  // 点赞记录缓存
  const likeRecords = ref({}) // 格式: { userId: likeCount }

  /**
   * 点赞用户
   * @param {String} userId - 用户ID
   */
  const handleLike = async (userId) => {
    if (!userId) return false

    // try {
    //TODO: 调用点赞 API
    //   const res = await likeUser(userId)
    //   if (res.data.code === 200) {
    //     // 更新点赞数
    //     likeRecords.value[userId] = (likeRecords.value[userId] || 0) + 1
    //     ElMessage.success('点赞成功')
    //     return true
    //   }
    // } catch (error) {
    //   console.error('点赞失败:', error)
    //   ElMessage.error('点赞失败，请稍后重试')
    // }

    // return false
  }

  /**
   * 获取用户点赞数
   * @param {String} userId - 用户ID
   */
  const getLikeCount = (userId) => {
    return likeRecords.value[userId] || 0
  }

  return {
    likeRecords,
    handleLike,
    getLikeCount,
  }
})
