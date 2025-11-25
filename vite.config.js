import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration for better browser compatibility
  build: {
    target: 'es2020',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react': ['react', 'react-dom', 'react-router-dom'],
          'vendor': ['axios', 'jwt-decode']
        }
      }
    }
  },

  // Optimized dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'jwt-decode']
  },
  
  // Added server config for port and API proxy
  server: {
    port: 3000, // Run frontend on port 3000
    proxy: {
      // Proxy /api requests to your Spring Boot backend
      '/api': {
        target: 'http://localhost:8080', // Your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
    // Disable HMR in some cases to avoid connection issues
    middlewareMode: false,
  }
});