/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
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
  },

  // Your existing test configuration
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.js']
      }
    }]
  }
});