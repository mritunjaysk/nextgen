import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Admin from './components/Admin.vue';
import Login from './components/Login.vue';
import Recipes from './components/Recipes.vue';
import RecipesTable from './components/RecipesTable.vue';
import { supabase } from './main';

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home },
  { path: '/admin', component: Admin, meta: { requiresAdmin: true } },
  { path: '/recipes', component: Recipes },
  { path: '/recipes-table', component: RecipesTable },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (to.path !== '/' && !user) {
    next('/');
  } else if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next('/home');
  } else {
    next();
  }
});

export default router;