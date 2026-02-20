import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/' // Use '/' if root domain, or '/subpath/' if served under subpath
})
