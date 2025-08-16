import instance from '@/api/https.js'

// 发布群公告
export const publishAnnouncement = (roomId, content, attachmentUrls, isPinned) =>
  instance({
    url: '/room-announcements/announcement',
    method: 'post',
    params: { roomId, content, attachmentUrls, isPinned },
  })

// 修改群公告
export const updateAnnouncement = (announcementId, content, attachmentUrls, isPinned) =>
  instance({
    url: '/room-announcements/announcement',
    method: 'put',
    params: { announcementId, content, attachmentUrls, isPinned },
  })

// 删除/撤回群公告
export const deleteAnnouncement = (announcementId, status) =>
  instance({
    url: '/room-announcements/announcement',
    method: 'delete',
    params: { announcementId, status },
  })

// 置顶/取消置顶群公告
export const pinAnnouncement = (announcementId, isPinned) =>
  instance({
    url: '/room-announcements/pin',
    method: 'post',
    params: { announcementId, isPinned },
  })

// 分页查询群公告
export const getAnnouncementPage = (roomId, pageNum = 1, pageSize = 10) =>
  instance({
    url: '/room-announcements/announcement',
    method: 'get',
    params: { roomId, pageNum, pageSize },
  })
