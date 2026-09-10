import { ProductTypeModel } from '../models/product-type.model.js';
import { Status } from '../../../../../../common/enums/status.enum.js';

export async function seedProductTypes(): Promise<void> {
  const count = await ProductTypeModel.count();
  if (count > 0) {
    return;
  }

  await ProductTypeModel.bulkCreate([
    {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      status: Status.ACTIVE,
    },
    {
      name: 'Clothing',
      description: 'Apparel and fashion items',
      status: Status.ACTIVE,
    },
  ]);
}
