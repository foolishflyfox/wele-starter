# Wele Starter Project Guide

## Project Overview

**Wele Starter** is a modern desktop application built with Electron, Vue 3, and TypeScript. It combines a NestJS backend with a Vue frontend to create a robust cross-platform application.

### Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: NestJS + Express
- **Desktop**: Electron + electron-vite
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier + TypeScript
- **UI Library**: Naive UI（通过 `unplugin-vue-components` + `NaiveUiResolver` 按需自动引入）

## Coding Conventions

### Naive UI

- SFC `<template>` 中使用大驼峰命名，例如 `<NButton>`、`<NInput>`，不使用 kebab-case（如 `<n-button>`）
- 组件无需手动 import，由 `unplugin-vue-components` 自动按需引入

### Project Structure

```
src/
├── main/          # Electron main process (Node.js)
├── preload/       # Electron preload scripts
├── renderer/      # Vue frontend application
└── server/        # NestJS backend server
```

## Development Setup

### Prerequisites

- Node.js 20+ (required)
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Development Commands

- **Web Development** (Frontend + Backend):

  ```bash
  pnpm dev          # Runs web UI + NestJS server concurrently
  pnpm dev:ui       # Vue development server only (port 5173)
  pnpm dev:server   # NestJS server only (port 3000)
  ```

- **Electron Development**:

  ```bash
  pnpm dev:app      # Electron dev mode
  ```

- **Code Quality**:
  ```bash
  pnpm lint         # Run ESLint
  pnpm format       # Format code with Prettier
  pnpm typecheck    # TypeScript type checking
  ```

### Building

- **Web Build**:

  ```bash
  pnpm build        # Build server + UI
  ```

- **Electron App**:

  ```bash
  pnpm build:app    # Build complete Electron application
  ```

- **Preview**:
  ```bash
  pnpm preview      # Preview production build
  ```

## Key Features

- ✨ Cross-platform desktop application
- 🎨 Modern Vue 3 UI with TypeScript
- 🔧 Full-featured NestJS backend
- ⚡ Fast development with Vite
- 📦 Native modules support via electron-builder
- 🎯 Type-safe development

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vue 3 support)

## Deployment Architecture

### Unified Deployment Model

- **Frontend & Backend Together**: Single Node.js process
  - Frontend (Vue) → static files in `dist/wele-starter-web/ui/`
  - Backend (NestJS) → serves API + static files
  - API prefix: `/api`
  - Frontend port: served by backend on same port

### Production Build

```bash
pnpm build          # Builds both frontend (dist/wele-starter-web/ui) and backend (dist/wele-starter-web/server)
```

### Build Commands

**Development Build:**

```bash
pnpm build          # Builds: pnpm build:server + pnpm build:ui
                    # Output: dist/wele-starter-web/ui/ + dist/wele-starter-web/server/
                    # Size: ~100 KB (code only, no dependencies)
```

**Production Build:**

```bash
pnpm build:prod     # Builds: pnpm build:server + pnpm build:ui + pnpm copy:deps
                    # Output: dist/wele-starter-web/ with all dependencies
                    # Size: ~500+ MB (self-contained)
```

**Electron App Build:**

```bash
pnpm build:app      # Builds: pnpm build:ui + pnpm build:server + electron-vite + electron-builder
                    # Output: dist/wele-starter-app/ (installers) + dist/wele-starter-web/
                    # Size: ~100-200 MB (per platform)
```

### Quick Deploy

```bash
# Build for production (includes all dependencies)
pnpm build:prod

# Run immediately - no installation needed
cd dist/wele-starter-web && node server/main.js
# Access at http://localhost:4160
```

### Docker Deployment

**Option 1: Build in Docker (recommended for CI/CD)**

```bash
docker build -t wele-starter:latest .
docker run -p 4160:4160 wele-starter:latest
```

Uses `pnpm build:prod` in Dockerfile. See README.md for template.

**Option 2: Build locally, deploy to Docker**

```bash
pnpm build:prod
docker build -f Dockerfile.prod -t wele-starter:latest .
docker run -p 4160:4160 wele-starter:latest
```

Build locally and push only `dist/wele-starter-web/server/` to Docker (lighter image).

## Common Issues & Solutions

### Port Conflicts

- Development UI: 5173 (Vite dev server)
- Development Backend: 3000 (NestJS)
- Production: 4160 (unified port)
- If ports are in use, update environment variables or kill conflicting processes

### Electron Dev Issues

- If node child processes persist after exit, they are automatically cleaned up
- Use `pnpm dev:app` for Electron development

### Build Output Structure

**After `pnpm build` (development):**

```
dist/
└── wele-starter-web/              # Web app package
    ├── ui/                  # Compiled frontend (Vue) ~70 KB
    │   ├── index.html
    │   ├── assets/
    │   │   ├── index-*.js (~62 KB)
    │   │   └── index-*.css (~7 KB)
    │   └── ...
    └── server/              # Compiled backend (NestJS)
        ├── main.js
        ├── app.controller.js
        ├── app.module.js
        └── ... (other files)
```

Use for: development, testing. Requires `node_modules` from project root.

**After `pnpm build:prod` (production):**

```
dist/
└── wele-starter-web/              # Complete self-contained web app
    ├── ui/                  # Compiled frontend (original)
    │   ├── index.html
    │   ├── assets/
    │   └── ...
    └── server/              # Complete backend with everything
        ├── main.js
        ├── package.json     # ✓ Copied
        ├── pnpm-lock.yaml   # ✓ Copied
        ├── node_modules/    # ✓ All dependencies (~500+ MB)
        │   ├── @nestjs/
        │   ├── express/
        │   └── ... (500+ packages)
        ├── web/             # ✓ Frontend copy (for production)
        │   ├── index.html
        │   └── assets/
        └── ... (other files)
```

Ready to deploy: `cd dist/wele-starter-web && node server/main.js` - no installation needed!

**After `pnpm build:app` (Electron app):**

```
dist/
├── wele-starter-web/              # Web app (same as pnpm build)
│   ├── ui/
│   └── server/
│
└── wele-starter-app/              # Electron installers
    └── mac/                 # macOS (platform-specific)
        ├── wele-starter-1.0.0.dmg
        ├── wele-starter-1.0.0-mac.zip
        ├── wele-starter.app/
        └── ...

out/                         # Electron build artifacts
├── main/                    # Main process compiled
├── preload/                 # Preload script compiled
└── renderer/                # Renderer process compiled
```

Ready to deploy: Double-click installer or app bundle!

## Contributing

1. Ensure code quality: `pnpm lint && pnpm format`
2. Run type checking: `pnpm typecheck`
3. Test changes before committing

## Key Files & Scripts

- `src/server/main.ts` - Configures static file serving (serves `dist/wele-starter-web/ui/`)
- `scripts/copy-deps.js` - Copies `node_modules` to `dist/wele-starter-web/server/` (called by `build:prod`)
- `vite.web.config.ts` - Frontend build configuration (output: `dist/wele-starter-web/ui/`)
- `tsconfig.server.json` - Backend TypeScript configuration (output: `dist/wele-starter-web/server/`)
- `package.json` - Contains `build` (dev) and `build:prod` (deployment) commands

## License

MIT
