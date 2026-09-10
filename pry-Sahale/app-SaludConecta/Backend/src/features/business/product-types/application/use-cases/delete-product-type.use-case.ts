import { Inject, Injectable } from '@nestjs/common';
import { ProductTypeNotFoundException } from '../../domain/exceptions/product-type-not-found.exception.js';
import {
  type IProductTypeRepository,
  PRODUCT_TYPE_REPOSITORY,
} from '../../domain/interfaces/product-type-repository.interface.js';

@Injectable()
export class DeleteProductTypeUseCase {
  constructor(
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly productTypeRepository: IProductTypeRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const productType = await this.productTypeRepository.findById(id);
    if (!productType) {
      throw new ProductTypeNotFoundException(id);
    }

    await this.productTypeRepository.delete(id);
  }
}
