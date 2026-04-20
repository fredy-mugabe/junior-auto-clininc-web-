import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /** Injected on Vercel so you can confirm the live site matches Git (see footer “Deploy”). */
  define: {
    'import.meta.env.VITE_GIT_SHA': JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA ?? ''),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
