import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const distServerDir = path.join(projectRoot, 'dist', 'server')
const nodeModulesDir = path.join(projectRoot, 'node_modules')
const distNodeModulesDir = path.join(distServerDir, 'node_modules')

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
  const nodeModulesExist = fs.existsSync(distNodeModulesDir)

  console.log('📦 Copying dependencies to dist/server...')

  // Incremental copy: skip existing files
  console.log('  Copying node_modules...')
  copyDirSync(nodeModulesDir, distNodeModulesDir, true)

  // Copy package.json
  console.log('  Copying package.json...')
  copyFile(
    path.join(projectRoot, 'package.json'),
    path.join(distServerDir, 'package.json')
  )

  // Copy pnpm-lock.yaml
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    console.log('  Copying pnpm-lock.yaml...')
    copyFile(
      path.join(projectRoot, 'pnpm-lock.yaml'),
      path.join(distServerDir, 'pnpm-lock.yaml')
    )
  }

  console.log('✅ Dependencies copied successfully!')
  console.log(`   📊 Copied: ${copiedCount} files | Skipped: ${skippedCount} files`)
  if (nodeModulesExist && skippedCount > 0) {
    console.log('   ⚡ Incremental copy completed (reused existing files)')
  }
  console.log(`🚀 Ready to deploy: node ${distServerDir}/main.js`)
} catch (error) {
  console.error('❌ Error copying dependencies:', error.message)
  process.exit(1)
}
