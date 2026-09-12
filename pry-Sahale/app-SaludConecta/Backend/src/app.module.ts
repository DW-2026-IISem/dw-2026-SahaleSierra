import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BusinessModule } from './features/business/business.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SequelizeDatabaseModule } from './infrastructure/database/sequelize/sequelize.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BusinessModule,
    SequelizeDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}