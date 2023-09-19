import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  envDir: './env',
  base: './',
  plugins: [vue()]
})