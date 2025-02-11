import instance from "./index.js";


export const userLogin = (number,password) => instance({
  url:'http://localhost:8080/users/login',
  method:'post',
  data:{
    number:number,
    password:password
  }
})

export const userInfoGetApi = () => instance({
  url:'/friends/friendlist',
  method:'get',
})
