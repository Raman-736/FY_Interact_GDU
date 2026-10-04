import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' lets the built site be dropped on any host or sub-folder (Netlify, GitHub Pages, your own site).
export default defineConfig({
  plugins: [react()],
  base: './',
})
