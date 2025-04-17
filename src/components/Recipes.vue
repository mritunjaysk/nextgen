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
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(recipe, index) in recipes" :key="recipe.id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ recipe.title }}</td>
              <td>{{ recipe.category }}</td>
              <td>{{ recipe.cooking_time }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2 text-start" @click="openModal('edit', recipe)">Edit</button>
                <button class="btn btn-sm btn-danger text-start" @click="deleteRecipe(recipe.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal -->
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
                    <input v-model="modalRecipe.media" type="text" class="form-control" id="media" placeholder="Enter media URL" />
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
      cooking_time: '', // Updated key
    });

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

    const createRecipe = async () => {
      const { error } = await supabase.from('recipes').insert([modalRecipe.value]);
      if (error) console.error(error);
      else {
        fetchRecipes();
        closeModal();
      }
    };

    const updateRecipe = async () => {
      const { id, ...updatedData } = modalRecipe.value;
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

    onMounted(fetchRecipes);

    return {
      recipes,
      isModalOpen,
      modalType,
      modalRecipe,
      openModal,
      closeModal,
      createRecipe,
      updateRecipe,
      deleteRecipe,
    };
  },
};
</script>

<style src="../global.css"></style>