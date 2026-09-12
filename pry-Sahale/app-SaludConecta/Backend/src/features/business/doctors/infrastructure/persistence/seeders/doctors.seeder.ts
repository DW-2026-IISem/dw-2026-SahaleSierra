import { DoctorModel } from '../models/doctor.model.js';

export async function seedDoctors(): Promise<void> {
  const count = await DoctorModel.count();
  if (count > 0) return;

  await DoctorModel.bulkCreate([
    { name: 'Dr. Andrés Salazar', description: 'Medicina general', status: 'ACTIVE' },
    { name: 'Dra. Marcela Duarte', description: 'Pediatría', status: 'ACTIVE' },
  ]);
}
