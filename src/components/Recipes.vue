<template>
  <div class="layout">
    <Menu />
    <main class="content">
      <div class="container mt-4">
        <h1 class="mb-4 text-start">Recipe Management</h1>

        <!-- Create Recipe Button -->
        <div class="d-flex justify-content-end mb-4">
          <button class="btn btn-primary" @click="openModal('add')">Add Recipe</button>
        </div>

        <!-- Recipe List -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Category</th>
              <th scope="col">Cooking Time</th>
              <th scope="col">Description</th>
              <th scope="col">Ingredients</th>
              <th scope="col">Steps</th>
              <th scope="col">Media</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(recipe, index) in recipes" :key="recipe.id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ recipe.title }}</td>
              <td>{{ recipe.category }}</td>
              <td>{{ recipe.cooking_time }}</td>
              <td>{{ recipe.description }}</td>
              <td>{{ recipe.ingredients }}</td>
              <td>{{ recipe.steps }}</td>
              <td>
                <a v-if="recipe.media" href="#" @click.prevent="openImageModal(recipe.media)">View File</a>
                <span v-else>No Media</span>
              </td>
              <td>
                <button class="btn btn-sm btn-warning me-2 text-start" @click="openModal('edit', recipe)">Edit</button>
                <button class="btn btn-sm btn-danger text-start" @click="deleteRecipe(recipe.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Recipe Modal -->
        <div class="modal fade show" tabindex="-1" style="display: block;" v-if="isModalOpen">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-start">{{ modalType === 'add' ? 'Add Recipe' : 'Edit Recipe' }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body text-start">
                <form @submit.prevent="modalType === 'add' ? createRecipe() : updateRecipe()">
                  <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input v-model="modalRecipe.title" type="text" class="form-control" id="title" placeholder="Enter title" required />
                  </div>
                  <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea v-model="modalRecipe.description" class="form-control" id="description" placeholder="Enter description" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="ingredients" class="form-label">Ingredients</label>
                    <textarea v-model="modalRecipe.ingredients" class="form-control" id="ingredients" placeholder="Enter ingredients" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="steps" class="form-label">Steps</label>
                    <textarea v-model="modalRecipe.steps" class="form-control" id="steps" placeholder="Enter steps" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="media" class="form-label">Media</label>
                    <input type="file" class="form-control" id="media" @change="handleFileUpload" />
                    <!-- Preview for existing image when editing -->
                    <div v-if="modalType === 'edit' && modalRecipe.media" class="mt-2">
                      <p>Current image:</p>
                      <img 
                        :src="getSupabaseUrl(modalRecipe.media)" 
                        alt="Current Recipe Image" 
                        style="max-height: 150px; max-width: 100%;" 
                        class="img-thumbnail"
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="category" class="form-label">Category</label>
                    <select v-model="modalRecipe.category" class="form-select" id="category">
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="cookingTime" class="form-label">Cooking Time</label>
                    <input v-model="modalRecipe.cooking_time" type="text" class="form-control" id="cookingTime" placeholder="Enter cooking time" required />
                  </div>
                  <button type="submit" class="btn btn-success text-start">{{ modalType === 'add' ? 'Create Recipe' : 'Update Recipe' }}</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Preview Modal -->
        <div class="modal fade show" tabindex="-1" style="display: block;" v-if="isImageModalOpen">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-start">Image Preview</h5>
                <button type="button" class="btn-close" @click="closeImageModal"></button>
              </div>
              <div class="modal-body text-center">
                <img :src="currentImageUrl" class="img-fluid" alt="Recipe Image" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeImageModal">Close</button>
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

export default {
  name: 'Recipes',
  components: {
    Menu,
  },
  setup() {
    const recipes = ref([]);
    const isModalOpen = ref(false);
    const modalType = ref('add');
    const modalRecipe = ref({
      title: '',
      description: '',
      ingredients: '',
      steps: '',
      media: '',
      category: 'breakfast',
      cooking_time: '',
    });
    
    // Image preview modal
    const isImageModalOpen = ref(false);
    const currentImageUrl = ref('');

    const uploadedFile = ref(null);

    const fetchRecipes = async () => {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) console.error(error);
      else recipes.value = data;
    };

    const openModal = (type, recipe = null) => {
      modalType.value = type;
      modalRecipe.value = recipe ? { ...recipe } : {
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        media: '',
        category: 'breakfast',
        cooking_time: '',
      };
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        uploadedFile.value = file;
      }
    };

    const createRecipe = async () => {
      let mediaUrl = '';
      if (uploadedFile.value) {
        const uniqueFileName = `recipes/${Date.now()}_${uploadedFile.value.name}`;
        const { data, error } = await supabase.storage.from('uploads').upload(uniqueFileName, uploadedFile.value);
        if (error) {
          console.error('File upload error:', error);
          return;
        }
        mediaUrl = data.path;
      }

      const recipeData = { ...modalRecipe.value, media: mediaUrl };
      const { error } = await supabase.from('recipes').insert([recipeData]);
      if (error) console.error(error);
      else {
        fetchRecipes();
        closeModal();
      }
    };

    const updateRecipe = async () => {
      let mediaUrl = modalRecipe.value.media;
      if (uploadedFile.value) {
        const uniqueFileName = `recipes/${Date.now()}_${uploadedFile.value.name}`;
        const { data, error } = await supabase.storage.from('uploads').upload(uniqueFileName, uploadedFile.value);
        if (error) {
          console.error('File upload error:', error);
          return;
        }
        mediaUrl = data.path;
      }

      const { id, ...updatedData } = { ...modalRecipe.value, media: mediaUrl };
      const { error } = await supabase.from('recipes').update(updatedData).eq('id', id);
      if (error) console.error(error);
      else {
        fetchRecipes();
        closeModal();
      }
    };

    const deleteRecipe = async (id) => {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) console.error(error);
      else fetchRecipes();
    };

    const getSupabaseUrl = (path) => {
      if (!path) return '';
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      console.log('Generated Supabase URL:', data.publicUrl);
      return data.publicUrl;
    };

    const openImageModal = (path) => {
      if (!path) return;
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      currentImageUrl.value = data.publicUrl;
      isImageModalOpen.value = true;
    };

    const closeImageModal = () => {
      isImageModalOpen.value = false;
      currentImageUrl.value = '';
    };

    onMounted(fetchRecipes);

    return {
      recipes,
      isModalOpen,
      modalType,
      modalRecipe,
      openModal,
      closeModal,
      handleFileUpload,
      createRecipe,
      updateRecipe,
      deleteRecipe,
      getSupabaseUrl,
      // Image modal
      isImageModalOpen,
      currentImageUrl,
      openImageModal,
      closeImageModal
    };
  },
};
</script>

<style src="../global.css"></style>