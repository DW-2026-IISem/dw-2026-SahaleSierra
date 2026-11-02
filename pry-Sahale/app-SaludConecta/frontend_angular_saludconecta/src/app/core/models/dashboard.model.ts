import { Appointment } from './appointment.model';
import { Encounter } from './encounter.model';

/** Se arma en el frontend con peticiones en paralelo (ISS-14). */
export interface DashboardStats {
  patients: number; // pacientes activos
  scheduledAppointments: number; // citas en state = 'scheduled'
  unbilledEncounters: number; // atenciones completed sin factura
  revenue: number; // suma de invoices.total no cancelados
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingAppointments: Appointment[];
  unbilledEncounters: Encounter[];
}
