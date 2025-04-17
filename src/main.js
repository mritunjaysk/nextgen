import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createClient } from '@supabase/supabase-js';
import { ref } from 'vue';
import router from './router';
import Recipes from './components/Recipes.vue';

const SUPABASE_URL = 'https://pdrvqqwxxkmwzoihacep.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcnZxcXd4eGttd3pvaWhhY2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTAxOTUsImV4cCI6MjA2MDM4NjE5NX0.HyjSQ26bmoBLjG8UkzbqppASFEldad9vxWrEED9b0MQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const userSession = ref(null);

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  userSession.value = data.session;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  userSession.value = null;
}

export async function addDummyUser() {
  const { error } = await supabase.from('users').insert([
    {
      email: 'dummyuser@example.com',
      password: 'password123',
      role: 'user',
    },
  ]);
  if (error) console.error('Error adding dummy user:', error);
  else console.log('Dummy user added successfully');
}

createApp(App).use(router).mount('#app');
