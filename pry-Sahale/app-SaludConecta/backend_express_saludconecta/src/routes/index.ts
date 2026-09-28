import { PatientRoutes } from "../features/business/patient/patient.routes";
import { SpecialtyRoutes } from "../features/business/specialty/specialty.routes";
import { DoctorRoutes } from "../features/business/doctor/doctor.routes";

export class Routes {
  public patientRoutes: PatientRoutes = new PatientRoutes();
  public specialtyRoutes: SpecialtyRoutes = new SpecialtyRoutes();
  public doctorRoutes: DoctorRoutes = new DoctorRoutes();
}
