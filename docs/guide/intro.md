# 介绍

Visink 是一个基于 Electron、Vue 3 和 TypeScript 构建的现代跨平台桌面应用。

## 技术栈

- **前端**：Vue 3 + TypeScript + Vite
- **后端**：NestJS + Express
- **桌面**：Electron + electron-vite
- **UI 组件库**：Naive UI
- **包管理器**：pnpm

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务

```bash
# 启动 Web（前端 + 后端）
pnpm dev

# 启动 Electron
pnpm dev:app

# 启动文档
pnpm docs:dev
```

## 部署

### 部署架构

Visink 采用**统一部署模型**：前端（Vue）编译为静态文件，由 NestJS 后端在同一端口提供服务。

- 前端静态文件：`dist/visink-web/ui/`
- 后端服务：`dist/visink-web/server/`
- API 前缀：`/api`
- 生产端口：`4300`

### 构建命令

| 命令              | 说明                          | 适用场景     |
| ----------------- | ----------------------------- | ------------ |
| `pnpm build`      | 构建前端 + 后端（不含依赖）   | 开发/测试    |
| `pnpm build:prod` | 构建完整包（含 node_modules） | 生产部署     |
| `pnpm build:app`  | 构建 Electron 安装包          | 桌面应用分发 |

### 快速部署（Web）

```bash
# 构建生产包（包含所有依赖，约 500+ MB）
pnpm build:prod

# 直接运行，无需安装依赖
cd dist/visink-web && node server/main.js
# 访问 http://localhost:4300
```

### Electron 应用构建

| 命令               | 说明                                  | 输出目录                 |
| ------------------ | ------------------------------------- | ------------------------ |
| `pnpm build:app`   | 构建当前系统（macOS）的 Electron 应用 | `dist/visink-app/mac/`   |
| `pnpm build:win`   | 交叉编译 Windows 安装包               | `dist/visink-app/win/`   |
| `pnpm build:linux` | 交叉编译 Linux 安装包                 | `dist/visink-app/linux/` |

`build:app` 针对当前运行的操作系统（例如：macOS）构建，生成 `.dmg` 等原生安装包；`build:win` 和 `build:linux` 则分别生成 Windows（`.exe`）和 Linux（`.AppImage` / `.deb`）的安装包，可在 macOS 上交叉编译，适用于 CI/CD 多平台分发场景。

Electron 应用启动后，内置的 NestJS 后端同样会监听 `4300` 端口，因此也可以直接通过浏览器访问 `http://localhost:4300` 使用 Web 版界面。
