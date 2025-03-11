<template>
  <div class="contact-list">
    <div class="category-box">
      <div class="category-tabs">
      <div class="tab" :class="{ active: activeTab === 'friends' }" @click="switchTab('friends')">
        好友
      </div>
      <div class="tab" :class="{ active: activeTab === 'groups' }" @click="switchTab('groups')">
        群聊
      </div>
    </div>
    </div>

    <div v-if="activeTab === 'friends'">
      <!-- 好友列表内容 -->
      <div class="contact-item" v-for="(item, index) in friendItems" :key="index">
        <div class="item-left">
          <span class="expand-icon">></span>
          <span class="contact-name">{{ item.name }}</span>
        </div>
        <div class="message-count" v-if="item.count">
          {{ item.count }}
        </div>
      </div>
    </div>

    <div v-else>
      <!-- 群聊列表内容 -->
      <div class="contact-item" v-for="(item, index) in groupItems" :key="index">
        <div class="item-left">
          <span class="expand-icon">></span>
          <span class="contact-name">{{ item.name }}</span>
        </div>
        <div class="message-count" v-if="item.count">
          {{ item.count }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定义属性
const props = defineProps({
  friendItems: {
    type: Array,
    default: () => []
  },
  groupItems: {
    type: Array,
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['tabChange'])

// 当前活动标签
const activeTab = ref('friends')

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab
  emit('tabChange', tab)
}
</script>

<style lang="scss" scoped>
// 分类标签样式


// 联系人列表样式
.contact-list {
  .category-box{
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

  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    cursor: pointer;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    .item-left {
      display: flex;
      align-items: center;
      
      .expand-icon {
        margin-right: 10px;
        color: #999;
        font-size: 12px;
      }
      
      .contact-name {
        font-size: 14px;
        color: #333;
      }
    }
    
    .message-count {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>