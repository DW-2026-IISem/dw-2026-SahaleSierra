import { DoctorSpecialty } from "./doctor-specialty.model";
import { Doctor } from "../doctor/doctor.model";
import { Specialty } from "../specialty/specialty.model";

DoctorSpecialty.belongsTo(Doctor, { foreignKey: "doctor_id", as: "doctor" });
DoctorSpecialty.belongsTo(Specialty, { foreignKey: "specialty_id", as: "specialty" });
Doctor.hasMany(DoctorSpecialty, { foreignKey: "doctor_id", as: "doctor_specialties" });
Specialty.hasMany(DoctorSpecialty, { foreignKey: "specialty_id", as: "doctor_specialties" });
