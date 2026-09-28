import { PatientRoutes } from "../features/business/patient/patient.routes";
import { SpecialtyRoutes } from "../features/business/specialty/specialty.routes";

export class Routes {
  public patientRoutes: PatientRoutes = new PatientRoutes();
  public specialtyRoutes: SpecialtyRoutes = new SpecialtyRoutes();
}
