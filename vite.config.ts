import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
  server : {
    port : 3000,
    strictPort : true,
  },
  build: {
    sourcemap: false,  
  },
  esbuild: {
    sourcemap: false,   
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
})
