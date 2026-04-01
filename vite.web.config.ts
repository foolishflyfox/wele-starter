import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { resolve } from 'path';

export default defineConfig({
  root: 'src/renderer',
  build: {
    outDir: resolve(__dirname, 'dist/visink-web/ui'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/renderer/index.html')
    }
  },
  plugins: [vue(), vueDevTools()],
  server: {
    port: 4030,
    proxy: {
      '/api': {
        target: 'http://localhost:4300',
        changeOrigin: true
      }
    }
  }
});
