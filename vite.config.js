import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vibeCoding_ken/', // 若你的 repo 名稱不同，請改成 '/<repo-name>/'
  build: { outDir: 'dist' },
})