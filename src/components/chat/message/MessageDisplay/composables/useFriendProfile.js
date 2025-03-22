import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getUsersInfoById, putUsersLike } from '@/api/user.js'
import { useUserInfoStore } from '@/store/user.js'

/**
 * 好友资料相关逻辑
 * @param {Object} friendOrChatRoom - 好友或聊天室信息
 * @returns {Object} - 好友资料相关的方法和状态
 */
export function useFriendProfile(friendOrChatRoom) {
  const friendInfo = ref()
  const isEditingRemark = ref(false)
  const remarkValue = ref('')
  const useUserInfo = useUserInfoStore()

  // 添加用户状态相关数据
  const currentStatus = computed(() => {
    return {
      id: '1',
      label: useUserInfo.userInfo.status || '在线',
    }
  })

  // 添加状态样式类的计算方式
  const statusClass = computed(() => {
    const labelMap = {
      在线: 'status-online',
      Q我吧: 'status-happy',
      离开: 'status-away',
      忙碌: 'status-busy',
      请勿打扰: 'status-dnd',
      隐身: 'status-invisible',
      我的电量: 'status-battery',
      听歌中: 'status-music',
      做好事: 'status-working',
      出去浪: 'status-travel',
      被掏空: 'status-empty',
      今日步数: 'status-steps',
      今日天气: 'status-weather',
      我crush了: 'status-crush',
    }
    return labelMap[currentStatus.value.label] || 'status-online'
  })

  /**
   * 获取好友信息
   */
  const getFriendInfo = async () => {
    try {
      // 确保 friendId 存在
      if (!friendOrChatRoom.friendId) {
        console.log('没有有效的 friendId')
        return
      }

      const res = await getUsersInfoById(friendOrChatRoom.friendId)
      if (res.data && res.data.data) {
        friendInfo.value = res.data.data
      } else {
        console.error('获取好友信息失败:', res)
      }
    } catch (error) {
      console.error('加载好友消息失败:', error)
      // 设置默认值，防止渲染错误
      friendInfo.value = { username: '未知用户', number: '', status: '在线' }
    }
  }

  /**
   * 处理点赞
   */
  const handleLike = async () => {
    console.log(123)
    const res = await putUsersLike(friendInfo.value.userId)
    if (res.data.code === 200) {
      // 此时点赞成功，应该更新点赞状态
      await getFriendInfo()
    }
  }

  /**
   * 开始编辑备注
   */
  const startEditRemark = () => {
    remarkValue.value = friendInfo.value?.remark || ''
    isEditingRemark.value = true
  }

  /**
   * 保存备注
   */
  const saveRemark = async (value) => {
    try {
      if (!friendOrChatRoom.friendId) {
        console.log('没有有效的 friendId')
        return
      }
      // 这里需要添加一个API调用来保存备注
      // const res = await updateFriendRemark(friendOrChatRoom.friendId, value || remarkValue.value)
      // 模拟API调用成功
      const res = { data: { code: 200 } }

      if (res.data.code === 200) {
        ElMessage.success('备注更新成功')
        isEditingRemark.value = false
        // 更新本地好友信息
        await getFriendInfo()
      } else {
        ElMessage.error('备注更新失败')
      }
    } catch (error) {
      console.error('更新备注失败:', error)
      ElMessage.error('备注更新失败')
    }
  }

  /**
   * 取消编辑备注
   */
  const cancelEditRemark = () => {
    isEditingRemark.value = false
  }

  // 只有当 friendId 存在时才调用
  watch(
    () => friendOrChatRoom.friendId,
    (newVal) => {
      if (newVal) {
        getFriendInfo()
      }
    },
    { immediate: true },
  )

  return {
    friendInfo,
    currentStatus,
    statusClass,
    isEditingRemark,
    remarkValue,
    getFriendInfo,
    handleLike,
    startEditRemark,
    saveRemark,
    cancelEditRemark,
  }
}
