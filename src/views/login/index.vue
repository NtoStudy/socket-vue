<template>
  <el-container class="login-container">
    <el-main>
      <el-row justify="end">
        <el-col :span="10">
          <el-card class="login-card">
            <h2 class="login-title">{{ isRegister ? '用户注册' : '用户登录' }}</h2>
            <el-form v-if="!isRegister" :model="form" label-width="80px">
              <el-form-item label="用户名">
                <el-input v-model="form.number" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
                <el-button class="register-button" @click="handleRegister">注册</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="isRegister" :model="registerForm" label-width="80px">
              <el-form-item label="用户名">
                <el-input v-model="registerForm.number" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleRegisterSubmit" class="login-button">注册</el-button>
                <el-button class="register-button" @click="handleRegister">返回登录</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { userInfoByJwt, userLogin, userRegister } from '@/api/index.js' // 添加 userRegister 引入
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/store/user.js'

const userInfoStore = useUserInfoStore()
const router = useRouter()
const form = ref({
  number: '',
  password: '',
})
const registerForm = ref({
  number: '',
  password: '',
  confirmPassword: '',
})

const isRegister = ref(false) // 添加 isRegister 状态变量

const handleLogin = async () => {
  const res = await userLogin(form.value.number, form.value.password)
  userInfoStore.setToken(res.data.data)
  if (res.data.code === 200) {
    await nextTick(async () => {
      const response = await userInfoByJwt()
      console.log(response.data.data)
      userInfoStore.setUserInfo(response.data.data)
      await router.push('/main')
    })
  }
}

const handleRegister = () => {
  isRegister.value = !isRegister.value
}

// 添加注册提交方法
const handleRegisterSubmit = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  const res = await userRegister(registerForm.value.number, registerForm.value.password)
  alert('注册成功')
  isRegister.value = false // 注册成功后切换回登录表单
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;

  .login-card {
    margin: 0;
    padding: 30px;
    border-radius: 16px;
    width: 420px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;

    .login-title {
      text-align: center;
      margin-bottom: 30px;
      color: #303133;
      font-size: 24px;
      font-weight: bold;
    }

    .el-form-item {
      margin-bottom: 24px;
    }

    .el-button {
      width: 100%;
      margin-top: 12px;
    }

    .login-button {
      background-color: #409eff;
      border-color: #409eff;
      font-size: 16px;
    }

    .register-button {
      background-color: #f5f7fa;
      border-color: #c3cfe2;
      color: #303133;
      font-size: 16px;
    }
  }
}

.el-button + .el-button {
  margin-left: 0;
}
</style>
