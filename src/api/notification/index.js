import instance from "@/api/index.js";

/**
 * 处理好友通知的函数
 * 通过GET方法请求notifications/friend接口，获取好友通知的相关数据
 */
export const handleFriend = () => instance({
  url:'/notifications/friend',
  method:'get'
})

/**
 * 获取好友通知数量的函数
 * 通过POST方法请求notifications/friend接口，通常用于发送数据，这里可能用于确认或更新通知的已读状态
 */
export const friendNumber = () => instance({
  url:'/notifications/friend',
  method:'post'
})

/**
 * 处理聊天室通知的函数
 * 通过GET方法请求notifications/chatroom接口，获取聊天室通知的相关数据
 */
export const handleChatRoom = () => instance({
  url:'/notifications/chatroom',
  method:'get'
})

/**
 * 获取聊天室通知数量的函数
 * 通过POST方法请求notifications/chatroom接口，通常用于发送数据，这里可能用于确认或更新聊天室通知的已读状态
 */
export const chatRoomNumber = () => instance({
  url:'/notifications/chatroom',
  method:'post'
})
