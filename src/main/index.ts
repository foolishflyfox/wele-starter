import { app, BrowserWindow, Menu, globalShortcut } from 'electron';
import { join, dirname } from 'path';
import { fork, spawn, ChildProcess } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let serverProcess: ChildProcess | null = null;

function startServer(): void {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // 开发模式：使用 spawn 运行 ts-node
    console.log('Starting server in dev mode: ts-node src/server/main.ts');
    serverProcess = spawn('node', ['--loader', 'ts-node/esm', 'src/server/main.ts'], {
      env: { ...process.env, PORT: '4300', NODE_ENV: 'development' },
      stdio: 'inherit',
      cwd: join(__dirname, '../..')
    });
  } else {
    // 生产模式：使用 fork 运行编译后的 JavaScript
    const serverScript = join(__dirname, '../../dist/visink-web/server/main.js');
    console.log('Starting server in prod mode:', serverScript);
    serverProcess = fork(serverScript, [], {
      env: { ...process.env, PORT: '4300', NODE_ENV: 'production' },
      stdio: 'inherit'
    });
  }

  serverProcess.on('error', (err) => {
    console.error('Server process error:', err);
  });

  serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

function createWindow(): void {
  const isDev = process.env.NODE_ENV === 'development';

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: isDev ? undefined : join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: !isDev
    }
  });

  const startUrl = isDev ? 'http://localhost:4030' : 'http://localhost:4300';

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  startServer();
  // 等待服务器启动后再打开窗口
  setTimeout(createWindow, 2000);

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
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
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // 注册快捷键打开开发者工具
  globalShortcut.register('CmdOrCtrl+Shift+I', () => {
    if (mainWindow) {
      mainWindow.webContents.toggleDevTools();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // 注销全局快捷键
  globalShortcut.unregisterAll();

  // 杀死子进程
  if (serverProcess) {
    console.log('Killing server process...');
    serverProcess.kill('SIGTERM');
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
