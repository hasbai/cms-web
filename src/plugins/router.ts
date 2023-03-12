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
  {
    path: '/callback',
    component: () => import('@/pages/Callback.vue'),
    name: 'Callback',
  },
  {
    path: '/pacman',
    component: () => import('@/pages/Pacman.vue'),
    name: 'Pacman',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
