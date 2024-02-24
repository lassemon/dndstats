import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '/',
  build: {
    outDir: './build'
  },
  plugins: [react(), viteTsconfigPaths()],
  optimizeDeps: {
    include: ['@mui/material/Tooltip']
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:80', // Proxy requests to the backend server running on port 80
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false // If you're proxying to a server with a self-signed certificate
      }
    }
  }
})
