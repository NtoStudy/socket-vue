<script setup>
import { onMounted, ref } from 'vue'
import MomentsHeader from '@/components/moments/MomentsHeader.vue'
import MomentItem from '@/components/moments/MomentItem.vue'
import { getPostAllList } from '@/api/modules/userPost.js'

// 模拟朋友圈数据
const momentsList = ref([])

const getMomentsList = async () => {
  const res = await getPostAllList()
  if (res.data.code === 200) {
    momentsList.value = res.data.data.list
  }
}

// 更新朋友圈项目
const updateMomentItem = (updatedItem) => {
  const index = momentsList.value.findIndex((item) => item.id === updatedItem.id)
  if (index !== -1) {
    // 先关闭所有其他项的操作菜单
    momentsList.value.forEach((moment) => {
      if (moment.id !== updatedItem.id) {
        moment.showActions = false
      }
    })
    // 更新当前项
    momentsList.value[index] = updatedItem
  }
}
onMounted(() => {
  getMomentsList()
})
</script>

<template>
  <div class="moments-container">
    <!-- 顶部导航栏 -->
    <moments-header />

    <!-- 朋友圈内容列表 -->
    <div class="moments-content">
      <div class="moments-wrapper">
        <moment-item v-for="item in momentsList" :key="item.id" :item="item" @update:item="updateMomentItem" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moments-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f7f7;

  .moments-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
    display: flex;
    justify-content: center;

    .moments-wrapper {
      width: 100%;
      max-width: 600px;
    }
  }
}
</style>
