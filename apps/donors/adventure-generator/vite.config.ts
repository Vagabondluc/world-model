import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      watch: {
        ignored: ['**/temp_lazy_gm_tools/**', '**/srd_export/**', '**/src-tauri/target/**']
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
      entries: ['index.html', 'src/main.tsx'], // Explicitly tell Vite where to start scanning
    },
    test: {
      environment: 'jsdom',
      globals: true,
    }
  };
});
