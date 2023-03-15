import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      "xmlhttprequest-ssl": "./node_modules/engine.io-client/lib/xmlhttprequest.js"
    }
  },
  server: {
    host: 'localhost',
    cors: true
  }
})
