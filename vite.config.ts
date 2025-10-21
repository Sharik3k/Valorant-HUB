import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Якщо немає локального API сервера, показати помилку
          proxy.on('error', (err, req, res) => {
            console.log('⚠️ API Proxy Error: Локальний API сервер не запущено');
            console.log('💡 Використовуйте: vercel dev');
          });
        }
      }
    }
  }
})
