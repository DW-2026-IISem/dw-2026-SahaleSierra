import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { ProductType } from '../entities/product-type.entity.js';

export const PRODUCT_TYPE_REPOSITORY = 'PRODUCT_TYPE_REPOSITORY';

export interface ProductTypeFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IProductTypeRepository {
  create(productType: ProductType): Promise<ProductType>;
  update(productType: ProductType): Promise<ProductType>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<ProductType | null>;
  findAll(params: ProductTypeFindAllParams): Promise<PaginatedResult<ProductType>>;
}
