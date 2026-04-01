import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module.js'
import { join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('api')
  app.enableCors()

  // BS 模式：提供静态文件服务（前端 build 产物）
  const staticPath = join(__dirname, '..', 'web')
  app.useStaticAssets(staticPath, { prefix: '/' })

  const port = process.env.PORT || 4300
  await app.listen(port)
  console.log(`Server running on http://localhost:${port}`)
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
