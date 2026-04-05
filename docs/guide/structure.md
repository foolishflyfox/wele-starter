# 文件结构

```
visink/
├── src/                        # 源代码
│   ├── main/                   # Electron 主进程（Node.js 环境）
│   │   └── index.ts            # 主进程入口，负责创建窗口、管理应用生命周期
│   ├── preload/                # Electron 预加载脚本
│   │   ├── index.ts            # 预加载脚本，桥接主进程与渲染进程
│   │   └── index.d.ts          # 预加载脚本类型声明
│   ├── renderer/               # Vue 前端（渲染进程）
│   │   ├── index.html          # HTML 入口
│   │   ├── favicon.svg         # 应用图标
│   │   ├── public/             # 静态资源（含内置文档构建产物）
│   │   └── src/                # Vue 应用源码
│   │       ├── main.ts         # Vue 应用入口
│   │       ├── App.vue         # 根组件
│   │       ├── components/     # 公共组件
│   │       ├── assets/         # 样式、图片等静态资源
│   │       ├── types/          # 全局类型声明
│   │       └── auto/           # 自动生成的类型文件（unplugin 生成，勿手动修改）
│   └── server/                 # NestJS 后端
│       ├── main.ts             # 后端入口，配置端口与静态文件服务
│       ├── app.module.ts       # 根模块
│       ├── app.controller.ts   # 根控制器
│       └── app.service.ts      # 根服务
│
├── docs/                       # VitePress 文档
│   ├── index.md                # 文档首页
│   ├── guide/                  # 指南文档
│   └── .vitepress/             # VitePress 配置
│       └── config.mts          # 站点配置（导航、侧边栏等）
│
├── resources/                  # Electron 打包资源（如应用图标）
├── scripts/                    # 构建辅助脚本
│   └── copy-deps.js            # 将 node_modules 复制到生产构建目录
│
├── dist/                       # 构建产物（git 忽略）
│   ├── visink-web/             # Web 应用构建产物
│   │   ├── ui/                 # 前端静态文件
│   │   └── server/             # 后端编译产物
│   └── visink-app/             # Electron 安装包
│
├── out/                        # Electron 编译中间产物（git 忽略）
│
├── electron.vite.config.ts     # electron-vite 构建配置
├── vite.web.config.ts          # Web 模式前端构建配置
├── electron-builder.yml        # Electron 打包配置
├── tsconfig.json               # TypeScript 基础配置
├── tsconfig.server.json        # 后端 TypeScript 配置
├── tsconfig.web.json           # 前端 TypeScript 配置
├── uno.config.ts               # UnoCSS 配置
├── nest-cli.json               # NestJS CLI 配置
└── package.json                # 项目依赖与脚本
```

## 关键目录说明

### `src/main/`

Electron **主进程**，运行在 Node.js 环境中，负责：

- 创建和管理应用窗口
- 启动内嵌的 NestJS 子进程
- 处理系统级事件（托盘、快捷键等）

### `src/preload/`

Electron **预加载脚本**，在渲染进程加载前执行，通过 `contextBridge` 安全地将主进程 API 暴露给前端。

### `src/renderer/`

基于 **Vue 3 + TypeScript** 的前端应用，既作为 Electron 渲染进程运行，也可构建为独立 Web 页面。`src/renderer/src/auto/` 下的文件由 `unplugin-auto-import` 和 `unplugin-vue-components` 自动生成，无需手动修改。

### `src/server/`

基于 **NestJS** 的后端服务，负责：

- 提供 REST API（前缀 `/api`）
- 在生产模式下托管前端静态文件
- 统一监听 `4300` 端口

### `docs/`

**VitePress** 文档站点，开发时运行在 `4031` 端口。构建后的文档会输出到 `src/renderer/public/docs/`，随前端一同打包，可通过应用内置帮助页面访问。
