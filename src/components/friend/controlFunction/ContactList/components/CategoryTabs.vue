<template>
  <div class="category-box">
    <div class="category-tabs">
      <div class="tab" :class="{ active: modelValue === 'friends' }" @click="$emit('update:modelValue', 'friends')">
        好友
      </div>
      <div class="tab" :class="{ active: modelValue === 'groups' }" @click="$emit('update:modelValue', 'groups')">
        群聊
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.category-box {
  display: flex;
  justify-content: center;
  align-items: center;

  .category-tabs {
    width: 80%;
    display: flex;
    background-color: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 15px;

    .tab {
      flex: 1;
      text-align: center;
      padding: 10px 0;
      cursor: pointer;
      font-size: 14px;
      color: #666;

      &.active {
        background-color: #fff;
        color: #0099ff;
        font-weight: 500;
      }
    }
  }
}
</style>
