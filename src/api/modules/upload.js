import instance from '@/api/https.js'

// 上传单个文件接口
export const uploadMethod = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return instance({
    url: '/upload',
    method: 'post',
    data: formData,
  })
}

// 批量上传多个文件接口
export const uploadMethods = (files) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  return instance({
    url: '/upload/batch',
    method: 'post',
    params: formData,
  })
}

// 分片上传大文件接口
export const uploadVideo = (formData) =>
  instance({
    url: '/upload/chunk',
    method: 'post',
    params: formData,
  })
