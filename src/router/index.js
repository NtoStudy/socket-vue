import {createWebHistory, createRouter} from 'vue-router'


const routes = [
  {
    path:'/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: ()=>import('../view/login.vue')

  },{
    path: '/chat',
    component: ()=>import('../view/chat/index.vue')
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
