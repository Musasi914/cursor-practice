import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // lightningcss が react-day-picker 内の @keyframes を minify できない場合がある
    cssMinify: 'esbuild',
  },
})
