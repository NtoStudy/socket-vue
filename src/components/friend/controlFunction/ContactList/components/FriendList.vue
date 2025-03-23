<template>
  <div>
    <div v-for="(item, index) in friendItems" :key="index">
      <!-- 分组标题 -->
      <div class="contact-item" @click="toggleGroup(item)" @contextmenu.prevent="onContextMenu($event, item)">
        <div class="item-left">
          <el-icon class="expand-icon" :class="{ 'is-expanded': expandedGroups.includes(item.groupId) }">
            <ArrowRight />
          </el-icon>
          <span class="contact-name">{{ item.groupName }}</span>
        </div>
        <div class="message-count" v-if="item.memberCount">
          {{ item.memberCount }}
        </div>
      </div>

      <!-- 好友列表 -->
      <div class="friend-list" v-if="expandedGroups.includes(item.groupId)">
        <div
          v-for="(friend, friendIndex) in friendGroupMap[item.groupId] || []"
          :key="friendIndex"
          class="friend-item"
          @click="$emit('select-friend', friend)"
        >
          <div class="friend-avatar">
            <img :src="friend.users.avatar || ''" alt="头像" />
            <div class="status-dot" :class="getStatusClass(friend.users.status)"></div>
          </div>
          <div class="friend-info">
            <div class="friend-name">
              {{ friend.users.username }} <span v-if="friend.remark"> ({{ friend.remark }})</span>
            </div>
            <div class="friend-signature">{{ friend.users.signature || '这个人很懒，什么都没留下' }}</div>
          </div>
        </div>
        <div class="empty-tip" v-if="!friendGroupMap[item.groupId] || friendGroupMap[item.groupId].length === 0">
          该分组下暂无好友
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { getFriendGroupFriendList } from '@/api/friendGroups.js'
import { getUsersInfoById } from '@/api/user.js'
import { getStatusClass } from '@/utils/statusUtils.js'

defineProps({
  friendItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select-friend', 'context-menu'])

const expandedGroups = ref([])
const friendGroupMap = reactive({})

// 切换分组展开/收起状态
const toggleGroup = (group) => {
  const groupId = group.groupId
  const index = expandedGroups.value.indexOf(groupId)

  if (index === -1) {
    expandedGroups.value.push(groupId)
    // 如果该分组还没有加载过好友，则加载好友列表
    if (!friendGroupMap[groupId]) {
      loadFriendGroupList(groupId)
    }
  } else {
    expandedGroups.value.splice(index, 1)
  }
}

// 加载好友分组列表
const loadFriendGroupList = async (groupId) => {
  try {
    // 初始化该分组的好友列表为空数组
    friendGroupMap[groupId] = []

    const res = await getFriendGroupFriendList(groupId)
    if (res.data && res.data.data) {
      // 使用 Promise.all 等待所有请求完成
      const promises = res.data.data.map(async (friend) => {
        const userRes = await getUsersInfoById(friend.friendId)
        if (userRes.data && userRes.data.data) {
          return userRes.data.data
        }
        return null
      })

      // 等待所有请求完成后一次性更新好友列表
      const friendsData = await Promise.all(promises)
      friendGroupMap[groupId] = friendsData.filter((item) => item !== null)
    }
  } catch (error) {
    console.error('加载好友列表失败:', error)
  }
}

// 处理右键菜单
const onContextMenu = (event, group) => {
  emit('context-menu', event, group)
}
</script>

<style lang="scss" scoped>
@use '@/assets/status.scss';

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  .item-left {
    display: flex;
    align-items: center;

    .expand-icon {
      margin-right: 10px;
      color: #999;
      font-size: 12px;
      transition: transform 0.3s;

      &.is-expanded {
        transform: rotate(90deg);
      }
    }

    .contact-name {
      font-size: 14px;
      color: #333;
    }
  }

  .message-count {
    font-size: 12px;
    color: #999;
  }
}

.friend-list {
  background-color: #f9f9f9;

  .friend-item {
    display: flex;
    align-items: center;
    padding: 10px 15px 10px 35px;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }

    .friend-avatar {
      position: relative;
      width: 40px;
      height: 40px;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .status-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid #fff;
      }
    }

    .friend-info {
      flex: 1;

      .friend-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 2px;
      }

      .friend-signature {
        font-size: 12px;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .empty-tip {
    padding: 10px 15px 10px 35px;
    font-size: 12px;
    color: #999;
    font-style: italic;
  }
}
</style>
