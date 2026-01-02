import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isVercel = process.env.VERCEL === '1'
  const base = command === 'build' ? (isVercel ? '/' : '/qr-pro/') : '/'

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
            'react-qr': ['react-qr-code'],
            qrcode: ['qrcode'],
            jspdf: ['jspdf'],
            jszip: ['jszip'],
            'file-saver': ['file-saver'],
            html2canvas: ['html2canvas']
          }
        }
      }
    }
  }
})
