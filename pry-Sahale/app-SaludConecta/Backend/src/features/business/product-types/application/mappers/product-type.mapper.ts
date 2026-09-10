import { Status } from '../../../../../common/enums/status.enum.js';
import { ProductType } from '../../domain/entities/product-type.entity.js';
import { ProductTypeResponseDto } from '../dto/product-type-response.dto.js';
import { ProductTypeModel } from '../../infrastructure/persistence/models/product-type.model.js';

export class ProductTypeMapper {
  static toDomain(model: ProductTypeModel): ProductType {
    return ProductType.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: ProductType): ProductTypeResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: ProductType): Partial<ProductTypeModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      status: entity.status ?? Status.ACTIVE,
    };
  }
}
