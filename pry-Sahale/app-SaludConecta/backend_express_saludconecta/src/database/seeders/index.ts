import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/patient/patient.model";
import "../../features/business/specialty/specialty.model";
import "../../features/business/doctor/doctor.model";
import "../../features/business/doctor-specialty/doctor-specialty.model";
import "../../features/business/service/service.model";
import "../../features/business/agenda/agenda.model";
import "../../features/business/doctor-specialty/doctor-specialty.associations";
import "../../features/business/agenda/agenda.associations";
import { seedPatients } from "../../features/business/patient/patient.seeder";
import { seedSpecialties } from "../../features/business/specialty/specialty.seeder";
import { seedDoctors } from "../../features/business/doctor/doctor.seeder";
import { seedDoctorSpecialties } from "../../features/business/doctor-specialty/doctor-specialty.seeder";
import { seedServices } from "../../features/business/service/service.seeder";
import { seedAgendas } from "../../features/business/agenda/agenda.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta TODOS los seeders de features.
 *
 * Ubicación: `src/database/seeders/` (orquestación fuera de cada feature).
 * Cada feature exporta su seeder (ej. `features/business/patient/patient.seeder.ts`).
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --patients=20
 *   SEED_PATIENTS=5 npm run db:seed
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

   const isMysql =
    sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";
  if (isMysql) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  }
  try {
    await sequelize.sync({ force: false, alter: true });
  } finally {
    if (isMysql) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }

  // Orden: business (padres → hijos)
  await seedPatients(counts.patients);
  await seedSpecialties(counts.specialties);
  await seedDoctors(counts.doctors);
  await seedDoctorSpecialties(counts.doctor_specialties);
  await seedServices(counts.services);
  await seedAgendas(counts.agendas);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
