/**
 * 格式化消息发送时间
 * @param {string} sentTime - 消息发送时间戳
 * @returns {string} 格式化后的时间字符串
 */
export const formatSentTime = (sentTime) => {
  if (!sentTime) {
    console.error('Invalid sentTime:', sentTime)
    return '' // 或者返回一个默认值
  }

  const now = new Date()
  const sentDate = new Date(sentTime)
  // 检查是否为有效日期
  if (isNaN(sentDate.getTime())) {
    console.error('Invalid date string:', sentTime)
    return '' // 或者返回一个默认值
  }

  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  if (now - sentDate < oneDay) {
    // 如果在24小时之内，只显示时分秒
    return sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } else if (sentDate.getFullYear() === now.getFullYear()) {
    // 如果在今年之内，只显示月份和日期
    return sentDate.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
  } else {
    // 如果不是今年，则显示年月日
    return sentDate.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
  }
}
/**
 * 截断消息内容
 * @param {string} content - 消息内容
 * @returns {string} 截断后的内容
 */
export const truncateContent = (content) => {
  if (content) {
    const maxLength = 10
    return content.length > maxLength ? content.slice(0, maxLength) + '...' : content
  }
  return content
}

/**
 * 格式化消息列表，处理时间显示和时间戳显示逻辑
 * @param {Array} messagesList - 消息列表
 * @param {Number} timestampInterval - 显示时间戳的最小时间间隔（毫秒），默认3分钟
 * @returns {Array} 格式化后的消息列表
 */
export const formatMessages = (messagesList, timestampInterval = 180000) => {
  if (!Array.isArray(messagesList) || messagesList.length === 0) {
    return []
  }

  const now = new Date()
  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数

  // 首先保存原始时间戳用于比较
  const messagesWithOriginalTime = messagesList
    .map((message) => {
      // 确保消息对象有效
      if (!message) return null

      try {
        let timestamp

        // 检查 sentTime 的格式
        if (typeof message.sentTime === 'string') {
          // 如果只有时间部分（如 "13:21" 或 "13:21:40"）
          if (/^\d{1,2}:\d{1,2}(:\d{1,2})?$/.test(message.sentTime)) {
            // 使用当前日期 + 提供的时间
            const [hours, minutes, seconds = '00'] = message.sentTime.split(':')
            const today = new Date()
            today.setHours(parseInt(hours, 10))
            today.setMinutes(parseInt(minutes, 10))
            today.setSeconds(parseInt(seconds, 10))
            timestamp = today.getTime()
          } else {
            // 尝试正常解析日期时间字符串
            timestamp = new Date(message.sentTime).getTime()
          }
        } else {
          // 如果不是字符串，尝试直接转换
          timestamp = new Date(message.sentTime).getTime()
        }

        // 检查时间戳是否有效
        if (isNaN(timestamp)) {
          console.warn('Invalid timestamp for message:', message)
          // 使用当前时间作为备用
          timestamp = Date.now()
        }

        return {
          ...message,
          originalTimestamp: timestamp,
        }
      } catch (error) {
        console.error('Error processing message:', error, message)
        return {
          ...message,
          originalTimestamp: Date.now(), // 使用当前时间作为备用
        }
      }
    })
    .filter((message) => message !== null)

  // 按时间排序（确保消息按时间顺序排列）
  messagesWithOriginalTime.sort((a, b) => a.originalTimestamp - b.originalTimestamp)

  return messagesWithOriginalTime.map((message, index, array) => {
    try {
      // 使用原始时间戳创建日期对象
      const sentDate = new Date(message.originalTimestamp)

      // 格式化显示时间
      if (now - sentDate < oneDay) {
        // 如果在24小时之内，只显示时分
        message.formattedTime = sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else if (sentDate.getFullYear() === now.getFullYear()) {
        // 如果在今年之内，显示月日时分
        message.formattedTime =
          sentDate.toLocaleDateString([], {
            month: '2-digit',
            day: '2-digit',
          }) +
          ' ' +
          sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        // 如果不是今年，则显示年月日时分
        message.formattedTime =
          sentDate.toLocaleDateString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }) +
          ' ' +
          sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      // 保留原始的 sentTime，但添加格式化后的时间
      if (typeof message.sentTime === 'string') {
        message.sentTime = message.formattedTime
      }

      // 确定是否显示时间戳
      if (index === 0) {
        // 第一条消息总是显示时间戳
        message.showTimestamp = true
      } else {
        // 计算与前一条消息的时间差（毫秒）
        const previousTimestamp = array[index - 1].originalTimestamp
        const currentTimestamp = message.originalTimestamp
        const timeDifference = currentTimestamp - previousTimestamp

        // 如果时间差大于等于指定间隔，则显示时间戳
        message.showTimestamp = timeDifference >= timestampInterval
      }

      return message
    } catch (error) {
      console.error('Error formatting message:', error, message)
      // 返回原始消息，但添加默认时间戳显示
      return {
        ...message,
        showTimestamp: index === 0, // 只有第一条消息显示时间戳
      }
    }
  })
}

/**
 * 处理右键点击消息事件
 * @param {Object} message - 被点击的消息对象
 * @param {Event} event - 鼠标事件对象
 * @param {Function} deleteCallback - 删除消息后的回调函数
 * @param {Object} messageApi - Element Plus 的消息 API
 * @param {Object} confirmApi - Element Plus 的确认框 API
 * @param {Function} deleteMessageApi - 删除消息的 API 函数
 * @param {Function} deleteChatRoomApi - 删除群聊消息的 API 函数
 */
export const handleRightClickMessage = (
  message,
  event,
  deleteCallback,
  messageApi,
  confirmApi,
  deleteMessageApi,
  deleteChatRoomApi,
) => {
  // 防止默认的右键行为
  event.preventDefault()

  /**
   * 删除消息函数
   * @param {String} messageId - 消息ID
   * @param {String} chatRoomId - 聊天室ID，如果消息属于聊天室则提供
   */
  const deleteMessage = async (messageId, chatRoomId) => {
    try {
      let res
      if (chatRoomId) {
        // 如果是聊天室消息，调用聊天室消息删除API
        res = await deleteChatRoomApi(chatRoomId, messageId)
      } else {
        // 如果是个人消息，调用个人消息删除API
        res = await deleteMessageApi(messageId)
      }
      if (res.data.code === 200) {
        // 消息删除成功，显示成功提示
        messageApi.success('消息已删除')
        // 触发消息删除事件
        deleteCallback(message)
      }
    } catch (error) {
      // 消息删除失败，显示错误提示
      console.error('删除消息时出错:', error)
      messageApi.error('删除消息失败')
    }
  }

  // 弹出确认框，确认是否删除消息
  confirmApi.confirm('确定要删除该消息吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    callback: async (action) => {
      if (action === 'confirm') {
        // 确认删除，调用删除消息函数
        await deleteMessage(message.messageId, message.chatRoomId)
      }
    },
  })
}
