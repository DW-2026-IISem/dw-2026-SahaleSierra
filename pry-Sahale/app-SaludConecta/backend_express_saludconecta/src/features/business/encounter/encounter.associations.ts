import { Encounter } from "./encounter.model";
import { Appointment } from "../appointment/appointment.model";
import { ClinicalRecord } from "../clinical-record/clinical-record.model";
import { Service } from "../service/service.model";

Encounter.belongsTo(Appointment, { foreignKey: "appointment_id", as: "appointment" });
Encounter.belongsTo(ClinicalRecord, { foreignKey: "clinical_record_id", as: "clinical_record" });
Encounter.belongsTo(Service, { foreignKey: "service_id", as: "service" });
Appointment.hasOne(Encounter, { foreignKey: "appointment_id", as: "encounter" });
ClinicalRecord.hasMany(Encounter, { foreignKey: "clinical_record_id", as: "encounters" });
Service.hasMany(Encounter, { foreignKey: "service_id", as: "encounters" });
