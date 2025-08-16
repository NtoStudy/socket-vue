import instance from '@/api/https.js'

// 用户登录接口
export const userLogin = (number, password) =>
  instance({
    url: '/users/login',
    method: 'post',
    data: {
      number,
      password,
    },
  })

// 用户注册接口
export const userRegister = (username, password) =>
  instance({
    url: '/users/register',
    method: 'post',
    data: {
      username,
      password,
    },
  })

// 获取当前登录用户信息接口
export const userInfoByJwt = () =>
  instance({
    url: '/users/info',
    method: 'get',
  })

// 根据用户账号查询用户信息接口
export const getUserInfoByNumber = (number) =>
  instance({
    url: '/users/infoByNumber',
    method: 'get',
    params: {
      number,
    },
  })

// 在群聊中根据用户ID查询用户详细信息接口
export const getUsersInfoInChatRoom = (userId, roomId) =>
  instance({
    url: '/users/userInfoByIdInGroup',
    method: 'get',
    params: {
      userId,
      roomId,
    },
  })

// 根据用户ID查询朋友圈详细信息接口
export const getInfoByIdInMoment = (userId) =>
  instance({
    url: '/users/infoByIdInMoment',
    method: 'get',
    params: {
      userId,
    },
  })

// 根据用户ID查询好友详细信息接口
export const getUsersInfoById = (userId) =>
  instance({
    url: '/users/infoById',
    method: 'get',
    params: {
      userId,
    },
  })

// 更新当前用户个人信息接口
export const postUsersUpdate = (userData) =>
  instance({
    url: '/users/update',
    method: 'post',
    params: userData,
  })

// 给指定用户点赞接口
export const putUsersLike = (friendId) =>
  instance({
    url: '/users/like',
    method: 'put',
    params: {
      friendId,
    },
  })
