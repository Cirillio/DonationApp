import { createWebHistory, createRouter } from 'vue-router'
import { APP_TITLE } from './shared/config/app-main'
import { navLinks } from '@/app/shared/config/navigation'

const routes = [
  {
    path: '/',
    redirect: navLinks[0].url,
  },
  {
    path: navLinks[0].url,
    name: navLinks[0].name,
    component: () => import('../pages/Donation/Page.vue'),
    meta: {
      title: navLinks[0].title,
      index: 0,
    },
  },
  {
    path: navLinks[1].url,
    name: navLinks[1].name,
    component: () => import('../pages/Statistic/StatsView.vue'),
    meta: {
      title: navLinks[1].title,
      index: 1,
    },
  },
  {
    path: navLinks[2].url,
    name: navLinks[2].name,
    component: () => import('../pages/News/NewsView.vue'),
    meta: {
      title: navLinks[2].title,
      index: 2,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound/Page.vue'),
    meta: { title: 'Страница не найдена' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Определение направления перехода для анимации карусели
router.beforeEach((to, from, next) => {
  const toIndex = to.meta.index as number | undefined
  const fromIndex = from.meta.index as number | undefined

  if (toIndex !== undefined && fromIndex !== undefined) {
    // Определяем направление: если переходим к странице с большим индексом - вниз, иначе - вверх
    to.meta.transitionDirection = toIndex > fromIndex ? 'down' : 'up'
  } else {
    // По умолчанию анимация вниз
    to.meta.transitionDirection = 'down'
  }

  next()
})

router.afterEach((to) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | ${APP_TITLE}`
  } else {
    document.title = APP_TITLE
  }
})

export default router
