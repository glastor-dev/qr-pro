import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/qr-pro/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          qr: ['react-qr-code', 'qrcode'],
          utils: ['file-saver', 'jspdf', 'html2canvas', 'jszip', 'exceljs', 'papaparse']
        }
      }
    }
  }
})
