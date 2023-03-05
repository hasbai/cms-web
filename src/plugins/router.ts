import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
    name: 'Home',
  },
  {
    path: '/edit/:id(\\d+)?',
    component: () => import('@/pages/Editor.vue'),
    name: 'Editor',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
