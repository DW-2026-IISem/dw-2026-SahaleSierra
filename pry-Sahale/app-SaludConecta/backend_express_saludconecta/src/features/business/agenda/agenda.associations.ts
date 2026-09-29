import { Agenda } from "./agenda.model";
import { Doctor } from "../doctor/doctor.model";

Agenda.belongsTo(Doctor, { foreignKey: "doctor_id", as: "doctor" });
Doctor.hasMany(Agenda, { foreignKey: "doctor_id", as: "agendas" });
