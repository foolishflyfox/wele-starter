# 构建输出目录说明

## 📦 pnpm build 的输出

### 执行命令
```bash
pnpm build
```

### 执行流程
```
pnpm build
  ├─ pnpm build:server  (nest build)
  └─ pnpm build:ui      (vite build)
```

### 生成的目录结构
```
dist/
├── web/
│   ├── ui/                          # 前端编译结果（Vue）
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── electron-*.svg       # 静态资源
│   │   │   ├── index-*.js           # 打包的 JS
│   │   │   └── index-*.css          # 打包的 CSS
│   │   └── ... (其他前端产物)
│   │
│   └── server/                      # 后端编译结果（NestJS）
│       ├── main.js                  # 入口文件
│       ├── main.d.ts
│       ├── main.js.map
│       ├── app.controller.js        # 控制器
│       ├── app.module.js            # 模块
│       ├── app.service.js           # 服务
│       └── ... (其他 TS 编译产物)
```

### 特点
- ✅ 前后端代码都已编译
- ❌ **没有** `node_modules`（需要从项目根目录提供）
- ❌ **没有** 前端副本在 `server/web/`（直接指向 `../ui`）
- 💡 适合开发和测试

### 启动方式
```bash
# 需要项目根目录的 node_modules
cd dist/visink-web
node server/main.js
# 访问 http://localhost:4300
```

---

## 🎯 pnpm build:prod 的输出

### 执行命令
```bash
pnpm build:prod
```

### 执行流程
```
pnpm build:prod
  ├─ pnpm build:server   (nest build)
  ├─ pnpm build:ui       (vite build)
  └─ pnpm copy:deps      (复制依赖和前端)
```

### 生成的目录结构
```
dist/
├── web/
│   ├── ui/                          # 前端编译源
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── electron-*.svg
│   │   │   ├── index-*.js
│   │   │   └── index-*.css
│   │   └── ...
│   │
│   └── server/                      # 完整的自包含后端
│       ├── main.js                  # 入口文件
│       ├── package.json             # 复制的依赖声明 ✓
│       ├── pnpm-lock.yaml           # 复制的 lock 文件 ✓
│       ├── node_modules/            # 复制的全部依赖 ✓
│       │   ├── @nestjs/
│       │   ├── express/
│       │   ├── vue/
│       │   └── ... (500+ 个包)
│       ├── web/                     # 前端副本（从 ../ui 复制）✓
│       │   ├── index.html
│       │   ├── assets/
│       │   │   ├── electron-*.svg
│       │   │   ├── index-*.js
│       │   │   └── index-*.css
│       │   └── ...
│       ├── app.controller.js
│       ├── app.module.js
│       └── ... (其他后端产物)
```

### 特点
- ✅ 完全自包含的部署包
- ✅ 包含所有 `node_modules` 依赖
- ✅ 前端文件已复制到 `server/web/`
- ✅ 可独立部署到任何服务器
- 🔗 硬链接优化（同一文件系统下，节省空间）

### 启动方式
```bash
# 完全独立，无需其他依赖
cd dist/visink-web
node server/main.js
# 访问 http://localhost:4300
```

### 部署大小
```
dist/visink-web/server/node_modules/  ~500+ MB（根据依赖大小）
```

---

## 🖥️ pnpm build:app 的输出

### 执行命令
```bash
pnpm build:app
```

### 执行流程
```
pnpm build:app
  ├─ pnpm build:server      (nest build → dist/visink-web/server)
  ├─ electron-vite build    (编译 Electron main + preload)
  └─ electron-builder       (打包最终应用)
```

⚠️ **注意**: `pnpm build:app` **不会** 构建 Web 前端（`dist/visink-web/ui`）

### 生成的目录结构
```
dist/
├── web/
│   └── server/                     # ✅ NestJS 后端（Electron 应用所需）
│       ├── main.js                 # Electron 会运行这个
│       ├── app.controller.js
│       ├── app.module.js
│       └── ...
│
├── visink/visink-app/              # 最终应用安装程序
│   ├── visink-x.x.x.dmg           # macOS 安装程序
│   ├── visink-x.x.x.zip           # macOS 压缩包
│   ├── visink-x.x.x.tar.gz        # Linux 压缩包
│   ├── visink Setup x.x.x.exe      # Windows 安装程序
│   ├── visink-x.x.x.AppImage       # Linux AppImage
│   ├── visink-x.x.x.deb            # Debian 包
│   └── ... (其他平台特定文件)
│
└── (out/ 目录在打包后被清理)        # Electron 编译的临时产物

```

### dist/visink-web 的作用
- ✅ `dist/visink-web/server/` - **必需**
  - Electron 应用启动时会运行 `dist/visink-web/server/main.js`
  - 这是一个子进程，为 Electron 应用提供 API 和数据服务
  - 应用会在 `http://localhost:4300` 上访问这个服务器

- ❌ `dist/visink-web/ui/` - **不会生成**
  - Electron 应用有自己的 renderer 进程（Web 视图）
  - 不需要 Web 前端文件

### 特点
- ✅ Electron 桌面应用打包
- ✅ 支持多平台（Windows、macOS、Linux）
- ✅ 包含 NestJS 后端作为子进程
- ✅ 包含应用安装程序
- 📦 文件大小：~100-200 MB（取决于平台和配置）

### 输出文件说明
| 文件 | 平台 | 说明 |
|------|------|------|
| `.dmg` | macOS | 磁盘镜像，用于拖放安装 |
| `.zip` / `.tar.gz` | macOS / Linux | 压缩存档 |
| `Setup.exe` | Windows | NSIS 安装程序 |
| `.AppImage` | Linux | 可执行应用镜像 |
| `.deb` | Debian/Ubuntu | Debian 包 |

---

## 📊 对比总结

| 特性 | `pnpm build` | `pnpm build:prod` | `pnpm build:app` |
|------|--------------|------------------|-----------------|
| 构建 Web 前端 | ✅ | ✅ | ❌ |
| 构建 Web 后端 | ✅ | ✅ | ✅ |
| 包含 node_modules | ❌ | ✅ | ❌ |
| 复制前端到 server/web | ❌ | ✅ | ❌ |
| 生成 Electron 应用 | ❌ | ❌ | ✅ |
| 生成大小 | ~5 MB | ~500+ MB | ~100-200 MB |
| 输出位置 | `dist/visink-web/` | `dist/visink-web/` | `dist/visink-app/` |
| 可直接运行 | ⚠️ (需要 node_modules) | ✅ | ✅ |
| 适用场景 | 开发、测试 | 生产部署 | 桌面应用 |

### 详细说明
- **pnpm build**: 编译前后端代码
  - 输出：`dist/visink-web/ui/` (前端) + `dist/visink-web/server/` (后端，无依赖)
  - 用途：开发和测试
  - 需要从项目根目录提供 `node_modules`

- **pnpm build:prod**: 完整生产包
  - 输出：`dist/visink-web/` (包含所有依赖和前端副本)
  - 用途：部署到服务器（Node.js 应用）
  - 完全自包含，可独立运行

- **pnpm build:app**: Electron 桌面应用
  - 输出：`dist/visink-app/` (平台相关安装程序)
  - 附带：`dist/visink-web/server/` (Electron 启动的后端服务)
  - 用途：发布桌面应用
  - Electron 渲染进程内置，不需要 Web 前端

---

## 🚀 使用场景

### 场景 1: 开发调试
**目标**: 快速编译和测试
```bash
pnpm build
cd dist/visink-web
node server/main.js
# 访问 http://localhost:4300
# 需要项目根目录的 node_modules
```

### 场景 2: 生产部署（Web 服务器）
**目标**: 部署到云平台或自有服务器
```bash
pnpm build:prod
# 生成完整的 dist/visink-web 目录（包含所有依赖）
cd dist/visink-web
node server/main.js
# 或上传整个 dist/visink-web 到服务器
```
适用于：Heroku、Railway、AWS、自有服务器等

### 场景 3: 发布桌面应用
**目标**: 生成 Electron 安装程序
```bash
pnpm build:app
# 生成的应用程序在 dist/visink-app/
# - Windows: dist/visink-app/visink Setup x.x.x.exe
# - macOS:   dist/visink-app/visink-x.x.x.dmg
# - Linux:   dist/visink-app/visink-x.x.x.AppImage
```
应用会自动启动内置的 NestJS 服务器

### 场景 4: Docker 部署
**目标**: 容器化 Web 应用
```bash
# 步骤 1: 本地构建
pnpm build:prod

# 步骤 2: Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY dist/visink-web ./
EXPOSE 4300
CMD ["cd server && node main.js"]

# 步骤 3: 构建和运行
docker build -t visink:latest .
docker run -p 4300:4300 visink:latest
```
