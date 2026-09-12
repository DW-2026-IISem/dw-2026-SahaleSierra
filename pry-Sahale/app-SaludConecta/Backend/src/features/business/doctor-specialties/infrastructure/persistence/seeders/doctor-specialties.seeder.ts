import { DoctorSpecialtyModel } from '../models/doctor-specialty.model.js';
import { DoctorModel } from '../../../../doctors/infrastructure/persistence/models/doctor.model.js';
import { SpecialtyModel } from '../../../../specialties/infrastructure/persistence/models/specialty.model.js';

export async function seedDoctorSpecialties(): Promise<void> {
  const count = await DoctorSpecialtyModel.count();
  if (count > 0) return;

  const doctors = await DoctorModel.findAll({ limit: 2, order: [['id', 'ASC']] });
  const specialties = await SpecialtyModel.findAll({ limit: 2, order: [['id', 'ASC']] });

  if (doctors.length < 2 || specialties.length < 2) return;

  await DoctorSpecialtyModel.bulkCreate([
    { doctorId: doctors[0].id, specialtyId: specialties[0].id, status: 'ACTIVE' },
    { doctorId: doctors[1].id, specialtyId: specialties[1].id, status: 'ACTIVE' },
  ]);
}
