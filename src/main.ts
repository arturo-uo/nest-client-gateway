import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { envs } from './config'

async function bootstrap() {
const logger = new Logger('Main-Gateway')

  const app = await NestFactory.create(AppModule)
  await app.listen(envs.PORT)

  logger.log(`Gateway is running on port ${envs.PORT}`)
}
bootstrap();
