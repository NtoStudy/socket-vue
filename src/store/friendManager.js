// stores/friendManagerStore.js
import { defineStore } from 'pinia';

export const useFriendManagerStore = defineStore('friendManager', {
  state: () => ({
    selectedMenu: 'friend', // 当前选中的菜单：friend 或 group
    // 好友通知数据
    friendRequests: [
      {
        avatar: 'https://example.com/avatar1.jpg',
        name: '用户1',
        date: '2025/01/27',
        message: '你好！',
        status: '已同意'
      },
      {
        avatar: 'https://example.com/avatar2.jpg',
        name: '用户2',
        date: '2025/01/20',
        message: '很高兴认识你！',
        status: '已拒绝'
      }
    ],
    // 群通知数据
    groupRequests: [
      {
        avatar: 'https://example.com/groupAvatar1.jpg',
        name: '群1',
        date: '2025/01/20',
        message: '群公告更新！',
        status: '已同意'
      },
      {
        avatar: 'https://example.com/groupAvatar2.jpg',
        name: '群2',
        date: '2025/01/15',
        message: '群更新日志！',
        status: '已拒绝'
      }
    ]
  }),
  actions: {
    // 更新当前选中的菜单
    setSelectedMenu(menu) {
      this.selectedMenu = menu;
    }
  }
});
