import { Invoice } from "./invoice.model";
import { Encounter } from "../encounter/encounter.model";

Encounter.belongsTo(Invoice, { foreignKey: "invoice_id", as: "invoice" });
Invoice.hasMany(Encounter, { foreignKey: "invoice_id", as: "encounters" });
