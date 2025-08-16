import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getUsersInfoInChatRoom, getUsersInfoById } from '@/api/index.js'

export const useProfilesStore = defineStore('profiles', () => {
  // 用户信息缓存
  const userProfiles = ref({}) // 格式: { userId: userInfo }

  // 群成员信息缓存
  const groupMemberProfiles = ref({}) // 格式: { roomId: { userId: memberInfo } }

  // 获取用户信息
  const getUserProfile = async (userId) => {
    if (!userId) return null

    // 如果缓存中已有该用户信息，直接返回
    if (userProfiles.value[userId]) {
      return userProfiles.value[userId]
    }

    try {
      const res = await getUsersInfoById(userId)
      if (res.data.code === 200) {
        userProfiles.value[userId] = res.data.data
        return res.data.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    }

    return null
  }

  // 获取群成员信息
  const getGroupMemberProfile = async (userId, roomId) => {
    if (!userId || !roomId) return null

    // 初始化群成员缓存
    if (!groupMemberProfiles.value[roomId]) {
      groupMemberProfiles.value[roomId] = {}
    }

    try {
      const res = await getUsersInfoInChatRoom(userId, roomId)
      if (res.data.code === 200) {
        groupMemberProfiles.value[roomId][userId] = res.data.data
        return res.data.data
      }
    } catch (error) {
      console.error('获取群成员信息失败:', error)
      ElMessage.error('获取群成员信息失败')
    }

    return null
  }

  // 批量获取群成员信息
  const getGroupMembersProfiles = async (userIds, roomId) => {
    if (!userIds || !userIds.length || !roomId) return []
    const promises = userIds.map((userId) => getGroupMemberProfile(userId, roomId))
    const results = await Promise.all(promises)
    return results.filter((result) => result !== null)
  }

  // 清除缓存
  const clearCache = () => {
    userProfiles.value = {}
    groupMemberProfiles.value = {}
  }

  return {
    userProfiles,
    groupMemberProfiles,
    getUserProfile,
    getGroupMemberProfile,
    getGroupMembersProfiles,
    clearCache,
  }
})
