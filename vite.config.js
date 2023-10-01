import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  envDir: './env',
  base: './',
  plugins: [vue()],
  define: {
    __VUE_PROD_DEVTOOLS__: true
  }
})
