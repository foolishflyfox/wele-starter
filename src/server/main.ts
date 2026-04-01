import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  // 提供静态文件服务（前端 build 产物）
  // 开发模式：__dirname 指向 dist/visink-web/server，前端在 ../ui
  // 生产模式：前端副本在 web/（复制脚本会创建）
  const staticPaths = [
    join(__dirname, 'web'), // 生产模式（有依赖复制的版本）
    join(__dirname, '..', 'ui') // 开发模式（直接构建）
  ];

  for (const staticPath of staticPaths) {
    try {
      if (existsSync(staticPath)) {
        app.useStaticAssets(staticPath, { prefix: '/' });
        console.log(`✓ Serving static files from: ${staticPath}`);
        break;
      }
    } catch (err) {
      // 继续尝试下一个路径
    }
  }

  const port = process.env.PORT || 4300;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
