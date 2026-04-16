import { execSync } from 'child_process';
import { platform } from 'os';

const p = platform();
const dir = p === 'darwin' ? 'mac' : p === 'win32' ? 'win' : 'linux';

execSync(`electron-builder --config.directories.output=dist/wele-starter-app/${dir}`, {
  stdio: 'inherit'
});
