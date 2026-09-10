import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/environment/env.config.js';
import { appConfig } from './config/app/app.config.js';
import { jwtConfig } from './config/jwt/jwt.config.js';
import { LoggerModule } from './config/logger/logger.module.js';
import { SequelizeDatabaseModule } from './infrastructure/database/sequelize/sequelize.module.js';
import { SecurityModule } from './infrastructure/security/security.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig, appConfig, jwtConfig],
      envFilePath: '.env',
    }),
    SequelizeDatabaseModule,
    SecurityModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
