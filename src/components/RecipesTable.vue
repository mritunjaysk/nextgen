<template>
  <div class="layout">
    <Menu />
    <main class="content">
      <div class="container mt-4">
        <h1 class="mb-4 text-start">Recipe Management - Bulk Update</h1>
        
        <div class="mb-3" style="text-align: right;">
          <button class="btn btn-primary" @click="saveAllChanges">Save All Changes</button>
          <span v-if="saveStatus" class="ms-3" :class="saveStatus === 'Saved!' ? 'text-success' : 'text-danger'">{{ saveStatus }}</span>
        </div>
        
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Cooking Time</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="recipe in recipes" :key="recipe.id">
                <td>{{ recipe.id }}</td>
                <td>
                  <input type="text" class="form-control" v-model="recipe.title" />
                </td>
                <td>
                  <select class="form-select" v-model="recipe.category">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </td>
                <td>
                  <input type="text" class="form-control" v-model="recipe.cooking_time" />
                </td>
                <td>
                  <textarea class="form-control" v-model="recipe.description" rows="2"></textarea>
                </td>
                <td class="">
                  <button class="btn btn-sm btn-info me-2" @click="viewDetails(recipe)">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Recipe Detail Modal -->
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Recipe Details: {{ selectedRecipe?.title }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body" v-if="selectedRecipe">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Ingredients</label>
                    <textarea class="form-control" v-model="selectedRecipe.ingredients" rows="8"></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Steps</label>
                    <textarea class="form-control" v-model="selectedRecipe.steps" rows="8"></textarea>
                  </div>
                </div>
                <div v-if="selectedRecipe.media" class=" mb-3">
                  <img :src="getSupabaseUrl(selectedRecipe.media)" class="img-fluid rounded" style="max-height: 200px;" />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                <button type="button" class="btn btn-primary" @click="saveRecipe">Save changes</button>
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
import { HotTable } from '@handsontable/vue3';
import 'handsontable/dist/handsontable.full.min.css';

export default {
  name: 'RecipesTable',
  components: {
    Menu,
    HotTable
  },
  setup() {
    const recipes = ref([]);
    const selectedRecipe = ref(null);
    const showModal = ref(false);
    const saveStatus = ref('');
    
    const fetchRecipes = async () => {
      try {
        const { data, error } = await supabase.from('recipes').select('*');
        if (error) throw error;
        recipes.value = data;
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    const saveAllChanges = async () => {
      saveStatus.value = 'Saving...';
      try {
        for (const recipe of recipes.value) {
          const { error } = await supabase
            .from('recipes')
            .update({
              title: recipe.title,
              category: recipe.category,
              cooking_time: recipe.cooking_time,
              description: recipe.description
            })
            .eq('id', recipe.id);
          
          if (error) throw error;
        }
        saveStatus.value = 'Saved!';
        setTimeout(() => {
          saveStatus.value = '';
        }, 3000);
      } catch (error) {
        saveStatus.value = 'Error saving changes';
        console.error('Error saving recipes:', error);
      }
    };

    const viewDetails = (recipe) => {
      selectedRecipe.value = { ...recipe };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedRecipe.value = null;
    };

    const saveRecipe = async () => {
      try {
        const { error } = await supabase
          .from('recipes')
          .update({
            ingredients: selectedRecipe.value.ingredients,
            steps: selectedRecipe.value.steps
          })
          .eq('id', selectedRecipe.value.id);
        
        if (error) throw error;
        
        // Update the local data
        const index = recipes.value.findIndex(r => r.id === selectedRecipe.value.id);
        if (index !== -1) {
          recipes.value[index].ingredients = selectedRecipe.value.ingredients;
          recipes.value[index].steps = selectedRecipe.value.steps;
        }
        
        closeModal();
      } catch (error) {
        console.error('Error saving recipe:', error);
      }
    };

    const getSupabaseUrl = (path) => {
      if (!path) return '';
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      return data.publicUrl;
    };

    onMounted(fetchRecipes);

    return {
      recipes,
      selectedRecipe,
      showModal,
      saveStatus,
      fetchRecipes,
      saveAllChanges,
      viewDetails,
      closeModal,
      saveRecipe,
      getSupabaseUrl
    };
  }
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

input.form-control, select.form-select, textarea.form-control {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
}

.modal-backdrop {
  opacity: 0.5;
}
</style>