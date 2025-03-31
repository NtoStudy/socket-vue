<template>
  <div>
    <!-- 置顶群聊 -->
    <div class="group-category">
      <div class="contact-item" @click="toggleGroupChat('置顶群聊')">
        <div class="item-left">
          <el-icon class="expand-icon" :class="{ 'is-expanded': expandedGroups.includes('置顶群聊') }">
            <ArrowRight />
          </el-icon>
          <span class="contact-name">置顶群聊</span>
        </div>
        <div class="message-count">
          {{ groupChatMap.pinned.groupCount || getCountByName('置顶群聊') || 0 }}
        </div>
      </div>

      <!-- 置顶群聊列表 -->
      <div class="friend-list" v-if="expandedGroups.includes('置顶群聊')">
        <div
          v-for="(group, groupIndex) in groupChatMap.pinned.chatRoomsList"
          :key="groupIndex"
          class="friend-item"
          @click="$emit('select-group-chat', group)"
        >
          <div class="friend-avatar">
            <img :src="group.avatar || ''" alt="群头像" />
          </div>
          <div class="friend-info">
            <div class="friend-name">{{ group.roomName }}</div>
          </div>
        </div>
        <div class="empty-tip" v-if="!groupChatMap.pinned || groupChatMap.pinned.length === 0">暂无置顶群聊</div>
      </div>
    </div>

    <!-- 我创建的群聊 -->
    <div class="group-category">
      <div class="contact-item" @click="toggleGroupChat('我创建的群聊')">
        <div class="item-left">
          <el-icon class="expand-icon" :class="{ 'is-expanded': expandedGroups.includes('我创建的群聊') }">
            <ArrowRight />
          </el-icon>
          <span class="contact-name">我创建的群聊</span>
        </div>
        <div class="message-count">
          {{ groupChatMap.created.groupCount || getCountByName('我创建的群聊') || 0 }}
        </div>
      </div>

      <!-- 我创建的群聊列表 -->
      <div class="friend-list" v-if="expandedGroups.includes('我创建的群聊')">
        <div
          v-for="(group, groupIndex) in groupChatMap.created.chatRoomsList"
          :key="groupIndex"
          class="friend-item"
          @click="$emit('select-group-chat', group)"
        >
          <div class="friend-avatar">
            <img :src="group.avatar || ''" alt="群头像" />
          </div>
          <div class="friend-info">
            <div class="friend-name">{{ group.roomName }}</div>
          </div>
        </div>
        <div class="empty-tip" v-if="!groupChatMap.created || groupChatMap.created.length === 0">暂无创建的群聊</div>
      </div>
    </div>

    <!-- 我管理的群聊 -->
    <div class="group-category">
      <div class="contact-item" @click="toggleGroupChat('我管理的群聊')">
        <div class="item-left">
          <el-icon class="expand-icon" :class="{ 'is-expanded': expandedGroups.includes('我管理的群聊') }">
            <ArrowRight />
          </el-icon>
          <span class="contact-name">我管理的群聊</span>
        </div>
        <div class="message-count">
          {{ groupChatMap.managed.groupCount || getCountByName('我管理的群聊') || 0 }}
        </div>
      </div>

      <!-- 我管理的群聊列表 -->
      <div class="friend-list" v-if="expandedGroups.includes('我管理的群聊')">
        <div
          v-for="(group, groupIndex) in groupChatMap.managed.chatRoomsList"
          :key="groupIndex"
          class="friend-item"
          @click="$emit('select-group-chat', group)"
        >
          <div class="friend-avatar">
            <img :src="group.avatar || ''" alt="群头像" />
          </div>
          <div class="friend-info">
            <div class="friend-name">{{ group.roomName }}</div>
          </div>
        </div>
        <div class="empty-tip" v-if="!groupChatMap.managed || groupChatMap.managed.length === 0">暂无管理的群聊</div>
      </div>
    </div>

    <!-- 我加入的群聊 -->
    <div class="group-category">
      <div class="contact-item" @click="toggleGroupChat('我加入的群聊')">
        <div class="item-left">
          <el-icon class="expand-icon" :class="{ 'is-expanded': expandedGroups.includes('我加入的群聊') }">
            <ArrowRight />
          </el-icon>
          <span class="contact-name">我加入的群聊</span>
        </div>
        <div class="message-count">
          {{ groupChatMap.joined.groupCount || getCountByName('我加入的群聊') || 0 }}
        </div>
      </div>

      <!-- 我加入的群聊列表 -->
      <div class="friend-list" v-if="expandedGroups.includes('我加入的群聊')">
        <div
          v-for="(group, groupIndex) in groupChatMap.joined.chatRoomsList"
          :key="groupIndex"
          class="friend-item"
          @click="$emit('select-group-chat', group)"
        >
          <div class="friend-avatar">
            <img :src="group.avatar || ''" alt="群头像" />
          </div>
          <div class="friend-info">
            <div class="friend-name">{{ group.roomName }}</div>
          </div>
        </div>
        <div class="empty-tip" v-if="!groupChatMap.joined || groupChatMap.joined.length === 0">暂无加入的群聊</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { chatRoomsCreateGroup, chatRoomsJoinGroup, chatRoomsManageGroup, chatRoomsPinnedGroup } from '@/api/index.js'

const props = defineProps({
  groupItems: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['select-group-chat'])

const expandedGroups = ref([])
const groupChatMap = reactive({
  pinned: {},
  created: {},
  managed: {},
  joined: {},
})

// 根据分类名称获取对应的消息数量
const getCountByName = (name) => {
  const item = props.groupItems.find((item) => item.name === name)
  return item ? item.count : 0
}

// 切换群聊分类展开/收起状态
const toggleGroupChat = (groupName) => {
  const index = expandedGroups.value.indexOf(groupName)

  if (index === -1) {
    expandedGroups.value.push(groupName)
    // 如果是第一次展开，加载数据
    if (
      (groupName === '置顶群聊' && groupChatMap.pinned.length === 0) ||
      (groupName === '我创建的群聊' && groupChatMap.created.length === 0) ||
      (groupName === '我管理的群聊' && groupChatMap.managed.length === 0) ||
      (groupName === '我加入的群聊' && groupChatMap.joined.length === 0)
    ) {
      loadGroupChatLists()
    }
  } else {
    expandedGroups.value.splice(index, 1)
  }
}

// 加载群聊列表数据
const loadGroupChatLists = async () => {
  try {
    // 加载置顶群聊
    const pinnedRes = await chatRoomsPinnedGroup()
    console.log('置顶群聊数据:', pinnedRes.data)
    if (pinnedRes.data.code === 200) {
      groupChatMap.pinned = pinnedRes.data.data || []
      console.log('置顶群聊数据:', groupChatMap.pinned)
    }

    // 加载我创建的群聊
    const createdRes = await chatRoomsCreateGroup()
    if (createdRes.data.code === 200) {
      groupChatMap.created = createdRes.data.data || []
      console.log('我创建的群聊数据:', groupChatMap.created)
    }

    // 加载我管理的群聊
    const managedRes = await chatRoomsManageGroup()
    if (managedRes.data.code === 200) {
      groupChatMap.managed = managedRes.data.data || []
      console.log('我管理的群聊数据:', groupChatMap.managed)
    }

    // 加载我加入的群聊
    const joinedRes = await chatRoomsJoinGroup()
    if (joinedRes.data.code === 200) {
      groupChatMap.joined = joinedRes.data.data || []
      console.log('我加入的群聊数据:', groupChatMap.joined)
    }
  } catch (error) {
    console.error('加载群聊列表失败:', error)
  }
}

onMounted(() => {
  // 预加载数据
  if (props.groupItems && props.groupItems.length > 0) {
    loadGroupChatLists()
  }
})
</script>

<style lang="scss" scoped>
.group-category {
  margin-bottom: 2px;
}

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
