import instance from '@/api/https.js'

// 发布朋友圈
export const createPost = (content, mediaType, mediaUrl) => {
  return instance({
    url: '/user-posts/create',
    method: 'post',
    params: { content, mediaType, mediaUrl },
  })
}

// 查询自己发布的朋友圈列表
export const getPostList = (pageNum = 1, pageSize = 20) => {
  return instance({
    url: '/user-posts/getList',
    method: 'get',
    params: { pageNum, pageSize },
  })
}
// 查询所有朋友圈列表
export const getPostAllList = (pageNum = 1, pageSize = 20) => {
  return instance({
    url: '/user-posts/getAllList',
    method: 'get',
    params: { pageNum, pageSize },
  })
}

// 查询朋友圈详情
export const getPostDetail = (postId) => {
  return instance({
    url: '/user-posts/getById',
    method: 'get',
    params: { postId },
  })
}

// 给朋友圈置顶/取消置顶
export const topPost = (postId, isTop) => {
  return instance({
    url: '/user-posts/topPost',
    method: 'post',
    params: { postId, isTop },
  })
}

// 给朋友动态点赞/取消点赞
export const likePost = (postId, isCancel) => {
  return instance({
    url: '/post-likes/likePost',
    method: 'post',
    params: { postId, isCancel },
  })
}

// 查询朋友圈点赞
export const getPostLikes = (postId) => {
  return instance({
    url: '/post-likes/getByIdToLike',
    method: 'get',
    params: { postId },
  })
}

// 给朋友动态评论
export const commentPost = (postId, content, parentCommentId) => {
  return instance({
    url: '/post-comments/commentPost',
    method: 'post',
    params: { postId, content, parentCommentId },
  })
}

// 查询朋友圈评论
export const getPostComments = (postId) => {
  return instance({
    url: '/post-comments/getByIdToComment',
    method: 'get',
    params: { postId },
  })
}

// 删除朋友圈评论
export const deleteComment = (postId, commentId) => {
  return instance({
    url: '/post-comments/deleteById',
    method: 'delete',
    params: { postId, commentId },
  })
}
