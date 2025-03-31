import { createWebHistory, createRouter } from 'vue-router'
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
        // 新增带参数的聊天路由
        path: 'chat/:id',
        component: () => import('../views/chat/index.vue'),
        props: true,
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
