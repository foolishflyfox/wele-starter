# Visink

一个基于 Electron、Vue 3、TypeScript 和 NestJS 后端的桌面应用程序。

一个结合强大 NestJS 后端和响应式 Vue 3 前端的现代桌面应用程序，使用 Electron 进行跨平台部署。

**[English Version](./README.md)**

## 功能特性

- 🖥️ 跨平台桌面应用程序（Windows、macOS、Linux）
- 🎨 使用 Vue 3 和 TypeScript 构建的现代用户界面
- 🔧 功能完整的 NestJS 后端 API
- ⚡ 使用 Vite 的快速开发体验
- 📦 Electron builder 用于原生应用程序打包
- 🔒 全栈 TypeScript 类型安全开发
- 🛠️ 内置开发工具：ESLint、Prettier、TypeScript

## 技术栈

| 组件         | 技术                         |
| ------------ | ---------------------------- |
| **前端**     | Vue 3、TypeScript、Vite      |
| **后端**     | NestJS、Express              |
| **桌面应用** | Electron、electron-vite      |
| **包管理器** | pnpm                         |
| **代码质量** | ESLint、Prettier、TypeScript |

## 前置要求

- Node.js 20+（必需）
- pnpm（推荐）或 npm
- Git

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发

**Web 开发（前端 + 后端）：**

```bash
pnpm dev
```

这将运行：

- NestJS 服务器在 http://localhost:3000
- Vue 开发服务器在 http://localhost:5173

**Electron 开发：**

```bash
pnpm dev:app
```

### 3. 代码质量

```bash
# 检查并修复文件
pnpm lint

# 格式化代码
pnpm format

# 类型检查
pnpm typecheck
```

## 项目结构

```
visink/
├── src/
│   ├── main/          # Electron 主进程
│   ├── preload/       # Electron 预加载脚本
│   ├── renderer/      # Vue 前端应用程序
│   └── server/        # NestJS 后端服务器
├── build/             # 构建输出
├── dist/              # 分发文件
├── resources/         # 静态资源和文件
├── electron.vite.config.ts    # Electron Vite 配置
├── vite.web.config.ts         # Web Vite 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目依赖和脚本
```

## 可用的脚本命令

### 🔧 开发
```bash
pnpm dev              # 启动 Web 开发（前端 + 后端并发）
pnpm dev:app          # 启动 Electron 开发模式
```

### 🏗️ 构建
```bash
pnpm build            # 构建 Web（输出：dist/visink-web/）
pnpm build:prod       # 生产构建（输出：dist/visink-web/ 包含依赖）
pnpm build:app        # 构建 Electron 应用（输出：dist/visink-app/ + dist/visink-web/）

# 高级命令（很少直接使用）
pnpm build:server     # 仅构建后端
pnpm build:ui         # 仅构建前端
```

### ✨ 代码质量
```bash
pnpm lint             # 运行 ESLint
pnpm format           # 使用 Prettier 格式化
pnpm typecheck        # TypeScript 类型检查
```

### 📦 分发
```bash
pnpm copy:deps        # 复制依赖到 dist/visink-web/server/（build:prod 使用）
```

### 🔍 快速参考

| 命令 | 输出 | 大小 | 用途 |
|------|------|------|------|
| `pnpm build` | `dist/visink-web/`（仅代码） | ~100 KB | 开发、测试 |
| `pnpm build:prod` | `dist/visink-web/`（含依赖） | ~500+ MB | 生产服务器部署 |
| `pnpm build:app` | `dist/visink-app/` + `dist/visink-web/` | ~100-200 MB | Electron 应用发布 |

## 推荐的 IDE 设置

- [VSCode](https://code.visualstudio.com/)
- [ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier 扩展](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Volar 扩展](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（Vue 3 支持）

## 配置文件说明

| 文件 | 用途 | 输出路径 |
|------|------|---------|
| `vite.web.config.ts` | 前端构建配置 | `dist/visink-web/ui/` |
| `nest-cli.json` | NestJS 构建配置 | `dist/visink-web/server/` |
| `tsconfig.server.json` | 后端 TypeScript 配置 | `dist/visink-web/server/` |
| `tsconfig.web.json` | 前端 TypeScript 配置 | `dist/visink-web/ui/` |
| `electron.vite.config.ts` | Electron 构建配置 | `out/main`、`out/preload`、`out/renderer` |
| `electron-builder.yml` | Electron 应用打包配置 | `dist/visink-app/` |
| `scripts/copy-deps.js` | 依赖复制脚本 | `dist/visink-web/server/` |
| `.prettierrc.yaml` | 代码格式化规则 | - |
| `eslint.config.mjs` | 代码检查规则 | - |
| `tsconfig.json` | 主 TypeScript 配置 | - |

## 为发布构建应用

### 构建 Web 应用程序

```bash
pnpm build
```

在 `dist/` 目录中创建优化后的生产文件。

### 构建 Electron 应用程序

```bash
pnpm build:app
```

这将在 `dist/` 目录中创建特定于平台的安装程序。

## 部署指南

### 架构说明

应用程序采用**统一部署模型**：

- 前端（Vue）构建为静态文件 → `dist/visink-web/ui/`
- 后端（NestJS）构建 → `dist/visink-web/server/`
- NestJS 提供前端静态文件服务
- API 路由在 `/api` 前缀下
- 单个 Node.js 进程同时提供前端和后端

### 生产构建

#### 构建命令说明

| 命令              | 用途       | 输出                                             |
| ----------------- | ---------- | ------------------------------------------------ |
| `pnpm build`      | 开发、测试 | `dist/visink-web/server`（仅代码）、`dist/visink-web/ui`              |
| `pnpm build:prod` | 部署       | `dist/visink-web/server`（代码 + node_modules）、`dist/visink-web/ui` |

**开发构建：**

```bash
pnpm build
```

- 构建前端和后端代码
- 输出到 `dist/` 目录
- **不复制依赖** - 需要项目根目录的 `node_modules`
- 用途：开发、测试、检查构建输出
- 部署方式：上传整个项目（包含 `node_modules`）

**生产构建（部署用）：**

```bash
pnpm build:prod
```

- 构建前端和后端代码
- 复制所有 `node_modules` 和配置文件到 `dist/visink-web/server/`
- 创建完全独立的部署包
- 用途：生产部署、Docker 镜像、CI/CD 管道
- 部署方式：只上传 `dist/visink-web/server` 目录

#### 何时使用各命令

**使用 `pnpm build` 时：**

- 本地开发或测试
- 针对构建代码运行测试
- 想要最小化开发过程中的构建时间
- 输出：`dist/visink-web/` 包含 `ui/` 和 `server/`（需要项目的 `node_modules`）

**使用 `pnpm build:prod` 时：**

- 准备生产部署
- 构建 Docker 镜像
- 部署到云平台（Heroku、Railway、AWS 等）
- 创建可分发的包
- 输出：`dist/visink-web/` 的 `server/` 中包含所有依赖

**使用 `pnpm build:app` 时：**

- 发布 Electron 桌面应用
- 创建特定平台的安装程序（DMG、EXE、AppImage 等）
- 输出：`dist/visink-app/` 包含安装程序 + `dist/visink-web/` 用于内部使用

### Web 应用程序部署

由于前后端一起部署，只需部署后端即可：

#### 本地部署

```bash
# 生产构建（包含所有依赖）
pnpm build:prod

# 直接运行服务器（所有依赖已包含在 dist/visink-web/server/ 中）
cd dist/visink-web && node server/main.js
# 应用访问地址 http://localhost:4300
```

执行 `pnpm build:prod` 后，`dist/web/` 目录完全独立：
- `dist/visink-web/ui/` - 编译后的前端代码
- `dist/visink-web/server/` - 包含所有依赖的编译后端代码
  - `dist/visink-web/server/node_modules/` - 所有依赖
  - `dist/visink-web/server/web/` - 前端副本（由 NestJS 提供）
  - 配置文件（package.json、pnpm-lock.yaml）

无需任何额外的安装步骤，开箱即用：`cd dist/visink-web && node server/main.js`

#### Docker 部署

**方案 1：在 Docker 中构建（多阶段构建）：**

```dockerfile
# 阶段 1：构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build:prod

# 阶段 2：运行（包含所有依赖）
FROM node:20-alpine
WORKDIR /app

# 复制整个 dist/web 目录（ui + server 及 node_modules）
COPY --from=builder /app/dist/web ./

EXPOSE 4300
CMD ["cd server && node main.js"]
```

**构建和运行：**

```bash
docker build -t visink:latest .
docker run -p 4300:4300 visink:latest
```

**方案 2：本地构建后部署到 Docker（轻量级）：**

```bash
# 本地生产构建
pnpm build:prod

# 创建精简版 Dockerfile（无需构建阶段）
# Dockerfile.prod
FROM node:20-alpine
WORKDIR /app
COPY dist/web ./
EXPOSE 4300
CMD ["cd server && node main.js"]

# 构建和运行
docker build -f Dockerfile.prod -t visink:latest .
docker run -p 4300:4300 visink:latest
```

**对比：**

- 方案 1：在 Docker 容器中完整构建（推荐用于 CI/CD）
- 方案 2：本地构建，只推送 `dist/web`（镜像更小，部署更快）

#### 云平台部署

**Heroku：**

```bash
# 创建 Procfile
echo "web: cd dist/visink-web && node server/main.js" > Procfile

# 部署
git push heroku main
```

**Railway / Render / Fly.io：**

- 将代码推送到 Git 仓库
- 连接仓库并设置构建命令：`pnpm build:prod`
- 设置启动命令：`cd dist/visink-web && node server/main.js`
- 暴露端口：4300

**AWS / Google Cloud / Azure：**

```bash
# 部署 dist/web 目录
# 确保已安装 Node.js 20+
# 环境变量：NODE_ENV=production
# 启动命令：cd dist/visink-web && node server/main.js
```

### 生产环境变量

在 `dist/visink-web/server/` 目录创建 `.env` 文件或设置环境变量（仅用于后端）：

```env
NODE_ENV=production
PORT=4300
CORS_ORIGIN=https://yourdomain.com
```

如使用 Docker，通过环境变量传递：

```bash
docker run -e PORT=4300 -e NODE_ENV=production -e CORS_ORIGIN=https://yourdomain.com visink:latest
```

### Electron 应用程序部署

#### 为特定平台构建

**macOS：**

```bash
pnpm build:app
# 生成：dist/visink-app/visink-x.x.x.dmg、visink-x.x.x.zip、visink-x.x.x.tar.gz
```

**Windows：**

```bash
pnpm build:app
# 生成：dist/visink-app/visink Setup x.x.x.exe（NSIS 安装程序）
```

**Linux：**

```bash
pnpm build:app
# 生成：dist/visink-app/AppImage、deb 包等
```

**仅构建特定平台：**

```bash
# macOS
electron-builder --mac

# Windows
electron-builder --win

# Linux
electron-builder --linux
```

#### 分发方式

1. **直接下载**：在网站或 GitHub releases 上托管安装程序文件
2. **包管理器**：发布到：
   - macOS：Homebrew、Mac App Store
   - Windows：MSIX、Chocolatey、Windows Store
   - Linux：Snapcraft、Flathub、发行版仓库

3. **自动更新**：配置 electron-updater
   - 在 electron-builder 配置中设置更新服务器 URL
   - 在主进程中实现自动更新检查

### 版本管理

在构建前更新 `package.json` 中的版本：

```json
{
  "version": "1.0.0"
}
```

版本用于 electron-builder 和 Docker 镜像标签。

## 故障排除

### 端口已占用

- 后端：默认端口 3000
- 前端：默认端口 5173

解决方案：更改配置中的端口或终止使用该端口的进程。

### Node 进程未正常终止

- Electron 开发有时会留下 node 进程
- 应用程序重启时会自动清理这些进程

### 依赖问题

```bash
# 清空缓存并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 贡献指南

1. 确保代码通过代码检查：`pnpm lint`
2. 格式化代码：`pnpm format`
3. 运行类型检查：`pnpm typecheck`
4. 使用清晰的提交信息进行提交

## 相关资源

- [Electron 文档](https://www.electronjs.org/docs)
- [Electron Vite](https://electron-vite.org/)
- [Vue 3 文档](https://vuejs.org/)
- [NestJS 文档](https://docs.nestjs.com/)
- [Vite 文档](https://vitejs.dev/)
