import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/board-games-list/',
  plugins: [react()],
  server: {
    port: 3000,
  },
})
