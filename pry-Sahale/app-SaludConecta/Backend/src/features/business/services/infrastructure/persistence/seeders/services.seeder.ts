import { ServiceModel } from '../models/service.model.js';

export async function seedServices(): Promise<void> {
  const count = await ServiceModel.count();
  if (count > 0) return;

  await ServiceModel.bulkCreate([
    { name: 'Consulta general', description: 'Valoración médica ambulatoria', status: 'ACTIVE' },
    { name: 'Control pediátrico', description: 'Seguimiento de crecimiento y desarrollo', status: 'ACTIVE' },
  ]);
}
