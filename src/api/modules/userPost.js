import instance from '@/api/https.js'

/**
 * 发布朋友圈
 * @param {string} content - 朋友圈内容
 * @param {string} mediaType - 媒体类型
 * @param {string} mediaUrl - 媒体URL
 * @returns {Promise} - 返回发布结果的Promise对象
 */
export const createPost = (content, mediaType, mediaUrl) => {
  return instance({
    url: '/user-posts/create',
    method: 'post',
    params: { content, mediaType, mediaUrl },
  })
}

/**
 * 查询自己发布的朋友圈列表
 * @param {number} pageNum - 页码，默认为1
 * @param {number} pageSize - 每页数量，默认为20
 * @returns {Promise} - 返回朋友圈列表的Promise对象
 */
export const getPostList = (pageNum = 1, pageSize = 20) => {
  return instance({
    url: '/user-posts/getList',
    method: 'get',
    params: { pageNum, pageSize },
  })
}
/**
 * 查询所有朋友圈列表
 * @param {number} pageNum - 页码，默认为1
 * @param {number} pageSize - 每页数量，默认为20
 * @returns {Promise} - 返回朋友圈列表的Promise对象
 */
export const getPostAllList = (pageNum = 1, pageSize = 20) => {
  return instance({
    url: '/user-posts/getAllList',
    method: 'get',
    params: { pageNum, pageSize },
  })
}

/**
 * 查询朋友圈详情
 * @param {number} postId - 朋友圈ID
 * @returns {Promise} - 返回朋友圈详情的Promise对象
 */
export const getPostDetail = (postId) => {
  return instance({
    url: '/user-posts/getById',
    method: 'get',
    params: { postId },
  })
}

/**
 * 给朋友圈置顶/取消置顶
 * @param {number} postId - 朋友圈ID
 * @param {number} isTop - 是否置顶(1:置顶, 0:取消置顶)
 * @returns {Promise} - 返回操作结果的Promise对象
 */
export const topPost = (postId, isTop) => {
  return instance({
    url: '/user-posts/topPost',
    method: 'post',
    params: { postId, isTop },
  })
}

/**
 * 给朋友动态点赞/取消点赞
 * @param {number} postId - 朋友圈ID
 * @param {number} isCancel - 是否取消点赞(0:点赞, 1:取消点赞)
 * @returns {Promise} - 返回操作结果的Promise对象
 */
export const likePost = (postId, isCancel) => {
  return instance({
    url: '/post-likes/likePost',
    method: 'post',
    params: { postId, isCancel },
  })
}

/**
 * 查询朋友圈点赞
 * @param {number} postId - 朋友圈ID
 * @returns {Promise} - 返回点赞列表的Promise对象
 */
export const getPostLikes = (postId) => {
  return instance({
    url: '/post-likes/getByIdToLike',
    method: 'get',
    params: { postId },
  })
}

/**
 * 给朋友动态评论
 * @param {number} postId - 朋友圈ID
 * @param {string} content - 评论内容
 * @param {number} parentCommentId - 父评论ID(回复评论时使用)
 * @returns {Promise} - 返回操作结果的Promise对象
 */
export const commentPost = (postId, content, parentCommentId) => {
  return instance({
    url: '/post-comments/commentPost',
    method: 'post',
    params: { postId, content, parentCommentId },
  })
}

/**
 * 查询朋友圈评论
 * @param {number} postId - 朋友圈ID
 * @returns {Promise} - 返回评论列表的Promise对象
 */
export const getPostComments = (postId) => {
  return instance({
    url: '/post-comments/getByIdToComment',
    method: 'get',
    params: { postId },
  })
}

/**
 * 删除朋友圈评论
 * @param postId
 * @param commentId
 * @returns {*}
 */
export const deleteComment = (postId, commentId) => {
  return instance({
    url: '/post-comments/deleteById',
    method: 'delete',
    params: { postId, commentId },
  })
}
