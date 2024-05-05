import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@img": path.resolve(__dirname,"./src/assets/img"),
      "@font": path.resolve(__dirname,"./src/assets/fonts")
    },
  },
  plugins: [react(),svgr()],
  build: {
    minify: true,
    assetsInlineLimit: 0,
    emptyOutDir: true,
  }

})
