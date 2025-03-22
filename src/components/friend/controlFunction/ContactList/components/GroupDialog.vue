<template>
  <el-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :title="type === 'add' ? '添加分组' : '重命名分组'"
    width="30%"
    center
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-content">
      <el-input v-model="groupNameInput" placeholder="填写分组" maxlength="20" show-word-limit />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" plain>取消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="!groupNameInput.trim()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'add',
  },
  groupName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const groupNameInput = ref('')

// 监听 groupName 变化
watch(
  () => props.groupName,
  (newVal) => {
    groupNameInput.value = newVal
  },
  { immediate: true },
)

// 监听对话框显示状态变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      groupNameInput.value = ''
    }
  },
)

const handleConfirm = () => {
  if (!groupNameInput.value.trim()) {
    ElMessage.warning('分组名称不能为空')
    return
  }

  emit('confirm', groupNameInput.value.trim())
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 10px;
}

:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 15px 20px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__body) {
  padding: 10px 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
  border-top: none;
}

:deep(.el-button) {
  min-width: 100px;
  border-radius: 4px;
}
</style>
