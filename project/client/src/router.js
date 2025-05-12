import { createRouter, createWebHistory } from 'vue-router'
import RecycleMap from './views/Map.vue'
import UserRegister from './views/Register.vue'
import UserProfile from './views/Profile.vue'
import DataWipe from './views/DataWipe.vue'
import EvaluateWaste from './views/EvaluateWaste.vue'
import ScanQR from './views/ScanQR.vue'
import Rewards from './views/Rewards.vue'

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
    },
    {
      path: '/data-wipe',
      name: 'data-wipe',
      component: DataWipe,
      meta: { hideBody: true }
    },
    {
      path: '/evaluate',
      name: 'evaluate',
      component: EvaluateWaste,
      meta: { hideBody: true }
    },
    {
      path: '/scan',
      name: 'scan',
      component: ScanQR,
      meta: { hideBody: true, requiresAuth: true }
    },
    {
      path: '/rewards',
      name: 'rewards',
      component: Rewards,
      meta: { hideBody: true, requiresAuth: true }
    }
  ]
})

export default router
