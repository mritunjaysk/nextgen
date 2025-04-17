<template>
  <div class="layout">
    <Menu />
    <main class="content">
      <div class="container mt-4">
        <h1 class="mb-4 text-start"> User Management</h1>

        <!-- Create User Button -->
        <div class="d-flex justify-content-end mb-4">
          <button class="btn btn-primary" @click="openModal('add')">Add User</button>
        </div>

        <!-- User List -->
        <LoadingSpinner v-if="loading" message="Loading users..." />
        <table v-else class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2 text-start" @click="openModal('edit', user)">Edit</button>
                <button class="btn btn-sm btn-danger text-start" @click="deleteUser(user.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal -->
        <div class="modal fade show" tabindex="-1" style="display: block;" v-if="isModalOpen">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-start">{{ modalType === 'add' ? 'Add User' : 'Edit User' }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body text-start">
                <form @submit.prevent="modalType === 'add' ? createUser() : updateUser()">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input v-model="modalUser.email" type="email" class="form-control" id="email" placeholder="Enter email" required />
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input v-model="modalUser.password" type="password" class="form-control" id="password" placeholder="Enter password" :required="modalType === 'add'" />
                  </div>
                  <div class="mb-3">
                    <label for="role" class="form-label">Role</label>
                    <select v-model="modalUser.role" class="form-select" id="role">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button type="submit" class="btn btn-success text-start">{{ modalType === 'add' ? 'Create User' : 'Update User' }}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Menu from './Menu.vue';
import { ref, onMounted } from 'vue';
import { supabase } from '../main';
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  name: 'Admin',
  components: {
    Menu,
    LoadingSpinner
  },
  setup() {
    const users = ref([]);
    const isModalOpen = ref(false);
    const modalType = ref('add');
    const modalUser = ref({ email: '', password: '', role: 'user' });
    const loading = ref(true);

    const fetchUsers = async () => {
      loading.value = true;
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
          console.error('Error fetching users:', error);
        } else {
          users.value = data;
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        loading.value = false;
      }
    };

    const openModal = (type, user = null) => {
      modalType.value = type;
      modalUser.value = user ? { ...user } : { email: '', password: '', role: 'user' };
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const createUser = async () => {
      const { error } = await supabase.from('users').insert([modalUser.value]);
      if (error) console.error(error);
      else {
        fetchUsers();
        closeModal();
      }
    };

    const updateUser = async () => {
      const { id, ...updatedData } = modalUser.value;
      const { error } = await supabase.from('users').update(updatedData).eq('id', id);
      if (error) console.error(error);
      else {
        fetchUsers();
        closeModal();
      }
    };

    const deleteUser = async (id) => {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) console.error(error);
      else fetchUsers();
    };

    onMounted(fetchUsers);

    return {
      users,
      isModalOpen,
      modalType,
      modalUser,
      openModal,
      closeModal,
      createUser,
      updateUser,
      deleteUser,
      loading
    };
  },
};
</script>

<style src="../global.css"></style>
