import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = isGithubPages && repoName ? `/${repoName}/` : '/docs/';
const outDir = isGithubPages
  ? resolve(__dirname, '../dist')
  : resolve(__dirname, '../../src/renderer/public/docs');

export default defineConfig({
  title: 'Visink',
  description: 'Visink 项目文档',
  lang: 'zh-CN',
  base,
  outDir,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }]],
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
          items: [
            { text: '介绍', link: '/guide/intro' },
            { text: '文件结构', link: '/guide/structure' }
          ]
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
