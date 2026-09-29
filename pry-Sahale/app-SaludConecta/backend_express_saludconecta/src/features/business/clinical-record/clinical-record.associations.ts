import { ClinicalRecord } from "./clinical-record.model";
import { Patient } from "../patient/patient.model";

ClinicalRecord.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });
Patient.hasOne(ClinicalRecord, { foreignKey: "patient_id", as: "clinical_record" });
