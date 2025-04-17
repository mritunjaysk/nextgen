<template>
  <div v-if="!isLoginPage" class="left-menu">
    <router-link to="/home" active-class="active" class="menu-link">
      <i class="fas fa-home"></i> Home
    </router-link>
    <router-link v-if="isAdmin" to="/recipes" active-class="active" class="menu-link">
      <i class="fas fa-utensils"></i> Recipes
    </router-link>
    <router-link v-if="isAdmin" to="/recipes-table" active-class="active" class="menu-link">
      <i class="fas fa-table"></i> Recipes Table
    </router-link>
    <router-link v-if="isAdmin" to="/admin" active-class="active" class="menu-link">
      <i class="fas fa-users-cog"></i> Users
    </router-link>
    <router-link v-if="isLoggedIn" to="/" @click.native="handleLogout" class="menu-link">
      <i class="fas fa-sign-out-alt"></i> Logout
    </router-link>
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
  padding: 15px 10px;
  border-right: 1px solid #eee;
  height: 100vh;
}

.menu-link {
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  margin-bottom: 5px;
  border-radius: 5px;
  text-align: left;
  transition: background-color 0.2s ease;
}

.menu-link:hover {
  background-color: #f8f9fa;
}

.menu-link.active {
  background-color: #e9ecef;
  font-weight: bold;
}

.menu-link i {
  width: 20px;
  margin-right: 8px;
  text-align: center;
}
</style>