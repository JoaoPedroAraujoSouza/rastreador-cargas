import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill para bibliotecas antigas (como sockjs-client) que tentam acessar 'global'
    // Mapeamos 'global' para 'window' (o objeto global do navegador)
    global: 'window',
  },
})