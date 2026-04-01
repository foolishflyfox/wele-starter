import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(), // 默认工具类（Tailwind/Windi 兼容）
    presetAttributify(), // 属性模式：<div flex items-center />
    presetIcons({
      // 纯 CSS 图标
      scale: 1.2,
      warn: true
    })
  ],
  shortcuts: {
    // 布局
    'flex-center': 'flex items-center justify-center',
    'flex-col-center': 'flex flex-col items-center justify-center',
    // 文字
    'text-ellipsis': 'overflow-hidden whitespace-nowrap text-ellipsis',
    // 定位
    'abs-center': 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
  },
  theme: {
    colors: {
      primary: '#646cff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399'
    }
  }
});
