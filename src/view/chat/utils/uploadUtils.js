import { uploadMethod, uploadVideo } from '@/api/upload'

const chunkSize = 1024 * 1024 // 每个分片 1MB

const UploadVideo = async (file) => {
  const chunks = Math.ceil(file.size / chunkSize)
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('fileName', file.name)
    formData.append('chunkNumber', i)
    formData.append('totalChunks', chunks)

    await uploadVideo(formData)
  }
}

const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await uploadMethod(formData)
  return res.data.data
}

export { uploadVideo, uploadImage }
