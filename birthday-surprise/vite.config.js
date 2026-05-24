import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change '/birthday-surprise/' to '/YOUR-REPO-NAME/'
  base: '/birthday-surprise/',
})