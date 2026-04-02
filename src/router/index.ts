import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/simulation'
    },
    {
      path: '/simulation',
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
