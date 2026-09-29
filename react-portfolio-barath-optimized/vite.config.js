import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/r2-proxy': {
        target: 'https://pub-8ffca6f612d24c94b8bcf7f1e59378ea.r2.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/r2-proxy/, ''),
      },
    },
    watch: {
      ignored: ['**/*.mp4', '**/*.mkv', '**/*.mov', '**/node_modules/**'],
    },
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lenis') || id.includes('aos') || id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },
})
