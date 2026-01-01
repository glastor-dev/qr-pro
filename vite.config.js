import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const isVercel = process.env.VERCEL === '1'
  const base = isVercel ? '/' : '/qr-pro/'

  return {
    plugins: [react()],
    base,
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'esbuild',
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
  }
})
