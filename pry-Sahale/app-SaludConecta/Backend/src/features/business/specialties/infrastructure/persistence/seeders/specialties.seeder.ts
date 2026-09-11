import { SpecialtyModel } from '../models/specialty.model.js';

export async function seedSpecialties(): Promise<void> {
  const count = await SpecialtyModel.count();
  if (count > 0) return;

  await SpecialtyModel.bulkCreate([
    { name: 'Medicina General', description: 'Consulta ambulatoria general', status: 'ACTIVE' },
    { name: 'Pediatría', description: 'Atención de pacientes menores de edad', status: 'ACTIVE' },
    { name: 'Ginecología', description: 'Salud sexual y reproductiva femenina', status: 'ACTIVE' },
  ]);
}
