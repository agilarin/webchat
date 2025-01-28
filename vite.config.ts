import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import svgr from "vite-plugin-svgr"


// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? "webchat-app" : "/",
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
}))

