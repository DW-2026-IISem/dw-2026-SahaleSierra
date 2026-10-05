import { PatientRoutes } from "../features/business/patient/patient.routes";
import { SpecialtyRoutes } from "../features/business/specialty/specialty.routes";
import { DoctorRoutes } from "../features/business/doctor/doctor.routes";
import { DoctorSpecialtyRoutes } from "../features/business/doctor-specialty/doctor-specialty.routes";
import { ServiceRoutes } from "../features/business/service/service.routes";
import { AgendaRoutes } from "../features/business/agenda/agenda.routes";
import { AppointmentRoutes } from "../features/business/appointment/appointment.routes";
import { ClinicalRecordRoutes } from "../features/business/clinical-record/clinical-record.routes";
import { AuthorizationRoutes } from "../features/business/authorization/authorization.routes";
import { EncounterRoutes } from "../features/business/encounter/encounter.routes";
import { InvoiceRoutes } from "../features/business/invoice/invoice.routes";
import { UsersRoutes } from "../features/auth/users/users.routes";



export class Routes {
  public patientRoutes: PatientRoutes = new PatientRoutes();
  public specialtyRoutes: SpecialtyRoutes = new SpecialtyRoutes();
  public doctorRoutes: DoctorRoutes = new DoctorRoutes();
  public doctorSpecialtyRoutes: DoctorSpecialtyRoutes = new DoctorSpecialtyRoutes();
  public serviceRoutes: ServiceRoutes = new ServiceRoutes();
  public agendaRoutes: AgendaRoutes = new AgendaRoutes();
  public appointmentRoutes: AppointmentRoutes = new AppointmentRoutes();
  public clinicalRecordRoutes: ClinicalRecordRoutes = new ClinicalRecordRoutes();
  public authorizationRoutes: AuthorizationRoutes = new AuthorizationRoutes();
  public encounterRoutes: EncounterRoutes = new EncounterRoutes();
  public invoiceRoutes: InvoiceRoutes = new InvoiceRoutes();
  // Fase II — Auth con RBAC
  public usersRoutes: UsersRoutes = new UsersRoutes();


}
