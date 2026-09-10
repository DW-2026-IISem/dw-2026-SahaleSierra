import { Inject, Injectable } from '@nestjs/common';
import { ProductType } from '../../domain/entities/product-type.entity.js';
import {
  type IProductTypeRepository,
  PRODUCT_TYPE_REPOSITORY,
} from '../../domain/interfaces/product-type-repository.interface.js';
import { CreateProductTypeDto } from '../dto/create-product-type.dto.js';
import { ProductTypeMapper } from '../mappers/product-type.mapper.js';

@Injectable()
export class CreateProductTypeUseCase {
  constructor(
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly productTypeRepository: IProductTypeRepository,
  ) {}

  async execute(dto: CreateProductTypeDto) {
    const productType = ProductType.create(dto);
    const created = await this.productTypeRepository.create(productType);
    return ProductTypeMapper.toResponse(created);
  }
}
