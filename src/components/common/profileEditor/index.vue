<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑资料"
    width="500px"
    :close-on-click-modal="false"
    custom-class="edit-profile-dialog"
  >
    <div class="edit-profile-container">
      <!-- 头像编辑区域 -->
      <div class="avatar-edit-section">
        <div class="avatar-wrapper">
          <img :src="modelValue.avatar || ''" alt="用户头像" class="edit-avatar" />
          <div class="avatar-overlay">
            <el-icon><Plus /></el-icon>
          </div>
        </div>
      </div>

      <!-- 表单区域 -->
      <el-form :model="formData" label-width="70px" class="profile-form">
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" maxlength="36">
            <template #append>
              <span class="input-counter">{{ formData.nickname.length }}/36</span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="个性签名">
          <el-input
            v-model="formData.signature"
            type="textarea"
            :rows="2"
            maxlength="80"
            show-word-limit
            resize="none"
          ></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-select v-model="formData.gender" placeholder="请选择">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
            v-model="formData.birthday"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="国家">
          <el-select v-model="formData.country" placeholder="请选择">
            <el-option label="中国" value="china"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="省份">
          <el-select v-model="formData.province" placeholder="请选择" :disabled="formData.country !== 'china'">
            <el-option label="请选择" value=""></el-option>
            <el-option
              v-for="province in provinces"
              :key="province.value"
              :label="province.label"
              :value="province.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地区">
          <el-select v-model="formData.city" placeholder="请选择" :disabled="!formData.province">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="city in cities" :key="city.value" :label="city.label" :value="city.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      nickname: '.',
      signature: '爱在黄昏日落时',
      gender: 'male',
      birthday: '1988-01-01',
      country: 'china',
      province: '',
      city: '',
      avatar: '',
    }),
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'update:visible', 'save'])

// 表单数据
const formData = reactive({ ...props.modelValue })

// 对话框可见性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// 省份数据
const provinces = ref([
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广东', value: 'guangdong' },
  { label: '江苏', value: 'jiangsu' },
  { label: '浙江', value: 'zhejiang' },
])

// 城市数据（根据选择的省份动态变化）
const cities = computed(() => {
  const provinceCities = {
    beijing: [{ label: '北京市', value: 'beijing' }],
    shanghai: [{ label: '上海市', value: 'shanghai' }],
    guangdong: [
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
      { label: '珠海', value: 'zhuhai' },
    ],
    jiangsu: [
      { label: '南京', value: 'nanjing' },
      { label: '苏州', value: 'suzhou' },
      { label: '无锡', value: 'wuxi' },
    ],
    zhejiang: [
      { label: '杭州', value: 'hangzhou' },
      { label: '宁波', value: 'ningbo' },
      { label: '温州', value: 'wenzhou' },
    ],
  }

  return formData.province ? provinceCities[formData.province] || [] : []
})

// 监听省份变化，重置城市选择
watch(
  () => formData.province,
  () => {
    formData.city = ''
  },
)

// 监听props变化，更新表单数据
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(formData, newVal)
  },
  { deep: true },
)

// 取消编辑
const handleCancel = () => {
  dialogVisible.value = false
}

// 保存用户资料
const handleSave = () => {
  emit('update:modelValue', { ...formData })
  emit('save', formData)
  dialogVisible.value = false
  ElMessage.success('资料保存成功')
}
</script>

<style lang="scss" scoped>
:deep(.edit-profile-dialog) {
  .el-dialog__header {
    margin: 0;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 500;
    }

    .el-dialog__headerbtn {
      top: 15px;
    }
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    padding: 10px 20px;
    border-top: 1px solid #eee;
  }
}

.edit-profile-container {
  .avatar-edit-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .avatar-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;

      .edit-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: #e0e0e0;
      }

      .avatar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;

        .el-icon {
          font-size: 24px;
          color: white;
        }
      }

      &:hover .avatar-overlay {
        opacity: 1;
      }
    }
  }

  .profile-form {
    .input-counter {
      font-size: 12px;
      color: #999;
    }

    .el-form-item {
      margin-bottom: 15px;
    }
  }
}
</style>
