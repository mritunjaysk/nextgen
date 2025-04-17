<template>
  <div class="layout">
    <Menu />
    <main class="content">
      <div class="container mt-4">
        <h1>Welcome to the Home Page</h1>
        <p>This is the new home page of the application.</p>
      </div>
    </main>
  </div>
</template>

<script>
import Menu from './Menu.vue';

export default {
  name: 'Home',
  components: {
    Menu,
  },
};
</script>

<style src="../global.css"></style>