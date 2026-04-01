import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
      rollupOptions: {
        output: {
          format: 'es',
          entryFileNames: 'index.js'
        }
      }
    },
    resolve: {
      alias: {
        '@main': resolve('src/main')
      }
    }
  },
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [vue(), vueJsx(), vueDevTools()],
    server: {
      port: 4030,
      proxy: {
        '/api': {
          target: 'http://localhost:4300',
          changeOrigin: true
        }
      }
    }
  }
});
