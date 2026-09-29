import { PatientRoutes } from "../features/business/patient/patient.routes";
import { SpecialtyRoutes } from "../features/business/specialty/specialty.routes";
import { DoctorRoutes } from "../features/business/doctor/doctor.routes";
import { DoctorSpecialtyRoutes } from "../features/business/doctor-specialty/doctor-specialty.routes";
import { ServiceRoutes } from "../features/business/service/service.routes";
import { AgendaRoutes } from "../features/business/agenda/agenda.routes";
import { AppointmentRoutes } from "../features/business/appointment/appointment.routes";


export class Routes {
  public patientRoutes: PatientRoutes = new PatientRoutes();
  public specialtyRoutes: SpecialtyRoutes = new SpecialtyRoutes();
  public doctorRoutes: DoctorRoutes = new DoctorRoutes();
  public doctorSpecialtyRoutes: DoctorSpecialtyRoutes = new DoctorSpecialtyRoutes();
  public serviceRoutes: ServiceRoutes = new ServiceRoutes();
  public agendaRoutes: AgendaRoutes = new AgendaRoutes();
  public appointmentRoutes: AppointmentRoutes = new AppointmentRoutes();

}
