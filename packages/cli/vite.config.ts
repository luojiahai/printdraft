import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname, 'src/app'),
  build: {
    outDir: resolve(__dirname, 'dist/app'),
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:3000',
      '/ws': { target: 'ws://localhost:3000', ws: true },
    },
  },
})
