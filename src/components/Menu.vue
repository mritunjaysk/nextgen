<template>
  <div v-if="!isLoginPage" class="left-menu">
    <router-link to="/home" active-class="active">Home</router-link>
    <router-link v-if="isAdmin" to="/admin" active-class="active">Admin</router-link>
    <router-link v-if="isLoggedIn" to="/" @click.native="handleLogout">Logout</router-link>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: "Menu",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isLoggedIn = ref(false);
    const isLoginPage = ref(false);
    const isAdmin = ref(false);

    const handleLogout = () => {
      sessionStorage.removeItem('user');
      isLoggedIn.value = false;
      router.push('/');
    };

    const checkLoginStatus = () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      isLoggedIn.value = !!user;
      isAdmin.value = user?.role === 'admin';
    };

    const checkIfLoginPage = () => {
      isLoginPage.value = route.path === '/';
    };

    onMounted(() => {
      checkLoginStatus();
      checkIfLoginPage();
    });

    watch(() => route.path, () => {
      checkIfLoginPage();
    });

    return {
      isLoggedIn,
      isLoginPage,
      isAdmin,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.left-menu {
  width: 200px;
  background-color: #fff;
  padding: 10px;
}
</style>