import { PatientModel } from '../models/patient.model.js';

export async function seedPatients(): Promise<void> {
  const count = await PatientModel.count();
  if (count > 0) return;

  await PatientModel.bulkCreate([
    {
      documentType: 'CC',
      documentNumber: '1001001001',
      name: 'Laura Gómez',
      birthDate: '1990-05-12',
      contact: 'laura.gomez@example.com',
      status: 'ACTIVE',
    },
    {
      documentType: 'CC',
      documentNumber: '1002002002',
      name: 'Carlos Pérez',
      birthDate: '1985-11-03',
      contact: '+57 300 111 2222',
      status: 'ACTIVE',
    },
  ]);
}
