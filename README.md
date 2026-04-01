# Visink

An Electron application with Vue 3, TypeScript, and NestJS backend.

A modern desktop application that combines a powerful NestJS backend with a responsive Vue 3 frontend, built with Electron for cross-platform deployment.

**[中文版本](./README.zh-CN.md)**

## Features

- 🖥️ Cross-platform desktop application (Windows, macOS, Linux)
- 🎨 Modern UI built with Vue 3 and TypeScript
- 🔧 Full-featured NestJS backend API
- ⚡ Fast development with Vite
- 📦 Electron builder for native app packaging
- 🔒 Type-safe development with TypeScript throughout
- 🛠️ Built-in development tools: ESLint, Prettier, TypeScript

## Tech Stack

| Component           | Technology                   |
| ------------------- | ---------------------------- |
| **Frontend**        | Vue 3, TypeScript, Vite      |
| **Backend**         | NestJS, Express              |
| **Desktop**         | Electron, electron-vite      |
| **Package Manager** | pnpm                         |
| **Code Quality**    | ESLint, Prettier, TypeScript |

## Prerequisites

- Node.js 20+ (required)
- pnpm (recommended) or npm
- Git

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Development

**Web Development (Frontend + Backend):**

```bash
pnpm dev
```

This runs:

- NestJS server on http://localhost:3000
- Vue dev server on http://localhost:5173

**Electron Development:**

```bash
pnpm dev:app
```

### 3. Code Quality

```bash
# Lint and fix files
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck
```

## Project Structure

```
visink/
├── src/
│   ├── main/          # Electron main process
│   ├── preload/       # Electron preload scripts
│   ├── renderer/      # Vue frontend application
│   └── server/        # NestJS backend server
├── build/             # Build output
├── dist/              # Distribution files
├── resources/         # Static resources and assets
├── electron.vite.config.ts    # Electron Vite configuration
├── vite.web.config.ts         # Web Vite configuration
├── tsconfig.json              # Main TypeScript config
└── package.json               # Project dependencies and scripts
```

## Available Scripts

### 🔧 Development
```bash
pnpm dev              # Start web dev (frontend + backend concurrently)
pnpm dev:app          # Start Electron dev mode
```

### 🏗️ Building
```bash
pnpm build            # Build web (output: dist/visink-web/)
pnpm build:prod       # Build for production (output: dist/visink-web/ with dependencies)
pnpm build:app        # Build Electron app (output: dist/visink-app/ + dist/visink-web/)

# Advanced (rarely used directly)
pnpm build:server     # Build backend only
pnpm build:ui         # Build frontend only
```

### ✨ Code Quality
```bash
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript type checking
```

### 📦 Distribution
```bash
pnpm copy:deps        # Copy dependencies to dist/visink-web/server/ (used by build:prod)
```

### 🔍 Quick Reference

| Command | Output | Size | Use Case |
|---------|--------|------|----------|
| `pnpm build` | `dist/visink-web/` (code only) | ~100 KB | Development, testing |
| `pnpm build:prod` | `dist/visink-web/` (prod deps only) | **~150-250 MB** ⬇️ | Production server deployment |
| `pnpm build:app` | `dist/visink-app/` + `dist/visink-web/` | ~100-200 MB | Electron app release |

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Volar Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vue 3 support)

## Configuration Files

| File | Purpose | Output Path |
|------|---------|-------------|
| `vite.web.config.ts` | Frontend build configuration | `dist/visink-web/ui/` |
| `nest-cli.json` | NestJS build configuration | `dist/visink-web/server/` |
| `tsconfig.server.json` | Backend TypeScript config | `dist/visink-web/server/` |
| `tsconfig.web.json` | Frontend TypeScript config | `dist/visink-web/ui/` |
| `electron.vite.config.ts` | Electron build configuration | `out/main`, `out/preload`, `out/renderer` |
| `electron-builder.yml` | Electron app packaging config | `dist/visink-app/` |
| `scripts/copy-deps.js` | Dependency copying script | `dist/visink-web/server/` |
| `.prettierrc.yaml` | Code formatting rules | - |
| `eslint.config.mjs` | Linting rules | - |
| `tsconfig.json` | Main TypeScript configuration | - |

## Building for Distribution

### Build Web Application

```bash
pnpm build
```

This creates optimized production files in the `dist/` directory.

### Build Electron Application

```bash
pnpm build:app
```

This will create platform-specific installers in the `dist/visink-app/` directory.

## Deployment

### Architecture

The application uses a **unified deployment model**:
- Frontend (Vue) is built as static files → `dist/visink-web/ui/`
- Backend (NestJS) is built → `dist/visink-web/server/`
- NestJS serves the static frontend files
- API routes are under `/api` prefix
- Single Node.js process serves both frontend and backend

### Build for Production

### Build Commands

| Command | Use Case | Output |
|---------|----------|--------|
| `pnpm build` | Development, testing | `dist/visink-web/server` (code only), `dist/visink-web/ui` |
| `pnpm build:prod` | Deployment | `dist/visink-web/server` (code + prod deps), `dist/visink-web/ui` |

**Development Build:**
```bash
pnpm build
```
- Builds frontend and backend code
- Output in `dist/` directory
- **No dependencies copied** - requires `node_modules` from project root
- Use for: development, testing, checking build output
- Deploy by: uploading entire project with `node_modules`

**Production Build (Deployment):**
```bash
pnpm build:prod
```
- Builds frontend and backend code
- Copies all `node_modules` and configuration files to `dist/visink-web/server/`
- Creates completely self-contained deployment package
- Use for: production deployment, Docker images, CI/CD pipelines
- Deploy by: uploading only `dist/visink-web/server` directory

### When to Use Each Command

**Use `pnpm build` when:**
- Developing or testing locally
- Running tests against built code
- Want to minimize build time during development
- Output: `dist/visink-web/` with `ui/` and `server/` (requires project `node_modules`)

**Use `pnpm build:prod` when:**
- Preparing code for production deployment
- Building Docker images
- Deploying to cloud platforms (Heroku, Railway, AWS, etc.)
- Creating distributable packages
- Output: `dist/visink-web/` with all dependencies included in `server/`

**Use `pnpm build:app` when:**
- Releasing Electron desktop application
- Creating platform-specific installers (DMG, EXE, AppImage, etc.)
- Output: `dist/visink-app/` with installers + `dist/visink-web/` for internal use

### Web Application Deployment

Since frontend and backend are deployed together, you only need to deploy the backend:

#### Local Deployment

```bash
# Build for production (includes all dependencies)
pnpm build:prod

# Run the server immediately (all dependencies are included in dist/visink-web/server/)
cd dist/visink-web && node server/main.js
# Application available at http://localhost:4300
```

After `pnpm build:prod`, the `dist/visink-web/` directory is completely self-contained:
- `dist/visink-web/ui/` - Compiled frontend code
- `dist/visink-web/server/` - Compiled backend with production dependencies only
  - `dist/visink-web/server/node_modules/` - **Production dependencies only** (~150-250 MB)
    - Installed via `pnpm install --prod --frozen-lockfile` during build
    - Excludes devDependencies, test files, and unnecessary artifacts
  - `dist/visink-web/server/web/` - Copy of frontend (served by NestJS)
  - Configuration files (package.json, pnpm-lock.yaml)

**Size Optimization:** Production-only dependencies reduce size by 50-70% compared to full node_modules (~150-250 MB instead of 500+ MB).

Ready to deploy without any additional installation steps: `cd dist/visink-web && node server/main.js`

#### Docker Deployment

**Option 1: Build in Docker (Multi-stage build):**

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build:prod

# Stage 2: Runtime (includes all dependencies from build)
FROM node:20-alpine
WORKDIR /app

# Copy entire dist/web directory (ui + server with node_modules)
COPY --from=builder /app/dist/web ./

EXPOSE 4300
CMD ["cd server && node main.js"]
```

**Build and run:**
```bash
docker build -t visink:latest .
docker run -p 4300:4300 visink:latest
```

**Option 2: Build locally, then deploy to Docker (lightweight):**

```bash
# Build locally with production dependencies
pnpm build:prod

# Create minimal Dockerfile (no build stage needed)
# Dockerfile.prod
FROM node:20-alpine
WORKDIR /app
COPY dist/web ./
EXPOSE 4300
CMD ["cd server && node main.js"]

# Build and run
docker build -f Dockerfile.prod -t visink:latest .
docker run -p 4300:4300 visink:latest
```

**Comparison:**
- Option 1: Complete build happens in Docker container (recommended for CI/CD)
- Option 2: Build locally, push only `dist/web` (smaller image, faster deployment)

#### Cloud Platforms

**Heroku:**
```bash
# Create Procfile
echo "web: cd dist/visink-web && node server/main.js" > Procfile

# Deploy
git push heroku main
```

**Railway / Render / Fly.io:**
- Push your code to git repository
- Connect repository and set build command: `pnpm build:prod`
- Set start command: `cd dist/visink-web && node server/main.js`
- Expose port: 4300

**AWS / Google Cloud / Azure:**
```bash
# Deploy dist/web directory
# Ensure Node.js 20+ is installed
# Environment: NODE_ENV=production
# Start command: cd dist/visink-web && node server/main.js
```

### Production Environment Variables

Create `.env` file in `dist/visink-web/server/` or set environment variables (for backend only):

```env
NODE_ENV=production
PORT=4300
CORS_ORIGIN=https://yourdomain.com
```

If using Docker, pass via environment:
```bash
docker run -e PORT=4300 -e NODE_ENV=production -e CORS_ORIGIN=https://yourdomain.com visink:latest
```

### Electron App Deployment

#### Building for Specific Platforms

**For macOS:**
```bash
pnpm build:app
# Creates: dist/visink-app/visink-x.x.x.dmg, visink-x.x.x.zip, visink-x.x.x.tar.gz
```

**For Windows:**
```bash
pnpm build:app
# Creates: dist/visink-app/visink Setup x.x.x.exe (NSIS installer)
```

**For Linux:**
```bash
pnpm build:app
# Creates: dist/visink-app/AppImage, deb package, etc.
```

**Build for specific platform only:**
```bash
# macOS
electron-builder --mac

# Windows
electron-builder --win

# Linux
electron-builder --linux
```

#### Distribution Methods

1. **Direct Download**: Host installer files on your website or GitHub releases
2. **Package Managers**: Publish to:
   - macOS: Homebrew, Mac App Store
   - Windows: MSIX, Chocolatey, Windows Store
   - Linux: Snapcraft, Flathub, distribution repos

3. **Auto Update**: Configure electron-updater
   - Set update server URL in electron-builder config
   - Implement auto-update checks in main process

### Versioning

Update version in `package.json` before building:

```json
{
  "version": "1.0.0"
}
```

Version is used by electron-builder and Docker image tags.

## Troubleshooting

### Port Already in Use

- Backend: Default port 3000
- Frontend: Default port 5173

Solution: Change ports in configuration or kill the process using the port.

### Node Processes Not Terminating

- Electron dev sometimes leaves node processes
- These are automatically cleaned up on application restart

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Contributing

1. Ensure code passes linting: `pnpm lint`
2. Format code: `pnpm format`
3. Run type check: `pnpm typecheck`
4. Commit with clear messages

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Vite](https://electron-vite.org/)
- [Vue 3 Documentation](https://vuejs.org/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Vite Documentation](https://vitejs.dev/)
