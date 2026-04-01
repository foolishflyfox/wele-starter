import { app, BrowserWindow, Menu } from 'electron'
import { join, dirname } from 'path'
import { fork, ChildProcess } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow: BrowserWindow | null = null
let serverProcess: ChildProcess | null = null

function startServer(): void {
  // 编译后的服务器位置
  const serverScript = join(__dirname, '../../dist/server/main.js')

  console.log('Starting server from:', serverScript)

  serverProcess = fork(serverScript, [], {
    env: { ...process.env, PORT: '4300', NODE_ENV: 'development' },
    stdio: 'inherit'
  })

  serverProcess.on('error', (err) => {
    console.error('Server process error:', err)
  })

  serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`)
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const isDev = process.env.NODE_ENV === 'development'
  const startUrl = isDev ? 'http://localhost:5170' : 'http://localhost:4300'

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  startServer()
  // 等待服务器启动后再打开窗口
  setTimeout(createWindow, 2000)

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
