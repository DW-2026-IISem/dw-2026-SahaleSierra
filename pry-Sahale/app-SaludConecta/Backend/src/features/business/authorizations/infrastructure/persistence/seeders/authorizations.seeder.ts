import { AuthorizationModel } from '../models/authorization.model.js';
import { AppointmentModel } from '../../../../appointments/infrastructure/persistence/models/appointment.model.js';

export async function seedAuthorizations(): Promise<void> {
  const count = await AuthorizationModel.count();
  if (count > 0) return;

  const appointment = await AppointmentModel.findOne({ order: [['id', 'ASC']] });
  if (!appointment) return;

  await AuthorizationModel.create({
    appointmentId: appointment.id,
    name: 'Autorización EPS Sanitas',
    description: 'Autorización de consulta ambulatoria',
    status: 'ACTIVE',
  });
}
