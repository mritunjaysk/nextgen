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
      
      <!-- Credentials Table -->
      <div class="mt-4">
        <h5 class="text-center mb-3">Demo Credentials</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Role</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Admin</td>
              <td>admin@example.com</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary" @click="copyCredentials('admin@example.com')">
                  Copy to Login
                </button>
              </td>
            </tr>
            <tr>
              <td>User</td>
              <td>user@example.com</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary" @click="copyCredentials('user@example.com')">
                  Copy to Login
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-muted small text-center">Password for all accounts: "password"</p>
      </div>
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

    const copyCredentials = (emailValue) => {
      email.value = emailValue;
      password.value = 'password';
      successMessage.value = 'Credentials copied! Logging in automatically...';
      errorMessage.value = '';
      
      // Automatically trigger login after a short delay
      setTimeout(() => {
        handleLogin();
      }, 200);
    };

    return {
      email,
      password,
      errorMessage,
      successMessage,
      handleLogin,
      copyCredentials,
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

/* Added styles for credentials table */
.table {
  font-size: 0.9rem;
}
</style>