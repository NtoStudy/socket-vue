<template>
  <div class="chat-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="" alt="Logo" class="logo"/>
      </div>
      <div class="sidebar-body">
        <div class="sidebar-item" v-for="(item, index) in sidebarItems" :key="index">
          <span class="sidebar-icon" @click="handleRoute(item.route)">{{ item.icon }}</span>
        </div>
      </div>
    </div>
    <div class="side">
      <router-view/>
    </div>
  </div>


</template>

<script setup>
import {onMounted, ref} from 'vue';
import router from "@/router/index.js";

// Sidebar items data
const sidebarItems = ref([
  {icon: '💬', badge: false, route: '/main/chat'},
  {icon: '👤', badge: false, route: '/main/friend'},
]);

const handleRoute = (ev) => {
  router.push(ev)
}



onMounted(()=>{

})
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  width: 100%;
  height: 100vh;

  .sidebar {
    width: 80px;
    background-color: #ccd0d2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

    .sidebar-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #4caf50;
      }
    }

    .sidebar-body {
      display: flex;
      flex-direction: column;
      align-items: center;

      .sidebar-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        position: relative;

        .sidebar-icon {
          font-size: 24px;
          color: #333;
        }

        &:hover {
          background-color: #e0e0e0;
          border-radius: 50%;
        }
      }
    }
  }

  .side {
    flex: 1;
  }
}

</style>
