import instance from '@/api/https.js'

/**
 * 用户登录接口
 * @param {string} number - 用户名
 * @param {string} password - 用户密码
 * @returns {Promise} - 返回包含JWT令牌的Promise对象
 */
export const userLogin = (number, password) =>
  instance({
    url: '/users/login',
    method: 'post',
    data: {
      number,
      password,
    },
  })

/**
 * 用户注册接口
 * @param {string} username - 用户名
 * @param {string} password - 用户密码
 * @returns {Promise} - 返回注册结果的Promise对象
 */
export const userRegister = (username, password) =>
  instance({
    url: '/users/register',
    method: 'post',
    data: {
      username,
      password,
    },
  })

/**
 * 获取当前登录用户信息接口
 * @returns {Promise} - 返回包含用户信息的Promise对象
 */
export const userInfoByJwt = () =>
  instance({
    url: '/users/info',
    method: 'get',
  })

/**
 * 根据用户账号查询用户信息接口
 * @param {string} number - 用户账号
 * @returns {Promise} - 返回包含用户状态信息的Promise对象
 */
export const getUserInfoByNumber = (number) =>
  instance({
    url: '/users/infoByNumber',
    method: 'get',
    params: {
      number,
    },
  })

/**
 * 在群聊中根据用户ID查询用户详细信息接口
 * @param {number} userId - 用户ID
 * @param {number} roomId - 群聊房间ID
 * @returns {Promise} - 返回包含群聊用户详细信息的Promise对象
 */
export const getUsersInfoInChatRoom = (userId, roomId) =>
  instance({
    url: '/users/userInfoByIdInGroup',
    method: 'get',
    params: {
      userId,
      roomId,
    },
  })

/**
 * 根据用户ID查询朋友圈详细信息接口
 * @param userId
 * @returns {*}
 */
export const getInfoByIdInMoment = (userId) =>
  instance({
    url: '/users/infoByIdInMoment',
    method: 'get',
    params: {
      userId,
    },
  })

/**
 * 根据用户ID查询好友详细信息接口
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回包含好友详细信息的Promise对象
 */
export const getUsersInfoById = (userId) =>
  instance({
    url: '/users/infoById',
    method: 'get',
    params: {
      userId,
    },
  })

/**
 * 更新当前用户个人信息接口
 * @param {object} userData - 用户数据对象
 * @returns {Promise} - 返回更新结果的Promise对象
 */
export const postUsersUpdate = (userData) =>
  instance({
    url: '/users/update',
    method: 'post',
    data: userData,
  })

/**
 * 给指定用户点赞接口
 * @param {number} friendId - 好友ID
 * @returns {Promise} - 返回点赞结果的Promise对象
 */
export const putUsersLike = (friendId) =>
  instance({
    url: '/users/like',
    method: 'put',
    params: {
      friendId,
    },
  })
