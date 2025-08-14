import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000, 
    strictPort: false,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'https://8d8f0123a9df.ngrok-free.app'],
  },
})
