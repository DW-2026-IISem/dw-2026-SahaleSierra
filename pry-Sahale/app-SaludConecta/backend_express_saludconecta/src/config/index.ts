import dotenv from "dotenv";
import express, { Application, ErrorRequestHandler } from "express";
import morgan from "morgan";
var cors = require("cors");
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/patient/patient.model";
import "../features/business/specialty/specialty.model";
import "../features/business/doctor/doctor.model";
import "../features/business/doctor-specialty/doctor-specialty.model";
import "../features/business/service/service.model";
import "../features/business/agenda/agenda.model";
import "../features/business/appointment/appointment.model";
import "../features/business/clinical-record/clinical-record.model";
import "../features/business/authorization/authorization.model";
import "../features/business/encounter/encounter.model";
import "../features/business/invoice/invoice.model";
import "../features/business/doctor-specialty/doctor-specialty.associations";
import "../features/business/agenda/agenda.associations";
import "../features/business/appointment/appointment.associations";
import "../features/business/clinical-record/clinical-record.associations";
import "../features/business/authorization/authorization.associations";
import "../features/business/encounter/encounter.associations";
import "../features/business/invoice/invoice.associations";
// Fase II — Auth con RBAC: primero los seis modelos, después las asociaciones
// (las asociaciones referencian los modelos, no al revés).
import "../features/auth/users/user.model";
import "../features/auth/roles/role.model";
import "../features/auth/resources/resource.model";
import "../features/auth/role-users/role-user.model";
import "../features/auth/resource-roles/resource-role.model";
import "../features/auth/refresh-tokens/refresh-token.model";
import "../features/auth/rbac.associations";
import { Routes } from "../routes/index";
import { setupSwagger } from "../swagger/index";

dotenv.config();

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.docs();
    this.errorHandling();
  }


  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.routePrv.patientRoutes.routes(this.app);
    this.routePrv.specialtyRoutes.routes(this.app);
    this.routePrv.doctorRoutes.routes(this.app);
    this.routePrv.doctorSpecialtyRoutes.routes(this.app);
    this.routePrv.serviceRoutes.routes(this.app);
    this.routePrv.agendaRoutes.routes(this.app);
    this.routePrv.appointmentRoutes.routes(this.app);
    this.routePrv.clinicalRecordRoutes.routes(this.app);
    this.routePrv.authorizationRoutes.routes(this.app);
    this.routePrv.encounterRoutes.routes(this.app);
    this.routePrv.invoiceRoutes.routes(this.app);
    // Fase II — Auth con RBAC
    this.routePrv.refreshTokensRoutes.routes(this.app);
    this.routePrv.usersRoutes.routes(this.app);
    this.routePrv.rolesRoutes.routes(this.app);
    this.routePrv.resourcesRoutes.routes(this.app);
    this.routePrv.roleUsersRoutes.routes(this.app);
    this.routePrv.resourceRolesRoutes.routes(this.app);

  }
  
  private docs(): void {
    setupSwagger(this.app);
  }
  
  /**
   * Errores que ocurren **antes** de llegar a un controller o middleware.
   *
   * El caso típico es un cuerpo JSON malformado: `express.json()` lanza un
   * `SyntaxError` que, sin manejador, cae en el de Express por defecto y responde
   * 400 con un HTML que incluye el **stack trace y rutas absolutas del servidor**
   * (fuga de información). Aquí se traduce a un 400 JSON limpio.
   *
   * Debe registrarse **después** de las rutas: Express reconoce un middleware de
   * error por su aridad de 4 argumentos.
   */
  private errorHandling(): void {
    const bodyErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
      if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({ error: "Malformed JSON body" });
        return;
      }
      next(err);
    };
    this.app.use(bodyErrorHandler);
  }


  private async dbConnection(): Promise<void> {
      try {
      // Mostrar información de la base de datos seleccionada
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      // Probar la conexión
      const isConnected = await testConnection();

      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // Lab: sync crea/altera tablas desde los modelos (BD limpia → snake_case desde cero).
      const force = process.env.DB_SYNC_FORCE === "true";
      const isMysql =
        sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";

      if (isMysql) {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      }
      try {
        await sequelize.sync({ force, alter: !force });
      } finally {
        if (isMysql) {
          await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
        }
      }

      console.log(
        force
          ? "📦 Base de datos recreada (DB_SYNC_FORCE=true)"
          : "📦 Base de datos sincronizada exitosamente"
      );
      
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1); // Terminar la aplicación si no se puede conectar
    }
  }

    async listen() {
    // Orden de arranque: primero la BD (conexión + `sync`), después abrir el puerto.
    // Si se abre el puerto antes de terminar `sync({ alter: true })`, las sentencias
    // DDL (ALTER TABLE, DROP/ADD FOREIGN KEY) compiten con las peticiones que ya
    // están entrando y provocan deadlocks y errores de FK intermitentes.
    await this.dbConnection();
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
