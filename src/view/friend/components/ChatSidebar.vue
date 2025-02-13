<template>
  <div class="sidebar">
    <div class="sidebar-items">
      <div class="sidebar-item">
        <img src="" alt="friend notification" />
        <span>好友通知</span>
      </div>
      <div class="sidebar-item">
        <img src="" alt="group notification" />
        <span>群通知</span>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.sidebar {
  width: 300px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding: 10px;
}
.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.sidebar-search input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.sidebar-items {
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  display: flex;
  padding: 8px;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.sidebar-item img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

</style>
