import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import unocss from 'unocss/vite';
import autoImport from 'unplugin-auto-import/vite';
import components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { resolve, extname } from 'path';
import { createReadStream, existsSync, statSync } from 'fs';

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

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
    components({
      resolvers: [NaiveUiResolver()],
      dts: 'src/auto/types/components.d.ts'
    }),
    {
      name: 'serve-docs-static',
      configureServer(server) {
        const docsRoot = resolve(__dirname, 'src/renderer/public/docs');
        server.middlewares.use((req, res, next) => {
          const url = req.url || '/';
          if (!url.startsWith('/docs')) return next();

          const relativePath = url.slice('/docs'.length) || '/';
          let filePath = resolve(docsRoot, relativePath.replace(/^\//, ''));

          if (existsSync(filePath) && statSync(filePath).isDirectory()) {
            filePath = resolve(filePath, 'index.html');
          }

          if (existsSync(filePath)) {
            res.setHeader(
              'Content-Type',
              mimeTypes[extname(filePath)] || 'application/octet-stream'
            );
            createReadStream(filePath).pipe(res);
          } else {
            const indexPath = resolve(docsRoot, 'index.html');
            if (existsSync(indexPath)) {
              res.setHeader('Content-Type', 'text/html');
              createReadStream(indexPath).pipe(res);
            } else {
              next();
            }
          }
        });
      }
    },
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
