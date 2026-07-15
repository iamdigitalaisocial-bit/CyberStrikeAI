import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Proxies API calls to the real CyberStrikeAI Go backend during development.
// Backend default port is 8080 (config.yaml `server.port`); it terminates TLS
// with a local self-signed cert when run with --https, so we target --http
// (plain HTTP on 8080) for the dev proxy to avoid cert trust issues.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://127.0.0.1:8080',
        changeOrigin: true,
        secure: false, // backend uses a local self-signed cert in dev
      },
    },
  },
})
