import { defineStore } from 'pinia'
import {ref} from "vue";

export const useUserInfoStore = defineStore('user', () =>{
  const userInfo = ref()
  const token = ref()
  const setUserInfo = (newUserInfo) => {
    userInfo.value = newUserInfo
  }
  const setToken = (newToken) => {
    token.value = newToken
  }
  const clearUserInfo = ()=>{
    userInfo.value = ''
  }
  const clearToken = ()=>{
    token.value = ''
  }
  return {
    userInfo,
    token,
    setUserInfo,
    setToken,
    clearUserInfo,
    clearToken
  }
},{
  persist: true,
})
