import { createRouter, createWebHistory } from 'vue-router'
import RecycleMap from './views/Map.vue'
import UserRegister from './views/Register.vue'
import UserProfile from './views/Profile.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/map',
      name: 'map',
      component: RecycleMap,
      meta: { hideBody: true }
    },
    {
      path: '/register',
      name: 'register',
      component: UserRegister,
      meta: { hideBody: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile,
      meta: { hideBody: true, requiresAuth: true }
    }
  ]
})

export default router
