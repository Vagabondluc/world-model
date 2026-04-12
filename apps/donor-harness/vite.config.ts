import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mi': path.resolve(__dirname, 'src/donors/mappa-imperium'),
      '@': path.resolve(__dirname, 'src'),
      '@shims': path.resolve(__dirname, 'src/shims'),
    },
  },
  server: { host: true, port: 5173 },
})
