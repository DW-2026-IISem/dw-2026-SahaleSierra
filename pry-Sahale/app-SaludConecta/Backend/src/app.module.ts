import { Module } from '@nestjs/common';
import { BusinessModule } from './features/business/business.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [BusinessModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
