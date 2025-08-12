import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', name: 'donat', component: () => import('../pages/Donation/DonateView.vue') },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('../pages/Statistic/StatsView.vue'),
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('../pages/News/NewsView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
