// Archivo de configuración para Vite. Es importante para que funcione con Docker.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Escucha en todas las interfaces, crucial para Docker
    port: 5173,      // Asegura que el puerto sea el 5173
  }
})