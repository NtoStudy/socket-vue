<template>
  <div v-if="visible" class="custom-popup-overlay" @click="$emit('update:visible', false)">
    <div class="custom-popup" @click.stop>
      <div class="popup-header">
        <span class="popup-close" @click="$emit('update:visible', false)">×</span>
      </div>

      <div class="status-popup">
        <!-- 当前状态显示区域 -->
        <div class="current-status-section">
          <div class="status-icon large" :class="getStatusClass(modelValue.label)"></div>
          <span class="status-text">{{ modelValue.label }}</span>
        </div>

        <!-- 状态选择区域 -->
        <div class="status-grid-container">
          <div class="status-grid">
            <!-- 自定义状态按钮 -->
            <div class="status-item" @click="$emit('toggle-custom-input')">
              <div class="status-icon custom-icon">
                <el-icon>
                  <Plus />
                </el-icon>
              </div>
              <span class="status-text">自定义</span>
            </div>

            <!-- 所有状态选项 -->
            <div
              v-for="status in statusOptions"
              :key="status.id"
              class="status-item"
              :class="{ active: modelValue.id === status.id }"
              @click="handleStatusChange(status)"
            >
              <div class="status-icon" :class="getStatusClass(status.label)"></div>
              <span class="status-text">{{ status.label }}</span>
            </div>
          </div>
        </div>

        <!-- 自定义状态输入区域 (条件显示) -->
        <div v-if="showCustomInput" class="custom-status-input">
          <el-input v-model="customStatusText" placeholder="设置自定义状态" clearable @keyup.enter="setCustomStatus">
            <template #append>
              <el-button @click="setCustomStatus">确定</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { postUsersUpdate } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/store/user.js'
import { getStatusClass } from '@/utils/statusUtils.js'
const userStore = useUserInfoStore()

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Object,
    required: true,
  },
  statusOptions: {
    type: Array,
    required: true,
  },
  showCustomInput: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:visible', 'update:modelValue', 'toggle-custom-input', 'set-custom-status'])

const customStatusText = ref('')

// 添加状态更新处理函数
const handleStatusChange = async (status) => {
  const res = await postUsersUpdate({
    status: status.label,
  })
  if (res.data.code === 200) {
    // 更新状态
    emit('update:modelValue', status)
    userStore.userInfo = {
      ...userStore.userInfo,
      status: status.label,
    }
    ElMessage.success('状态更新成功')
  } else {
    ElMessage.error('状态更新失败')
  }
}

const setCustomStatus = () => {
  if (customStatusText.value.trim()) {
    emit('set-custom-status', customStatusText.value)
    customStatusText.value = ''
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/status.scss';

.custom-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.custom-popup {
  width: 400px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: popup-fade 0.2s ease-out;
}

@keyframes popup-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-header {
  padding: 10px 15px;
  background-color: #66b0ff;
  display: flex;
  justify-content: right;
  align-items: center;

  .popup-close {
    color: white;
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
  }
}

.status-popup {
  border-radius: 0 0 8px 8px;
  overflow: hidden;

  .current-status-section {
    padding: 30px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #66b0ff, #96c8ff);
    position: relative;

    .status-icon.large {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-bottom: 10px;
      position: relative;
      z-index: 1;
    }

    .status-text {
      font-size: 16px;
      font-weight: 500;
      color: white;
      position: relative;
      z-index: 1;
    }
  }

  .status-grid-container {
    background: linear-gradient(to bottom, #96c8ff, #e1ecff);

    padding: 15px;

    .status-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 8px;
      padding: 15px;
    }
  }

  .status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #b7d0eb;
    }

    &.active {
      background-color: #0099ff;
    }

    .status-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-text {
      font-size: 12px;
      color: #333;
      text-align: center;
    }
  }

  .custom-status-input {
    padding: 15px;
    background-color: #f0f0f0;
  }
}
</style>
