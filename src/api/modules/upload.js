import instance from '@/api/index.js'

/**
 * 上传单个文件接口
 * @param {File} file - 要上传的文件
 * @returns {Promise} - 返回上传结果的Promise对象
 */
export const uploadMethod = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return instance({
    url: '/upload',
    method: 'post',
    data: formData,
  })
}

/**
 * 批量上传多个文件接口
 * @param {File[]} files - 要上传的文件数组
 * @returns {Promise} - 返回包含上传结果的Promise对象
 */
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

/**
 * 分片上传大文件接口
 * @param {FormData} formData - 包含文件分片信息的表单数据
 * @returns {Promise} - 返回上传结果的Promise对象
 */
export const uploadVideo = (formData) =>
  instance({
    url: '/upload/chunk',
    method: 'post',
    data: formData,
  })
