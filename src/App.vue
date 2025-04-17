<script setup>
</script>

<template>
  <div class="app-container">
    <div class="left-menu">
      <router-link to="/" active-class="active">Home</router-link>
      <router-link to="/admin" active-class="active">Admin</router-link>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
}
</style>
