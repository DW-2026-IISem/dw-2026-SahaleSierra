import { EncounterModel } from '../models/encounter.model.js';
import { AppointmentModel } from '../../../../appointments/infrastructure/persistence/models/appointment.model.js';
import { ServiceModel } from '../../../../services/infrastructure/persistence/models/service.model.js';
import { ClinicalRecordModel } from '../../../../clinical-records/infrastructure/persistence/models/clinical-record.model.js';

export async function seedEncounters(): Promise<void> {
  const count = await EncounterModel.count();
  if (count > 0) return;

  const appointment = await AppointmentModel.findOne({ order: [['id', 'ASC']] });
  const service = await ServiceModel.findOne({ order: [['id', 'ASC']] });
  const clinicalRecord = await ClinicalRecordModel.findOne({
    where: { patientId: appointment?.patientId },
  });

  if (!appointment || !service || !clinicalRecord) return;

  await EncounterModel.create({
    appointmentId: appointment.id,
    serviceId: service.id,
    clinicalRecordId: clinicalRecord.id,
    fecha_inicio: appointment.startDate,
    fecha_fin: appointment.endDate,
    total: 80000,
    observations: 'Paciente estable, sin hallazgos relevantes',
    status: 'REGISTRADA',
  });
}
