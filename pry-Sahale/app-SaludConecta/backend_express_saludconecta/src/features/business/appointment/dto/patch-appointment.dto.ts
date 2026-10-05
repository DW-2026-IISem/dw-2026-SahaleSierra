import { UpdateAppointmentDto } from "./update-appointment.dto";

/** Datos de entrada de `PATCH /api/appointments/:id` (actualización parcial). */
export type PatchAppointmentDto = Partial<UpdateAppointmentDto>;
