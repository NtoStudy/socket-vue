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

export const formatMessages = (messagesList) => {
  const now = new Date()
  return messagesList.map((message, index, array) => {
    const sentDate = new Date(message.sentTime)
    const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数

    if (now - sentDate < oneDay) {
      // 如果在24小时之内，只显示时分秒
      message.sentTime = sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } else if (sentDate.getFullYear() === now.getFullYear()) {
      // 如果在今年之内，只显示月份和日期
      message.sentTime = sentDate.toLocaleDateString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
    } else {
      // 如果不是今年，则显示年月日
      message.sentTime = sentDate.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
    }

    if (index > 0) {
      const currentTimestamp = sentDate.getTime()
      const previousTimestamp = new Date(array[index - 1].sentTime).getTime()
      const timeDifference = currentTimestamp - previousTimestamp
      message.showTimestamp = timeDifference >= 180000
    } else {
      message.showTimestamp = true
    }
    return message
  })
}
