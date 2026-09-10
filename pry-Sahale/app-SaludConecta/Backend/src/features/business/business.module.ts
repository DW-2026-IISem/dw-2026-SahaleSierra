import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module.js';
import { ProductTypesModule } from './product-types/product-types.module.js';

@Module({
  imports: [ClientsModule, ProductTypesModule],
  exports: [ClientsModule, ProductTypesModule],
})
export class BusinessModule {}
