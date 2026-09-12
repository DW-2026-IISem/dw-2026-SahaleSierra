import { AppointmentModel } from '../models/appointment.model.js';
import { PatientModel } from '../../../../patients/infrastructure/persistence/models/patient.model.js';
import { AgendaModel } from '../../../../agendas/infrastructure/persistence/models/agenda.model.js';

export async function seedAppointments(): Promise<void> {
  const count = await AppointmentModel.count();
  if (count > 0) return;

  const patients = await PatientModel.findAll({ limit: 2, order: [['id', 'ASC']] });
  const agendas = await AgendaModel.findAll({ limit: 2, order: [['id', 'ASC']] });
  if (patients.length < 2 || agendas.length < 2) return;

  await AppointmentModel.bulkCreate([
    {
      patientId: patients[0].id,
      agendaId: agendas[0].id,
      fecha_inicio: new Date('2026-09-15T09:00:00'),
      fecha_fin: new Date('2026-09-15T09:30:00'),
      reason: 'Control anual',
      status: 'PROGRAMADA',
    },
    {
      patientId: patients[1].id,
      agendaId: agendas[1].id,
      fecha_inicio: new Date('2026-09-16T14:00:00'),
      fecha_fin: new Date('2026-09-16T14:30:00'),
      reason: 'Dolor abdominal',
      status: 'PROGRAMADA',
    },
  ]);
}
