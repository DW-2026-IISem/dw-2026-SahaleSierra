import { Authorization } from "./authorization.model";
import { Appointment } from "../appointment/appointment.model";

Authorization.belongsTo(Appointment, { foreignKey: "appointment_id", as: "appointment" });
Appointment.hasOne(Authorization, { foreignKey: "appointment_id", as: "authorization" });
