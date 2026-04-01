# 构建输出目录说明

## 📦 pnpm build 的输出

### 执行命令
```bash
pnpm build
```

### 执行流程
```
pnpm build
  ├─ pnpm build:server  (nest build → dist/visink-web/server)
  └─ pnpm build:ui      (vite build → dist/visink-web/ui)
```

### 生成的目录结构
```
dist/
└── visink-web/                      # Web 应用部署包
    ├── ui/                          # 前端编译结果（Vue）
    │   ├── index.html
    │   ├── assets/
    │   │   ├── electron-DtwWEc_u.svg
    │   │   ├── index-BtTugGZ6.js    # ~62 KB
    │   │   └── index-DROlY-Db.css   # ~7 KB
    │
    └── server/                      # 后端编译结果（NestJS）
        ├── main.js
        ├── main.d.ts
        ├── main.js.map
        ├── app.controller.js
        ├── app.controller.d.ts
        ├── app.module.js
        ├── app.service.js
        └── ...
```

### 特点
- ✅ 前后端代码都已编译
- ❌ **没有** `node_modules`（需要从项目根目录提供）
- ❌ **没有** 前端副本在 `server/web/`（开发模式直接指向 `../ui`）
- 💡 适合开发和测试
- 📦 总大小：~100 KB（仅编译产物，不含依赖）

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
  └─ pnpm copy:deps      (复制依赖和前端副本)
```

### 生成的目录结构
```
dist/
└── visink-web/                      # 完整的自包含 Web 应用
    ├── ui/                          # 前端编译源
    │   ├── index.html
    │   └── assets/
    │
    └── server/                      # 完整的自包含后端
        ├── main.js
        ├── package.json             # ✓ 复制的依赖声明
        ├── pnpm-lock.yaml           # ✓ 复制的 lock 文件
        ├── node_modules/            # ✓ 生产依赖仅（~150-250 MB）
        │   ├── @nestjs/
        │   ├── express/
        │   ├── vue/
        │   └── ... (100+ 个生产包，不含开发依赖)
        ├── web/                     # ✓ 前端副本（从 ../ui 复制）
        │   ├── index.html
        │   └── assets/
        ├── app.controller.js
        ├── app.module.js
        ├── app.service.js
        └── ...
```

### 特点
- ✅ 完全自包含的部署包
- ✅ **只包含生产依赖**（通过 `pnpm install --prod --frozen-lockfile`）
  - 排除所有 devDependencies
  - 排除测试文件、TypeScript 定义、文档等
  - **减少 50-70% 的大小** (~150-250 MB vs 500+ MB)
- ✅ 前端文件已复制到 `server/web/`
- ✅ 可独立部署到任何服务器
- 📦 总大小：**~150-250 MB**（仅生产依赖）

### 启动方式
```bash
# 完全独立，无需其他依赖
cd dist/visink-web
node server/main.js
# 访问 http://localhost:4300
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
  ├─ pnpm build:ui          (vite build → dist/visink-web/ui)
  ├─ pnpm build:server      (nest build → dist/visink-web/server)
  ├─ electron-vite build    (编译 Electron main/preload/renderer → out/)
  └─ electron-builder       (打包应用 → dist/visink-app/)
```

### 生成的目录结构
```
dist/
├── visink-web/                      # Web 应用（同 pnpm build）
│   ├── ui/
│   └── server/
│
└── visink-app/                      # Electron 应用安装程序
    └── mac/                         # macOS 构建（取决于构建平台）
        ├── visink-1.0.0.dmg       # DMG 磁盘镜像
        ├── visink-1.0.0-mac.zip   # ZIP 压缩包
        ├── visink-1.0.0.dmg.blockmap
        ├── visink-1.0.0-mac.zip.blockmap
        └── visink.app/            # 应用包
            └── Contents/
                ├── MacOS/
                ├── Resources/
                └── ... (Electron 应用内容)

out/                                # Electron 编译中间产物（构建完成后）
├── main/                           # Electron 主进程编译结果
│   └── index.js
├── preload/                        # Preload 脚本编译结果
│   └── index.mjs
└── renderer/                       # Electron 渲染进程编译结果
    ├── index.html
    └── assets/
        ├── electron-*.svg
        ├── index-*.css
        └── index-*.js
```

### 平台特定的输出文件

| 平台 | 文件 | 大小 |
|------|------|------|
| macOS | `visink-1.0.0.dmg` | ~100-150 MB |
| macOS | `visink-1.0.0-mac.zip` | ~100-150 MB |
| Windows | `visink Setup 1.0.0.exe` | ~150-200 MB |
| Linux | `visink-1.0.0.AppImage` | ~100-150 MB |
| Linux | `visink-1.0.0.deb` | ~100-150 MB |

### 特点
- ✅ Electron 桌面应用完整打包
- ✅ 包含 NestJS 后端（作为应用内子进程）
- ✅ 包含 Web 前端（在应用内访问）
- ✅ 支持多平台（Windows、macOS、Linux）
- ✅ 包含应用安装程序
- ✅ 自包含，无需外部依赖
- 📦 文件大小：~100-200 MB（取决于平台）

### Electron 应用运行流程
```
1. 用户双击应用 → Electron 主进程启动
                 ├─ 启动子进程：fork dist/visink-web/server/main.js
                 ├─ NestJS 启动 → 监听 http://localhost:4300
                 └─ 加载前端：dist/visink-web/ui

2. Electron 窗口加载 → http://localhost:4300
                      └─ 返回 dist/visink-web/ui 的 HTML

3. 用户交互 → 前端与 NestJS API 通信 (/api/*)
               └─ 完整的桌面应用体验
```

### 包含的文件说明
- **Electron Framework**: Chromium 渲染引擎
- **Node.js 运行时**: 运行 NestJS 后端
- **dist/visink-web/**: Web 应用代码
- **node_modules**: 应用依赖（在应用包内或通过配置包含）

---

## 📊 对比总结

| 特性 | `pnpm build` | `pnpm build:prod` | `pnpm build:app` |
|------|--------------|------------------|-----------------|
| **输出位置** | `dist/visink-web/` | `dist/visink-web/` | `dist/visink-app/` + `dist/visink-web/` |
| **构建前端** | ✅ | ✅ | ✅ |
| **构建后端** | ✅ | ✅ | ✅ |
| **包含 node_modules** | ❌ | ✅ (prod only) | ✅ (in app) |
| **复制前端副本** | ❌ | ✅ | ✅ |
| **生成 Electron 应用** | ❌ | ❌ | ✅ |
| **输出大小** | ~100 KB | **~150-250 MB** ⬇️ | ~100-200 MB |
| **是否自包含** | ❌ | ✅ | ✅ |
| **启动命令** | `cd dist/visink-web && node server/main.js` | 同左 | 双击应用 |
| **部署方式** | 手动 + node_modules | 直接上传 | 发布安装程序 |
| **适用场景** | 开发、测试 | 生产服务器 | 发布桌面应用 |

---

## 🚀 使用场景

### 场景 1: 开发调试
```bash
pnpm build
cd dist/visink-web
node server/main.js
# 访问 http://localhost:4300
```

### 场景 2: 生产部署（Web 服务器）
```bash
pnpm build:prod
cd dist/visink-web
node server/main.js
# 或上传整个 dist/visink-web 到服务器
```

### 场景 3: 发布桌面应用
```bash
pnpm build:app
# 获取安装程序：dist/visink-app/mac/ (或 win/linux)
# 用户双击应用即可使用
```

### 场景 4: Docker 部署
```bash
pnpm build:prod
# Dockerfile 内容：
# FROM node:20-alpine
# COPY dist/visink-web ./
# CMD ["cd server && node main.js"]
```

---

## 📁 关键路径说明

### pnpm build 时的 NestJS 前端寻址
```
__dirname = dist/visink-web/server/
└─ ../ui = dist/visink-web/ui  ← 前端在这里
```

### pnpm build:prod 时的 NestJS 前端寻址
```
__dirname = dist/visink-web/server/
├─ web/ = dist/visink-web/server/web  ← 优先使用（有副本）
└─ ../ui = dist/visink-web/ui         ← 备选
```

### pnpm build:app 时的 Electron 后端寻址
```
__dirname = out/main/ (编译后)
映射到运行时 = dist/visink-app/Resources/ (在应用包内)
└─ ../../dist/visink-web/server/main.js ← Electron fork 这个进程
```

---

## 💾 体积优化说明

### 为什么 pnpm build:prod 的大小从 500+ MB 降低到 150-250 MB？

#### 旧方案（完全复制）
- 复制整个 `node_modules` 目录
- 包含 devDependencies（测试、构建工具等）
- 包含源代码、类型定义、文档
- **大小：500+ MB**

#### 新方案（生产依赖仅）
```bash
# 使用 pnpm install --prod --frozen-lockfile
```
- ✅ 只安装生产依赖
- ✅ 排除所有 devDependencies
- ✅ 自动排除测试文件、源代码等
- ✅ **大小：150-250 MB**（减少 50-70%）

#### 优化对比

| 项目 | 完全 npm | 生产 npm | 节省 |
|------|----------|---------|------|
| 依赖包数 | 500+ | 100+ | ⬇️ 80% |
| 安装时间 | 2-3 分钟 | 30-60 秒 | ⬇️ 75% |
| 磁盘空间 | 500+ MB | 150-250 MB | ⬇️ 60-70% |
| 传输时间 | 5-10 分钟 | 1-2 分钟 | ⬇️ 80% |

#### 对应用功能的影响
✅ **无任何负面影响**
- 生产环境不需要 TypeScript 编译器
- 不需要测试框架和工具
- 不需要开发文档和源代码
- 只需要已编译的 JS 代码

#### 如何进一步优化（可选）
```bash
# 如果仍想减少体积，可移除不必要的文件：
find node_modules -type f \( -name "*.ts" -o -name "*.map" \) -delete
find node_modules -type d -name "test" -o -name "tests" | xargs rm -rf
```

这样可进一步减少 **20-30%** 的体积，达到 **100-150 MB**。
