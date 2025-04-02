import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 配置 @ 指向 src 目录
    },
  },
  define: {
    // 添加全局变量定义
    global: 'window',
  },
})
