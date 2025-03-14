import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import svgr from "vite-plugin-svgr"


// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? "webchat" : "/",
  plugins: [react({
    jsxImportSource: '@welldone-software/why-did-you-render'
  }), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
}))

