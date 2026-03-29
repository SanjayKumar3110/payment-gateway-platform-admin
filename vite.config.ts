import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      // This tells Vite: when you see @data, look in the root data folder
      '@data': path.resolve(__dirname, './data'),
    },
  },
})
