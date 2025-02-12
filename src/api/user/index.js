import instance from "../index.js";

export const userLogin = (number, password) => instance({
  url: '/users/login',
  method: 'post',
  data: {
    number,
    password
  }
})

export const userRegister = (username, password) => instance({
  url: '/users/register',
  method: 'post',
  data: {
    username,
    password
  }
})
