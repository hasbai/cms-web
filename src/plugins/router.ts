import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
    name: 'Home',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
