import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,  // Ensure this matches the port mapping in docker-compose.yml
  },
  build: {
    outDir: 'dist', // Ensure this matches your expected output directory
    // Other build options
  },
})