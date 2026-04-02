import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/play'
    },
    {
      path: '/simulation',
      redirect: '/play'
    },
    {
      path: '/solver',
      name: 'simulation',
      component: () => import('@/components/views/HomePage.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('@/components/views/PlayPage.vue')
    }
  ]
})

export default router
