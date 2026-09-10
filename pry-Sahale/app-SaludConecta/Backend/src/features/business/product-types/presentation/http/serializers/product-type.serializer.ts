import { ProductType } from '../../../domain/entities/product-type.entity.js';
import { ProductTypeResponseDto } from '../../../application/dto/product-type-response.dto.js';
import { ProductTypeMapper } from '../../../application/mappers/product-type.mapper.js';

export class ProductTypeSerializer {
  static serialize(entity: ProductType): ProductTypeResponseDto {
    return ProductTypeMapper.toResponse(entity);
  }
}
