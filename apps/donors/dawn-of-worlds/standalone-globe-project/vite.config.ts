
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    preview: {
        port: 4180,
        strictPort: true,
    },
    server: {
        port: 4180,
    },
    define: {
        __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    }
})
