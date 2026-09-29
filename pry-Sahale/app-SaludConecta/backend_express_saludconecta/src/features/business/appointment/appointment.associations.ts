import { Appointment } from "./appointment.model";
import { Agenda } from "../agenda/agenda.model";
import { Patient } from "../patient/patient.model";

Appointment.belongsTo(Agenda, { foreignKey: "agenda_id", as: "agenda" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });
Agenda.hasMany(Appointment, { foreignKey: "agenda_id", as: "appointments" });
Patient.hasMany(Appointment, { foreignKey: "patient_id", as: "appointments" });
