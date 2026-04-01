import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const distVisinkWebDir = path.join(projectRoot, 'dist', 'visink-web')
const distServerDir = path.join(distVisinkWebDir, 'server')
const distUiDir = path.join(distVisinkWebDir, 'ui')
const distServerWebDir = path.join(distServerDir, 'web')

let copiedCount = 0
let skippedCount = 0

function copyDirSync(src, dest, skipExisting = false) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const files = fs.readdirSync(src)
  for (const file of files) {
    const srcPath = path.join(src, file)
    const destPath = path.join(dest, file)

    // Skip if file already exists (incremental copy)
    if (skipExisting && fs.existsSync(destPath)) {
      const srcStat = fs.statSync(srcPath)
      if (srcStat.isDirectory()) {
        // Recursively check subdirectories
        copyDirSync(srcPath, destPath, skipExisting)
      } else {
        skippedCount++
      }
      continue
    }

    const stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      copyDirSync(srcPath, destPath, skipExisting)
    } else {
      try {
        // Try hard link first (same filesystem, much faster)
        fs.linkSync(srcPath, destPath)
      } catch (err) {
        // Fall back to copy if hard link fails (different filesystem)
        fs.copyFileSync(srcPath, destPath)
      }
      copiedCount++
    }
  }
}

function copyFile(src, dest) {
  const dir = path.dirname(dest)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (fs.existsSync(dest)) {
    // Check if source and dest have same size (quick size check)
    const srcStat = fs.statSync(src)
    const destStat = fs.statSync(dest)
    if (srcStat.size === destStat.size) {
      skippedCount++
      return // Skip if already exists and same size
    }
  }

  fs.copyFileSync(src, dest)
  copiedCount++
}

try {
  const nodeModulesExist = fs.existsSync(path.join(distServerDir, 'node_modules'))

  console.log('📦 Setting up production dependencies in dist/visink-web/server...')

  // Step 1: Copy package.json and lock files FIRST
  console.log('  📄 Copying package.json...')
  copyFile(
    path.join(projectRoot, 'package.json'),
    path.join(distServerDir, 'package.json')
  )

  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    console.log('  📄 Copying pnpm-lock.yaml...')
    copyFile(
      path.join(projectRoot, 'pnpm-lock.yaml'),
      path.join(distServerDir, 'pnpm-lock.yaml')
    )
  }

  // Step 2: Install ONLY production dependencies in dist/server
  console.log('  🔧 Installing production dependencies only (--prod)...')
  try {
    execSync('pnpm install --prod --frozen-lockfile --ignore-scripts', {
      cwd: distServerDir,
      stdio: 'inherit'
    })
    console.log('  ✅ Production dependencies installed')
  } catch (err) {
    console.error('  ❌ Failed to install dependencies:', err.message)
    console.log('  💡 Falling back to copying node_modules from project root...')

    // Fallback: copy node_modules if pnpm install fails
    const nodeModulesDir = path.join(projectRoot, 'node_modules')
    const distNodeModulesDir = path.join(distServerDir, 'node_modules')

    if (fs.existsSync(nodeModulesDir)) {
      console.log('  📦 Copying node_modules...')
      copyDirSync(nodeModulesDir, distNodeModulesDir, true)
      console.log('  ⚠️  Warning: Full node_modules copied (includes devDependencies)')
    } else {
      throw new Error('node_modules not found and pnpm install failed')
    }
  }

  // Step 3: Copy frontend files
  if (fs.existsSync(distUiDir)) {
    console.log('  📄 Copying frontend to server/web...')
    copyDirSync(distUiDir, distServerWebDir, true)
  } else {
    console.warn('  ⚠️  Warning: dist/visink-web/ui not found. Run pnpm build:ui first.')
  }

  console.log('✅ Setup completed successfully!')
  console.log(`   📊 Files copied: ${copiedCount} | Skipped: ${skippedCount}`)
  if (nodeModulesExist && skippedCount > 0) {
    console.log('   ⚡ Incremental copy completed (reused existing files)')
  }
  console.log(`🚀 Ready to deploy: cd ${distVisinkWebDir} && node server/main.js`)
} catch (error) {
  console.error('❌ Error during setup:', error.message)
  process.exit(1)
}
