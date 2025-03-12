import { createWebHistory, createRouter } from 'vue-router'
//TODO 如果有登录信息，则进入main没有则Login
const routes = [
  {
    path: '/',
    redirect: '/main',
  },
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/main',
    component: () => import('../views/index.vue'),
    redirect: '/main/chat',
    children: [
      {
        path: 'chat',
        component: () => import('../views/chat/index.vue'),
      },
      {
        path: 'friend',
        component: () => import('../views/friend/index.vue'),
      },
      {
        path: 'moments',
        component: () => import('../views/moments/index.vue'),
      },
      {
        path: 'settings',
        component: () => import('../views/setting/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
