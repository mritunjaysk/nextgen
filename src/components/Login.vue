<template>
  <div class="login-container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4" style="width: 400px;">
      <h2 class="text-center mb-4">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3 text-start">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" required />
        </div>
        <div class="mb-3 text-start">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../main';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const successMessage = ref('');
    const router = useRouter();

    const handleLogin = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email.value)
          .eq('password', password.value)
          .single();

        if (error || !data) {
          errorMessage.value = 'Invalid email or password';
          successMessage.value = '';
        } else {
          sessionStorage.setItem('user', JSON.stringify(data));
          successMessage.value = 'Login successful! Redirecting to home...';
          errorMessage.value = '';
          setTimeout(() => {
            router.push('/home'); // Redirect to home page
          }, 1000);
        }
      } catch (err) {
        errorMessage.value = 'An error occurred during login';
        successMessage.value = '';
        console.error(err);
      }
    };

    return {
      email,
      password,
      errorMessage,
      successMessage,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-container {
  background-color: #f8f9fa;
}
.left-menu { 
    display: none !important;
    visibility: hidden !important;
}
</style>