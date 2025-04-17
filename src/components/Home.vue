<template>
  <div class="layout">
    <Menu />
    <main class="content">
      <div class="container mt-4">
        <h1 class="text-start mb-4">Our Recipes</h1>
        
        <!-- Recipe Cards Grid with Loading -->
        <LoadingSpinner v-if="loading" message="Loading recipes..." />
        
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="recipe in recipes" :key="recipe.id" class="col">
            <div class="card h-100 shadow-sm recipe-card" @click="openRecipeDetails(recipe)">
              <div class="card-img-container">
                <template v-if="recipe.media">
                  <LoadingSpinner v-if="!imageLoadedMap[recipe.id]" class="py-2" />
                  <img 
                    :src="getSupabaseUrl(recipe.media)" 
                    class="card-img-top recipe-image" 
                    alt="Recipe Image"
                    @load="setImageLoaded(recipe.id)"
                    @error="setImageError(recipe.id)"
                    :style="{ display: imageLoadedMap[recipe.id] ? 'block' : 'none' }"
                  >
                </template>
                <div v-else class="no-image-placeholder">
                  <i class="bi bi-image text-secondary"></i>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <h5 class="card-title">{{ recipe.title }}</h5>
                  <span class="badge rounded-pill" :class="getCategoryClass(recipe.category)">{{ recipe.category }}</span>
                </div>
                <p class="card-text text-truncate">{{ recipe.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-body-secondary">Cooking time: {{ recipe.cooking_time }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recipe Detail Modal (slides from right) -->
        <div class="recipe-modal" :class="{ 'show': isModalOpen }">
          <div v-if="isModalOpen" class="recipe-modal-backdrop" @click="closeRecipeDetails"></div>
          <div class="recipe-modal-content">
            <button type="button" class="btn-close float-end" @click="closeRecipeDetails"></button>
            
            <div v-if="selectedRecipe" class="recipe-details">
              <div class="mb-4">
                <LoadingSpinner v-if="!modalImageLoaded" message="Loading image..." />
                <img 
                  v-if="selectedRecipe.media" 
                  :src="getSupabaseUrl(selectedRecipe.media)" 
                  class="img-fluid rounded recipe-detail-image" 
                  alt="Recipe Image"
                  @load="modalImageLoaded = true"
                  @error="modalImageLoaded = true"
                  :style="{ display: modalImageLoaded ? 'block' : 'none' }"
                >
              </div>
              
              <h2 class="mb-3">{{ selectedRecipe.title }}</h2>
              
              <div class="mb-3 d-flex justify-content-between align-items-center">
                <span class="badge rounded-pill" :class="getCategoryClass(selectedRecipe.category)">{{ selectedRecipe.category }}</span>
                <span class="text-secondary">Cooking time: {{ selectedRecipe.cooking_time }}</span>
              </div>
              
              <div class="mb-4">
                <h5>Description</h5>
                <p>{{ selectedRecipe.description }}</p>
              </div>
              
              <div class="mb-4">
                <h5>Ingredients</h5>
                <ul class="ingredients-list">
                  <li v-for="(ingredient, index) in parseIngredients(selectedRecipe.ingredients)" :key="index">
                    {{ ingredient }}
                  </li>
                </ul>
              </div>
              
              <div class="mb-4">
                <h5>Steps</h5>
                <ul class="steps-list">
                  <li v-for="(step, index) in parseSteps(selectedRecipe.steps)" :key="index">
                    {{ step }}
                  </li>
                </ul>
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
import { ref, onMounted, reactive } from 'vue';
import { supabase } from '../main';
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  name: 'Home',
  components: {
    Menu,
    LoadingSpinner
  },
  setup() {
    const recipes = ref([]);
    const isModalOpen = ref(false);
    const selectedRecipe = ref(null);
    const loading = ref(true);
    const modalImageLoading = ref(false);
    const modalImageLoaded = ref(false);
    const imageLoadedMap = reactive({});

    const fetchRecipes = async () => {
      loading.value = true;
      try {
        const { data, error } = await supabase.from('recipes').select('*');
        if (error) throw error;
        recipes.value = data;
        
        // Initialize all images as not loaded
        recipes.value.forEach(recipe => {
          if (recipe.media) {
            imageLoadedMap[recipe.id] = false;
          }
        });
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        loading.value = false;
      }
    };

    const setImageLoaded = (recipeId) => {
      console.log(`Image loaded for recipe ${recipeId}`);
      imageLoadedMap[recipeId] = true;
    };

    const setImageError = (recipeId) => {
      console.log(`Image error for recipe ${recipeId}`);
      imageLoadedMap[recipeId] = true; // Set to true to hide loading spinner even on error
    };

    const openRecipeDetails = (recipe) => {
      selectedRecipe.value = recipe;
      isModalOpen.value = true;
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      // Reset image loading state for the modal
      modalImageLoaded.value = false;
    };

    const closeRecipeDetails = () => {
      isModalOpen.value = false;
      document.body.style.overflow = ''; // Re-enable scrolling
    };

    const getSupabaseUrl = (path) => {
      if (!path) return '';
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      return data.publicUrl;
    };

    const getCategoryClass = (category) => {
      switch (category) {
        case 'breakfast':
          return 'bg-success';
        case 'lunch':
          return 'bg-warning';
        case 'dinner':
          return 'bg-danger';
        default:
          return 'bg-primary';
      }
    };

    const parseIngredients = (ingredients) => {
      if (!ingredients) return [];
      return ingredients.split('\n').filter(item => item.trim());
    };

    const parseSteps = (steps) => {
      if (!steps) return [];
      return steps.split('\\n').filter(item => item.trim());
    };

    onMounted(fetchRecipes);

    return {
      recipes,
      isModalOpen,
      selectedRecipe,
      openRecipeDetails,
      closeRecipeDetails,
      getSupabaseUrl,
      getCategoryClass,
      parseIngredients,
      parseSteps,
      loading,
      modalImageLoading,
      imageLoadedMap,
      setImageLoaded,
      setImageError,
      modalImageLoaded
    };
  },
};
</script>

<style scoped>
.recipe-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-img-container {
  height: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #dee2e6;
}

/* Sliding modal styles */
.recipe-modal {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  z-index: 1050;
  transition: all 0.3s ease-in-out;
  display: flex;
}

.recipe-modal.show {
  right: 0;
}

.recipe-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.recipe-modal-content {
  position: absolute;
  top: 0;
  right: -600px;
  width: 100%;
  max-width: 550px;
  height: 100%;
  background-color: white;
  padding: 20px;
  overflow-y: auto;
  transition: right 0.3s ease-in-out;
}

.recipe-modal.show .recipe-modal-content {
  right: 0;
}

.recipe-detail-image {
  max-height: 300px;
  object-fit: cover;
}

.ingredients-list, .steps-list {
  padding-left: 20px;
}

.ingredients-list li, .steps-list li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .recipe-modal-content {
    max-width: 100%;
  }
}
.recipe-details{
  text-align: left !important;
}
</style>