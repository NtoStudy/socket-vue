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

// 在路由实例创建后，使用路由守卫来处理重定向逻辑
router.beforeEach((to, from, next) => {
  if ((to.path === '/main' || to.path === '/main/chat') && from.path !== '/main/chat') {
    // 动态导入 store，避免在应用初始化前使用
    import('@/store/chat.js')
      .then((module) => {
        const chatStore = module.chatFriendOrChatRoomStore()
        console.log('路由守卫检查到的聊天状态:', chatStore.friendId, chatStore.chatRoomId)
        // 检查是否有上次的聊天记录
        if (chatStore.friendId) {
          // 如果有好友ID，重定向到好友聊天
          next({ path: `/main/chat/${chatStore.friendId}`, query: { fid: chatStore.friendId } })
        } else if (chatStore.chatRoomId) {
          // 如果有群聊ID，重定向到群聊
          next({ path: `/main/chat/${chatStore.chatRoomId}`, query: { gid: chatStore.chatRoomId } })
        } else {
          // 如果没有任何聊天记录，保持当前路由
          next()
        }
      })
      .catch((error) => {
        console.error('加载 store 失败:', error)
        next()
      })
  } else {
    // 其他路径正常通过
    next()
  }
})

export default router
