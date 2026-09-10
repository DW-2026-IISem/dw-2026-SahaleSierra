import { Inject, Injectable } from '@nestjs/common';
import { ProductTypeNotFoundException } from '../../domain/exceptions/product-type-not-found.exception.js';
import {
  type IProductTypeRepository,
  PRODUCT_TYPE_REPOSITORY,
} from '../../domain/interfaces/product-type-repository.interface.js';
import { UpdateProductTypeDto } from '../dto/update-product-type.dto.js';
import { ProductTypeMapper } from '../mappers/product-type.mapper.js';

@Injectable()
export class UpdateProductTypeUseCase {
  constructor(
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly productTypeRepository: IProductTypeRepository,
  ) {}

  async execute(id: number, dto: UpdateProductTypeDto) {
    const productType = await this.productTypeRepository.findById(id);
    if (!productType) {
      throw new ProductTypeNotFoundException(id);
    }

    productType.update(dto);
    const updated = await this.productTypeRepository.update(productType);
    return ProductTypeMapper.toResponse(updated);
  }
}
