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
      <el-input
        v-model="localNickname"
        :placeholder="nicknamePlaceholder"
        @blur="$emit('save-nickname', localNickname)"
      />
    </div>

    <!-- 修改群名称 -->
    <div class="option-item input-option" v-if="isGroupOwner || isGroupAdmin">
      <div class="option-label">群聊昵称</div>
      <el-input
        v-model="localGroupName"
        :placeholder="groupNamePlaceholder"
        @blur="$emit('save-group-name', localGroupName)"
      />
    </div>

    <!-- 修改群公告 -->
    <div class="option-item" @click="$emit('change-notice')" v-if="isGroupOwner || isGroupAdmin">
      <div class="option-info">
        <span class="option-text">设置群公告</span>
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
})

defineEmits(['top-change', 'save-nickname', 'save-group-name', 'change-notice', 'dissolve-group'])

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

      &:hover {
        background-color: transparent;
      }

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

    .option-info {
      display: flex;
      align-items: center;

      .option-text {
        font-size: 14px;
      }
    }
  }
}
</style>
