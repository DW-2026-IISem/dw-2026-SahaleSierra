import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Product } from '../../../domain/entities/product.entity.js';
import {
  IProductRepository,
  ProductFindAllParams,
} from '../../../domain/interfaces/product-repository.interface.js';
import { ProductMapper } from '../../../application/mappers/product.mapper.js';
import { ProductModel } from '../models/product.model.js';

@Injectable()
export class ProductRepository implements IProductRepository {
  async create(product: Product): Promise<Product> {
    const model = await ProductModel.create(ProductMapper.toPersistence(product));
    return ProductMapper.toDomain(model);
  }

  async update(product: Product): Promise<Product> {
    await ProductModel.update(ProductMapper.toPersistence(product), {
      where: { id: product.id },
    });
    const updated = await ProductModel.findByPk(product.id!);
    return ProductMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ProductModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Product | null> {
    const model = await ProductModel.findByPk(id);
    return model ? ProductMapper.toDomain(model) : null;
  }

  async findAll(params: ProductFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: WhereOptions = {};

    if (params.search) {
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.like]: `%${params.search}%` } },
          { brand: { [Op.like]: `%${params.search}%` } },
        ],
      });
    }

    if (params.productTypeId) {
      where.productTypeId = params.productTypeId;
    }

    const { rows, count } = await ProductModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ProductMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
