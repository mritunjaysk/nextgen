<template>
  <div class="app-container">
    <div class="left-menu">
      <router-link to="/" active-class="active">Home</router-link>
      <router-link to="/admin" active-class="active">Admin</router-link>
      <router-link to="/menu" active-class="active">Menu</router-link>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.app-container {
  display: flex;
}
</style>