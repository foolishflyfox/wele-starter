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

```bash
# Development
pnpm dev              # Web dev (frontend + backend)
pnpm dev:app          # Electron dev
pnpm dev:server       # Backend dev
pnpm dev:ui           # Frontend dev

# Building
pnpm build            # Build web (server + UI, no dependencies)
pnpm build:prod       # Build for production (includes all dependencies)
pnpm build:server     # Build backend only
pnpm build:ui         # Build frontend only
pnpm build:app        # Build complete Electron app

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript check

# Other
pnpm preview          # Preview production build
pnpm postinstall      # Install Electron native modules
```

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Volar Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vue 3 support)

## Configuration Files

- `electron.vite.config.ts` - Electron and Vite build configuration
- `vite.web.config.ts` - Web/UI build configuration
- `tsconfig.json` - TypeScript configuration (main)
- `tsconfig.server.json` - TypeScript for NestJS backend
- `tsconfig.web.json` - TypeScript for Vue frontend
- `nest-cli.json` - NestJS CLI configuration
- `electron-builder.yml` - Electron app builder settings
- `.prettierrc.yaml` - Code formatting rules
- `eslint.config.mjs` - Linting rules

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
| `pnpm build:prod` | Deployment | `dist/visink-web/server` (code + node_modules), `dist/visink-web/ui` |

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

**Use `pnpm build:prod` when:**
- Preparing code for production deployment
- Building Docker images
- Deploying to cloud platforms (Heroku, Railway, etc.)
- Creating distributable packages

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

After `pnpm build:prod`, the `dist/web/` directory is completely self-contained:
- `dist/visink-web/ui/` - Compiled frontend code
- `dist/visink-web/server/` - Compiled backend code with all npm dependencies
  - `dist/visink-web/server/node_modules/` - All dependencies
  - `dist/visink-web/server/web/` - Copy of frontend (served by NestJS)
  - Configuration files (package.json, pnpm-lock.yaml)

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
