import instance from '@/api/index.js'

/**
 * 用户登录函数
 * @param {string} number - 用户名或手机号
 * @param {string} password - 用户密码
 * @returns {Promise} - 返回登录请求的Promise对象
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
 * 用户注册函数
 * @param {string} username - 用户名
 * @param {string} password - 用户密码
 * @returns {Promise} - 返回注册请求的Promise对象
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
 * 获取用户信息函数
 * @returns {*}
 */
export const userInfoByJwt = () =>
  instance({
    url: '/users/info',
    method: 'get',
  })

/**
 * 用户登出函数
 * @returns {Promise} - 返回登出请求的Promise对象
 */
export const userLogout = () =>
  instance({
    url: '/users/logout',
    method: 'post',
  })

/**
 * 获取用户信息函数
 * @param {string} number - 用户ID
 * @returns {Promise} - 返回获取用户信息请求的Promise对象
 */
export const getUserInfoByNumber = (number) =>
  instance({
    url: '/users/infoByNumber',
    method: 'get',
    params: {
      number,
    },
  })

export const postUsersUpdate = (userData) =>
  instance({
    url: '/users/update',
    method: 'post',
    data: userData,
  })
