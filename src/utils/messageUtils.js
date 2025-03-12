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
 * @returns {Array} 格式化后的消息列表
 */
export const formatMessages = (messagesList) => {
  if (!Array.isArray(messagesList) || messagesList.length === 0) {
    return []
  }
  
  const now = new Date()
  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  
  // 首先保存原始时间戳用于比较
  const messagesWithOriginalTime = messagesList.map(message => ({
    ...message,
    originalTimestamp: new Date(message.sentTime).getTime()
  }))
  
  // 按时间排序（确保消息按时间顺序排列）
  messagesWithOriginalTime.sort((a, b) => a.originalTimestamp - b.originalTimestamp)
  
  return messagesWithOriginalTime.map((message, index, array) => {
    const sentDate = new Date(message.sentTime)
    
    // 格式化显示时间
    if (now - sentDate < oneDay) {
      // 如果在24小时之内，只显示时分秒
      message.sentTime = sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (sentDate.getFullYear() === now.getFullYear()) {
      // 如果在今年之内，显示月日时分
      message.sentTime = sentDate.toLocaleDateString([], {
        month: '2-digit',
        day: '2-digit',
      }) + ' ' + sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      // 如果不是今年，则显示年月日时分
      message.sentTime = sentDate.toLocaleDateString([], { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }) + ' ' + sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      
      // 如果时间差大于等于3分钟（180000毫秒），则显示时间戳
      message.showTimestamp = timeDifference >= 180000
    }
    
    return message
  })
}