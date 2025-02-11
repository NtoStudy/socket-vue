import {createWebHistory, createRouter} from 'vue-router'


const routes = [
  {
    path:'/',
    redirect: '/1'
  },
  {
    path: '/1',
    component: ()=>import('../view/login.vue')

  },{
    path: '/2',
    component: ()=>import('../view/chat.vue')
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
