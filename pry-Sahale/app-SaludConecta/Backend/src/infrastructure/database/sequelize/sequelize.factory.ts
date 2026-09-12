import { createRequire } from 'node:module';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseDialect } from '../../../config/environment/env.interface.js';
import { getSequelizeOptions } from './sequelize.options.js';
import { PatientModel } from '../../../features/business/patients/infrastructure/persistence/models/patient.model.js';
import { SpecialtyModel } from '../../../features/business/specialties/infrastructure/persistence/models/specialty.model.js';
import { DoctorModel } from '../../../features/business/doctors/infrastructure/persistence/models/doctor.model.js';
import { DoctorSpecialtyModel } from '../../../features/business/doctor-specialties/infrastructure/persistence/models/doctor-specialty.model.js';
import { ServiceModel } from '../../../features/business/services/infrastructure/persistence/models/service.model.js';
import { AgendaModel } from '../../../features/business/agendas/infrastructure/persistence/models/agenda.model.js';
import { AppointmentModel } from '../../../features/business/appointments/infrastructure/persistence/models/appointment.model.js';
import { AuthorizationModel } from '../../../features/business/authorizations/infrastructure/persistence/models/authorization.model.js';


const require = createRequire(import.meta.url);

export const ALL_MODELS = [
    PatientModel,
    SpecialtyModel,
    DoctorModel,
    DoctorSpecialtyModel,
    ServiceModel,
    AgendaModel,
    AppointmentModel,
    AuthorizationModel,
];

export async function createSequelizeInstance(
  dialect: DatabaseDialect,
): Promise<Sequelize> {
  const options = getSequelizeOptions(dialect);

  let dialectModule: any;

  switch (dialect) {
    case DatabaseDialect.MySQL:
      dialectModule = require('mysql2');
      break;
    case DatabaseDialect.Postgres:
      dialectModule = require('pg');
      break;
    case DatabaseDialect.MSSQL:
      dialectModule = require('tedious');
      break;
    case DatabaseDialect.Oracle:
      dialectModule = require('oracledb');
      break;
    default:
      throw new Error(`Dialecto no soportado: ${dialect}`);
  }

  const sequelize = new Sequelize({
    ...options,
    dialectModule,
    models: ALL_MODELS,
  } as any);

  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${dialect.toUpperCase()}`);
  } catch (error: any) {
    console.error(
      `❌ Error conectando a ${dialect.toUpperCase()}:`,
      error.message,
    );
    throw error;
  }

  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: false });
    console.log('✅ Tablas sincronizadas');
  }

  return sequelize;
}
// registrar en el arreglo `models` de la factory:
// import { PatientModel } from '../../../features/business/patients/infrastructure/persistence/models/patient.model.js';
// models: [..., PatientModel]
// import { SpecialtyModel } from '../../../features/business/specialties/infrastructure/persistence/models/specialty.model.js';
// models: [..., SpecialtyModel]
// import { DoctorModel } from '../../../features/business/doctors/infrastructure/persistence/models/doctor.model.js';
// models: [..., DoctorModel]
// import { DoctorSpecialtyModel } from '../../../features/business/doctor-specialties/infrastructure/persistence/models/doctor-specialty.model.js';
// models: [..., DoctorSpecialtyModel]  // requiere que DoctorModel y SpecialtyModel ya estén registrados
// import { ServiceModel } from '../../../features/business/services/infrastructure/persistence/models/service.model.js';
// models: [..., ServiceModel]
// import { AgendaModel } from '../../../features/business/agendas/infrastructure/persistence/models/agenda.model.js';
// models: [..., AgendaModel]  // requiere que DoctorModel ya este registrado
// import { AppointmentModel } from '../../../features/business/appointments/infrastructure/persistence/models/appointment.model.js';
// models: [..., AppointmentModel]  // requiere que PatientModel y AgendaModel ya esten registrados
// import { AuthorizationModel } from '../../../features/business/authorizations/infrastructure/persistence/models/authorization.model.js';
// models: [..., AuthorizationModel]  // requiere que AppointmentModel ya este registrado
