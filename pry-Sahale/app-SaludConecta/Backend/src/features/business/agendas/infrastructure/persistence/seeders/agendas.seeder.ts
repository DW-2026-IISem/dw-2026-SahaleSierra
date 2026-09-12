import { AgendaModel } from '../models/agenda.model.js';
import { DoctorModel } from '../../../../doctors/infrastructure/persistence/models/doctor.model.js';

export async function seedAgendas(): Promise<void> {
  const count = await AgendaModel.count();
  if (count > 0) return;

  const doctors = await DoctorModel.findAll({ limit: 2, order: [['id', 'ASC']] });
  if (doctors.length < 2) return;

  await AgendaModel.bulkCreate([
    { doctorId: doctors[0].id, name: 'Agenda mañana', description: 'Lunes a viernes 8am-12pm', status: 'ACTIVE' },
    { doctorId: doctors[1].id, name: 'Agenda tarde', description: 'Lunes a viernes 2pm-6pm', status: 'ACTIVE' },
  ]);
}
