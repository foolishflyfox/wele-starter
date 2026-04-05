import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  title: 'Visink',
  description: 'Visink 项目文档',
  lang: 'zh-CN',
  base: '/docs/',
  outDir: resolve(__dirname, '../../src/renderer/public/docs'),
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/favicon.svg' }]],
  themeConfig: {
    siteTitle: 'Visink 文档',
    search: {
      provider: 'local'
    },
    outline: {
      level: 'deep',
      label: '页面导航'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/intro' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [{ text: '介绍', link: '/guide/intro' }]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/foolishflyfox/visink' }]
  },
  vite: {
    server: {
      port: 4031,
      host: true
    }
  }
});
