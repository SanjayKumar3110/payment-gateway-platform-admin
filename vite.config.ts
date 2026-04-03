import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1'
  },
  resolve: {
    alias: {
      '@data': path.resolve(__dirname, './data'),
    },
  },
})
