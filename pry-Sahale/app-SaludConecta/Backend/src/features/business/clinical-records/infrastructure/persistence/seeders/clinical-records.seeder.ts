import { ClinicalRecordModel } from '../models/clinical-record.model.js';
import { PatientModel } from '../../../../patients/infrastructure/persistence/models/patient.model.js';

export async function seedClinicalRecords(): Promise<void> {
  const count = await ClinicalRecordModel.count();
  if (count > 0) return;

  const patients = await PatientModel.findAll({ order: [['id', 'ASC']] });
  if (patients.length === 0) return;

  await ClinicalRecordModel.bulkCreate(
    patients.map((patient) => ({
      patientId: patient.id,
      name: `Historia clínica de ${patient.name}`,
      description: 'Historia clínica inicial',
      status: 'ACTIVE',
    })),
  );
}
