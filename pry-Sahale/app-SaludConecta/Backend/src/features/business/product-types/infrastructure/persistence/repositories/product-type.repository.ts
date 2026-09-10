import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { ProductType } from '../../../domain/entities/product-type.entity.js';
import {
  IProductTypeRepository,
  ProductTypeFindAllParams,
} from '../../../domain/interfaces/product-type-repository.interface.js';
import { ProductTypeMapper } from '../../../application/mappers/product-type.mapper.js';
import { ProductTypeModel } from '../models/product-type.model.js';

@Injectable()
export class ProductTypeRepository implements IProductTypeRepository {
  async create(productType: ProductType): Promise<ProductType> {
    const model = await ProductTypeModel.create(
      ProductTypeMapper.toPersistence(productType),
    );
    return ProductTypeMapper.toDomain(model);
  }

  async update(productType: ProductType): Promise<ProductType> {
    await ProductTypeModel.update(
      ProductTypeMapper.toPersistence(productType),
      { where: { id: productType.id } },
    );
    const updated = await ProductTypeModel.findByPk(productType.id!);
    return ProductTypeMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ProductTypeModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<ProductType | null> {
    const model = await ProductTypeModel.findByPk(id);
    return model ? ProductTypeMapper.toDomain(model) : null;
  }

  async findAll(params: ProductTypeFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where = params.search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${params.search}%` } },
            { description: { [Op.like]: `%${params.search}%` } },
          ],
        }
      : {};

    const { rows, count } = await ProductTypeModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ProductTypeMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
