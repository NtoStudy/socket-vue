import {createWebHistory, createRouter} from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/login',
    component: () => import('../view/login/index.vue')

  }, {
    path: '/main',
    component: () => import('../view/index.vue'),
    redirect: '/main/chat',
    children: [
      {
        path: 'chat',
        component: () => import('../view/chat/index.vue')
      },
      {
        path: 'friend',
        component: () => import('../view/friend/index.vue')
      }
    ]
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {top: 0}
    }
  }
})

export default router
