import instance from '@/api/index.js'

export const uploadMethod = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return instance({
    url: '/upload',
    method: 'post',
    data: formData,
  })
}

export const uploadMethods = (files) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  return instance({
    url: '/upload/batch',
    method: 'post',
    data: formData,
  })
}
