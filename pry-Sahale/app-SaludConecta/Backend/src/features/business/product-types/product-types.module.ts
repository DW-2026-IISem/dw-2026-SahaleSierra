import { Module } from '@nestjs/common';
import { PRODUCT_TYPE_REPOSITORY } from './domain/interfaces/product-type-repository.interface.js';
import { ProductTypeRepository } from './infrastructure/persistence/repositories/product-type.repository.js';
import { CreateProductTypeUseCase } from './application/use-cases/create-product-type.use-case.js';
import { UpdateProductTypeUseCase } from './application/use-cases/update-product-type.use-case.js';
import { DeleteProductTypeUseCase } from './application/use-cases/delete-product-type.use-case.js';
import { GetProductTypeUseCase } from './application/use-cases/get-product-type.use-case.js';
import { ListProductTypesUseCase } from './application/use-cases/list-product-types.use-case.js';
import { ProductTypesController } from './presentation/http/controllers/product-types.controller.js';

@Module({
  controllers: [ProductTypesController],
  providers: [
    ProductTypeRepository,
    { provide: PRODUCT_TYPE_REPOSITORY, useExisting: ProductTypeRepository },
    CreateProductTypeUseCase,
    UpdateProductTypeUseCase,
    DeleteProductTypeUseCase,
    GetProductTypeUseCase,
    ListProductTypesUseCase,
  ],
  exports: [PRODUCT_TYPE_REPOSITORY],
})
export class ProductTypesModule {}
