<template>
  <div class="option-list">
    <!-- 置顶选项 -->
    <div class="option-item with-switch">
      <div class="option-info">
        <span class="option-text">设为置顶</span>
      </div>
      <el-switch :model-value="isGroupTop" @change="$emit('top-change', $event)" />
    </div>

    <!-- 我的本群昵称 -->
    <div class="option-item input-option">
      <div class="option-label">我的本群昵称</div>
      <el-input v-model="localNickname" :placeholder="nicknamePlaceholder" @blur="handleSaveNickname" />
    </div>

    <!-- 修改群名称 -->
    <div class="option-item input-option" v-if="isGroupOwner || isGroupAdmin">
      <div class="option-label">群聊昵称</div>
      <el-input v-model="localGroupName" :placeholder="groupNamePlaceholder" @blur="handleSaveGroupName" />
    </div>

    <!-- 修改群公告 -->
    <div class="option-item notice-option" @click="$emit('change-notice')" v-if="isGroupOwner || isGroupAdmin">
      <div class="option-info">
        <span class="option-text">群公告</span>
      </div>
      <div class="notice-preview" v-if="groupNotice">
        <div class="notice-content">{{ groupNotice.content }}</div>
      </div>
      <div class="notice-empty" v-else>
        <span>发布第一条公告</span>
      </div>
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>

    <!-- 解散/退出群聊 -->
    <div class="option-item delete" @click="$emit('dissolve-group')">
      <div class="option-info">
        <span class="option-text">{{ isGroupOwner ? '解散群聊' : '退出群聊' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  isGroupTop: {
    type: Boolean,
    default: false,
  },
  nickname: {
    type: String,
    default: '',
  },
  groupName: {
    type: String,
    default: '',
  },
  isGroupOwner: {
    type: Boolean,
    default: false,
  },
  isGroupAdmin: {
    type: Boolean,
    default: false,
  },
  groupNotice: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['top-change', 'save-nickname', 'save-group-name', 'change-notice', 'dissolve-group'])

// 本地状态
const localNickname = ref(props.nickname)
const localGroupName = ref(props.groupName)

// 监听props变化
watch(
  () => props.nickname,
  (newVal) => {
    if (newVal !== undefined) {
      localNickname.value = newVal
    }
  },
)

watch(
  () => props.groupName,
  (newVal) => {
    if (newVal) {
      localGroupName.value = newVal
    }
  },
)
// 处理保存群昵称
const handleSaveNickname = () => {
  // 如果昵称没有变化，不做任何操作
  if (localNickname.value === props.nickname) return

  ElMessageBox.confirm(`确定要将您的群昵称修改为 "${localNickname.value}" 吗？`, '修改群昵称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 用户点击确定，触发保存事件
      emit('save-nickname', localNickname.value)
    })
    .catch(() => {
      // 用户点击取消，恢复原来的昵称
      localNickname.value = props.nickname
    })
}

// 处理保存群名称
const handleSaveGroupName = () => {
  // 如果群名称没有变化，不做任何操作
  if (localGroupName.value === props.groupName) return

  ElMessageBox.confirm(`确定要将群聊名称修改为 "${localGroupName.value}" 吗？`, '修改群聊名称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 用户点击确定，触发保存事件
      emit('save-group-name', localGroupName.value)
    })
    .catch(() => {
      // 用户点击取消，恢复原来的群名称
      localGroupName.value = props.groupName
    })
}
// 计算属性
const nicknamePlaceholder = computed(() => {
  return localNickname.value ? localNickname.value : '我的群昵称'
})

const groupNamePlaceholder = computed(() => {
  return localGroupName.value ? localGroupName.value : '群聊名称'
})
</script>

<style lang="scss" scoped>
.option-list {
  padding: 0 0 20px 0;

  .option-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;

    &.input-option {
      flex-direction: column;
      align-items: flex-start;
      cursor: default;

      .option-label {
        font-size: 14px;
        margin-bottom: 8px;
      }
    }

    &:hover {
      background-color: #f9f9f9;
    }

    &.with-switch {
      cursor: default;
    }

    &.delete {
      display: flex;
      align-items: center;
      justify-content: center;

      .option-text {
        color: #ff4d4f;
        font-weight: 500;
      }
    }

    &.notice-option {
      flex-direction: column;
      align-items: flex-start;

      .option-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 8px;
      }

      .notice-preview {
        width: 100%;
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 8px 12px;
        margin-bottom: 8px;

        .notice-content {
          font-size: 13px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
      }

      .notice-empty {
        width: 100%;
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 8px 12px;
        margin-bottom: 8px;
        color: #999;
        font-size: 13px;
        text-align: center;
      }

      .el-icon {
        position: absolute;
        right: 16px;
        top: 16px;
      }
    }
  }
}
</style>
