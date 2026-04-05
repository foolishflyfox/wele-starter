import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import unocss from 'unocss/vite';
import autoImport from 'unplugin-auto-import/vite';
import components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

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
      components({
        resolvers: [NaiveUiResolver()],
        dts: 'src/auto/types/components.d.ts'
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
  }
});
