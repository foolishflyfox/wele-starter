import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import unocss from 'unocss/vite';
import autoImport from 'unplugin-auto-import/vite';
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
  plugins: [
    unocss(),
    autoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ],
      dts: 'src/auto/types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: 'src/renderer/src/auto/lint/.eslintrc-auto-import.json'
      }
    }),
    vue(),
    vueJsx(),
    vueDevTools()
  ],
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
