import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Used only when running `vite` directly from this package during development.
// Production serving is handled via the programmatic API in src/cli/vite-server.ts.
export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname, 'src/app'),
  server: {
    port: 3001,
  },
})
