<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <img src="" alt="Logo" class="logo" />
    </div>
    <div class="sidebar-body">
      <div
        class="sidebar-item"
        v-for="(item, index) in sidebarItems"
        :key="index"
        :class="{ active: activeRoute === item.route }"
      >
        <el-tooltip
          :content="item.tooltip"
          placement="right"
          effect="light"
        >
          <span class="sidebar-icon" @click="handleRoute(item.route)">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
          </span>
        </el-tooltip>
      </div>
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-item" @click="handleRoute('/main/settings')">
        <el-tooltip
          content="设置"
          placement="right"
          effect="light"
        >
          <span class="sidebar-icon">
            <el-icon><Setting /></el-icon>
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 计算当前活动路由
const activeRoute = computed(() => {
  return route.path
})

// 侧边栏项目数据
const sidebarItems = ref([
  { icon: 'ChatDotRound', badge: false, route: '/main/chat', tooltip: '聊天' },
  { icon: 'User', badge: false, route: '/main/friend', tooltip: '联系人' },
  { icon: 'PictureFilled', badge: false, route: '/main/moments', tooltip: '朋友圈' },
])

// 路由跳转处理
const handleRoute = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 60px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;

  .sidebar-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .logo {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      background-color: #4caf50;
    }
  }

  .sidebar-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;
    flex: 1;

    .sidebar-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        background-color: #e0e0e0;
      }

      &.active {
        background-color: #e6f7ff;

        .sidebar-icon {
          color: #1890ff; // 选中时图标变为蓝色
        }

        &::before {
          content: '';
          position: absolute;
          left: 0;
          width: 3px;
          height: 20px;
          background-color: #1890ff;
          border-radius: 0;
        }
      }

      .sidebar-icon {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.45); // 透明度颜色

        .el-icon {
          font-size: 20px;
        }
      }
    }
  }

  .sidebar-footer {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;

    .sidebar-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #e0e0e0;
      }

      .sidebar-icon {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.45); // 透明度颜色

        .el-icon {
          font-size: 20px;
        }
      }
    }
  }
}
</style>