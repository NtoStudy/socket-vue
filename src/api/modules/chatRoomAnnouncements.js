import instance from '@/api/https.js'

/**
 * 发布群公告
 * @param {number} roomId - 群聊ID
 * @param {string} content - 公告内容
 * @param {string} attachmentUrls - 附件URL，多个URL用逗号分隔
 * @param {number} isPinned - 是否置顶(1:置顶, 0:不置顶)
 * @returns {Promise} - 返回发布群公告请求的Promise对象
 */
export const publishAnnouncement = (roomId, content, attachmentUrls, isPinned) =>
  instance({
    url: '/room-announcements/announcement',
    method: 'post',
    params: { roomId, content, attachmentUrls, isPinned },
  })

/**
 * 修改群公告
 * @param {number} announcementId - 公告ID
 * @param {string} content - 更新后的公告内容
 * @param {string} attachmentUrls - 更新后的附件URL
 * @param {number} isPinned - 是否置顶(1:置顶, 0:不置顶)
 * @returns {Promise} - 返回修改群公告请求的Promise对象
 */
export const updateAnnouncement = (announcementId, content, attachmentUrls, isPinned) =>
  instance({
    url: '/room-announcements/announcement',
    method: 'put',
    params: { announcementId, content, attachmentUrls, isPinned },
  })

/**
 * 删除/撤回群公告
 * @param {number} announcementId - 公告ID
 * @param {number} status - 公告状态(0:已撤回, 2:已删除)
 * @returns {Promise} - 返回删除群公告请求的Promise对象
 */
export const deleteAnnouncement = (announcementId, status) =>
  instance({
    url: '/room-announcements/announcement',
    method: 'delete',
    params: { announcementId, status },
  })

/**
 * 置顶/取消置顶群公告
 * @param {number} announcementId - 公告ID
 * @param {number} isPinned - 是否置顶(1:置顶, 0:取消置顶)
 * @returns {Promise} - 返回置顶群公告请求的Promise对象
 */
export const pinAnnouncement = (announcementId, isPinned) =>
  instance({
    url: '/room-announcements/pin',
    method: 'post',
    params: { announcementId, isPinned },
  })

/**
 * 分页查询群公告
 * @param {number} roomId - 群聊ID
 * @param {number} pageNum - 页码，默认为1
 * @param {number} pageSize - 每页数量，默认为10
 * @returns {Promise} - 返回查询群公告请求的Promise对象
 */
export const getAnnouncementPage = (roomId, pageNum = 1, pageSize = 10) =>
  instance({
    url: '/room-announcements/announcement',
    method: 'get',
    params: { roomId, pageNum, pageSize },
  })
