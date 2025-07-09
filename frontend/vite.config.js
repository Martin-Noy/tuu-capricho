import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Habilitar el polling es necesario para que el hot-reloading funcione correctamente dentro de Docker
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://server:8000', // Apunta al servicio 'server' de Docker en el puerto 8000
        changeOrigin: true,
        secure: false,
      }
    }
  }
})