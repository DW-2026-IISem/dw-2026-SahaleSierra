## ISS-00 — Requisitos previos

#### Verificación:

![](images/clipboard-1097815385.png)

## ISS-01 — Esqueleto del proyecto

#### 2.1 Inicializar npm y scripts

![](images/clipboard-905064641.png)

**PARCHE** — `package.json` (ya existe, lo creó `npm init -y`). Edita manualmente para que las claves `"scripts"` y `"type"` queden así:

![](images/clipboard-2079921563.png)

#### 2.2 Estructura de carpetas (features)

![](images/clipboard-950237106.png)

#### 2.3 Dependencias base (Express + TypeScript)

![](images/clipboard-936295519.png)

#### 2.4 TypeScript (`tsconfig.json`)

![](images/clipboard-4029053261.png)

#### 2.5.1 `src/server.ts`

![](images/clipboard-2486515114.png)

#### 2.5.2 `src/config/index.ts` (esqueleto)

Esqueleto. Los imports de modelos, associations, Routes y Swagger llegan por PARCHE en ISS-02...08.

![](images/clipboard-3496709489.png)

#### Verificación del ISS-01

![](images/clipboard-3476522285.png)

#### Cierre del ISS

![](images/clipboard-2181427957.png)

## ISS-02 — Infraestructura de base de datos

##### **Bloqueado por:** ISS-01.

#### 3.1 Drivers Sequelize y `.env`

![](images/clipboard-1870759706.png)

![![](images/clipboard-1184211016.png)](images/clipboard-171196581.png)

#### 3.2 Configuración Sequelize (`src/database/db.ts`)

![](images/clipboard-4205252378.png)

``` bash
test -f src/database/db.ts && npx tsc --noEmit
```

#### 3.3 Carpeta seeders (reservada)

![](images/clipboard-3663606755.png)

#### Verificación del ISS-02

``` bash
npx tsc --noEmit
test -f src/database/db.ts && test -f .env && test -d src/database/seeders
```

#### Cierre del ISS

![](images/clipboard-448257243.png)

## 4. ISS-03-A — Feature Patient: fundación (modelo, esqueleto, HTTP, cableado)

**Objetivo:** dejar el feature Patient listo para CRUD. Incluye el modelo, el esqueleto de controller y routes, la carpeta `http/`, el agregador de rutas y el sync.\

**Bloqueado por:** ISS-02.\

**Patrón del manual:** Client (§4.1–4.3).

### 4.1 Modelo Patient

**Archivo:** `src/features/business/patient/patient.model.ts`

![](images/clipboard-1787450583.png)

### 4.2 Esqueleto controller / routes + carpeta HTTP

#### 4.2.a Carpeta `http/`

``` bash
mkdir -p src/features/business/patient/http
```

#### 4.2.b `patient.controller.ts` (esqueleto)

![](images/clipboard-498527218.png)

#### 4.2.c `patient.routes.ts` (esqueleto)

![](images/clipboard-1382124680.png)

### 4.3 Agregador Routes + cableado en Config

#### 4.3.a `src/routes/index.ts` (archivo nuevo)

![](images/clipboard-2850061102.png)

#### 4.3.b PARCHE — `src/config/index.ts` (ya existe desde ISS-01)

#### 1. Debajo de `var cors = require("cors");`, añadir:

``` typescript
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/patient/patient.model";
import { Routes } from "../routes/index";
```

![](images/clipboard-946115674.png)

**2. Dentro de** `export class App`, **debajo de** `public app: Application;`, **añadir:**

``` typescript
  public routePrv: Routes = new Routes();
```

![](images/clipboard-3912853981.png)

**3. Dentro de** `routes()`, **reemplazar** la línea `// ISS-03 §4.3` por:

``` typescript
  this.routePrv.patientRoutes.routes(this.app);
```

![](images/clipboard-1817969709.png)

**4. Dentro de** `dbConnection()`, **reemplazar** la línea `// ISS-02 / ISS-03` por:

``` typescript
    try {
      // Mostrar información de la base de datos seleccionada
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      // Probar la conexión
      const isConnected = await testConnection();

      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // alter: true actualiza columnas faltantes (ej. createdAt/updatedAt tras timestamps: true).
      // force: false no recrea tablas; no borra datos. En producción preferir migraciones.
      await sequelize.sync({ force: false, alter: true });
      console.log(`📦 Base de datos sincronizada exitosamente`);
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1); // Terminar la aplicación si no se puede conectar
    }
```

![](images/clipboard-2192111545.png)

#### Estado esperado del archivo tras el PARCHE, para comparar:

![](images/clipboard-754351147.png)

#### Verificación ISS-03-A

![](images/clipboard-1428577850.png)

#### Cierre del ISS

![](images/clipboard-2682909370.png)

## 5. ISS-03-B — Feature Patient: GetAll y GetOne

**Objetivo:** listar los pacientes activos y obtener uno por id.\
**Bloqueado por:** ISS-03-A.\
**Patrón del manual:** §5 (Client getAll / getOne).

#### Criterios de aceptación (ISS-03-B)

- Controller: `getAll` (solo `status: 'active'`) y, debajo, `getOne`

- Rutas `GET /api/patients` y `GET /api/patients/:id`, **sin auth**

- `http/patients.get.http` con la leyenda **SIN AUTH**

### 5.1 PARCHE — `patient.controller.ts` (ya existe)

**Reemplazar** la línea:

``` typescript
  // (rellenar en ISS-03-B) getAll, luego getOne
```

que está **debajo de** `// ================== READ ==================` y **encima de** `// ================== CREATE ==================`, por:

``` typescript
  public async getAll(req: Request, res: Response) {
    try {
      const patients = await Patient.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ patients });
    } catch (error) {
      res.status(500).json({ error: "Error fetching patients", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      res.status(200).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error fetching patient", detail: String(error) });
    }
  }
```

![](images/clipboard-3363550502.png)

### 5.2 PARCHE — `patient.routes.ts` (ya existe)

**Reemplazar** la línea:

``` typescript
    // (rellenar en ISS-03-B…E)
```

que está **debajo de** `// ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================`, por:

``` typescript

    // getAll
    app
      .route("/api/patients")
      .get(this.patientController.getAll.bind(this.patientController));

    // getOne
    app
      .route("/api/patients/:id")
      .get(this.patientController.getOne.bind(this.patientController));
```

![](images/clipboard-40898889.png)

### 5.3 HTTP — `patients.get.http` (archivo nuevo)

![](images/clipboard-4020349463.png)

#### Verificación ISS-03-B

``` bash
npx tsc --noEmit
```

#### Cierre del ISS

![](images/clipboard-1939501548.png)

## 6. ISS-03-C — Feature Patient: Crear paciente

**Objetivo:** dar de alta pacientes vía API, después de getAll y getOne.\
**Bloqueado por:** ISS-03-B.

### 6.1 PARCHE — `patient.controller.ts`

**Reemplazar** la línea:

``` typescript
  // (rellenar en ISS-03-C)
```

que está **debajo de** `// ================== CREATE ==================` y **encima de** `// ================== UPDATE ==================`, por:

``` typescript
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PatientI;
      const patient = await Patient.create({
        document_type: body.document_type,
        document_number: body.document_number,
        name: body.name,
        birth_date: body.birth_date,
        contact: body.contact,
        status: body.status ?? "active",
      });
      res.status(201).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error creating patient", detail: String(error) });
    }
  }
```

![](images/clipboard-3323343671.png)

### 6.2 PARCHE — `patient.routes.ts`

**Debajo de** el bloque `// getOne` (después de su `.get(...getOne...)`), **añadir:**

``` typescript

    // create
    app
      .route("/api/patients")
      .post(this.patientController.create.bind(this.patientController));
```

![](images/clipboard-2668392503.png)

### 6.3 HTTP — `patients.create.http` (archivo nuevo)

![](images/clipboard-1043081121.png)

#### Verificación ISS-03-C

``` bash
npx tsc --noEmit
```

Con `npm run dev` corriendo, en la segunda terminal:

``` bash
curl -s -X POST http://localhost:4000/api/patients \
  -H 'Content-Type: application/json' \
  -d '{"document_type":"CC","document_number":"1009999999","name":"Ana","birth_date":"1992-03-15","contact":"3001","status":"active"}'
```

![](images/clipboard-2702754715.png)

Debe responder `201` con `{"patient":{...}}`. Si repites el mismo `document_number`, responde `500` con `SequelizeUniqueConstraintError` en `detail`. Eso confirma que el `UNIQUE` funciona (el manual no hace un manejo especial de ese error).

#### Cierre del ISS

![](images/clipboard-1975044642.png)

## 7. ISS-03-D — Feature Patient: Update (PUT) y Update (PATCH)

**Objetivo:** actualización completa y parcial.\
**Bloqueado por:** ISS-03-C.

### 7.1 PARCHE — `patient.controller.ts`

**Reemplazar** la línea:

``` typescript
  // (rellenar en ISS-03-D)
```

que está **debajo de** `// ================== UPDATE ==================` y **encima de** `// ================== DELETE ==================`, por:

``` typescript
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PatientI;
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }

      await patient.update({
        document_type: body.document_type,
        document_number: body.document_number,
        name: body.name,
        birth_date: body.birth_date,
        contact: body.contact,
        status: body.status ?? patient.status,
      });

      res.status(200).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error updating patient (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PatientI>;
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }

      await patient.update(body);
      res.status(200).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error updating patient (PATCH)", detail: String(error) });
    }
  }
```

![](images/clipboard-12650692.png)

### 7.2 PARCHE — `patient.routes.ts`

**Debajo de** el bloque `// create`, **añadir:**

``` typescript

    // update (PUT / PATCH)
    app
      .route("/api/patients/:id")
      .put(this.patientController.updatePut.bind(this.patientController))
      .patch(this.patientController.updatePatch.bind(this.patientController));
```

![](images/clipboard-2253749818.png)

### 7.3 HTTP — `patients.update.http` (archivo nuevo)

![](images/clipboard-3784882951.png)

#### Verificación ISS-03-D

``` bash
npx tsc --noEmit
```

Con el servidor corriendo:

``` bash
curl -s -X PUT http://localhost:4000/api/patients/1 -H 'Content-Type: application/json' \
  -d '{"document_type":"CC","document_number":"1000000001","name":"Paciente Editado","birth_date":"1990-05-10","contact":"300","status":"active"}'
curl -s -X PATCH http://localhost:4000/api/patients/1 -H 'Content-Type: application/json' \
  -d '{"contact":"301"}'
```

![](images/clipboard-2751318739.png)

#### Cierre del ISS

![](images/clipboard-4025998821.png)

## 8. ISS-03-E — Feature Patient: Eliminar (físico y lógico)

**Objetivo:** borrado físico (`DELETE`) y lógico (`status = 'inactive'`).\
**Bloqueado por:** ISS-03-D.

### 8.1 PARCHE — `patient.controller.ts`

**Reemplazar** la línea:

``` typescript
  // (rellenar en ISS-03-E)
```

que está **debajo de** `// ================== DELETE ==================`, por:

``` typescript
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      await patient.destroy();
      res.status(200).json({ message: "Patient permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting patient", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      await patient.update({ status: "inactive" });
      res.status(200).json({ message: "Patient deactivated (logical delete)", patient });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating patient", detail: String(error) });
    }
  }
```

![](images/clipboard-4069456980.png)

### 8.2 PARCHE — `patient.routes.ts`

**Debajo de** el bloque `// update (PUT / PATCH)`, **añadir:**

``` typescript

    // delete físico
    app
      .route("/api/patients/:id")
      .delete(this.patientController.deletePhysical.bind(this.patientController));

    // delete lógico
    app
      .route("/api/patients/:id/deactivate")
      .patch(this.patientController.deleteLogical.bind(this.patientController));
```

![](images/clipboard-1511939929.png)

### 8.3 HTTP — `patients.delete.http` (archivo nuevo)

![](images/clipboard-2404679656.png)

#### 8.4 Estado final consolidado — `patient.controller.ts`

``` bash
: > src/features/business/patient/patient.controller.ts
cat >> src/features/business/patient/patient.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Patient, PatientI } from "./patient.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PatientController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const patients = await Patient.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ patients });
    } catch (error) {
      res.status(500).json({ error: "Error fetching patients", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      res.status(200).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error fetching patient", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PatientI;
      const patient = await Patient.create({
        document_type: body.document_type,
        document_number: body.document_number,
        name: body.name,
        birth_date: body.birth_date,
        contact: body.contact,
        status: body.status ?? "active",
      });
      res.status(201).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error creating patient", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PatientI;
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }

      await patient.update({
        document_type: body.document_type,
        document_number: body.document_number,
        name: body.name,
        birth_date: body.birth_date,
        contact: body.contact,
        status: body.status ?? patient.status,
      });

      res.status(200).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error updating patient (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PatientI>;
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }

      await patient.update(body);
      res.status(200).json({ patient });
    } catch (error) {
      res.status(500).json({ error: "Error updating patient (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      await patient.destroy();
      res.status(200).json({ message: "Patient permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting patient", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const patient = await Patient.findByPk(id);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      await patient.update({ status: "inactive" });
      res.status(200).json({ message: "Patient deactivated (logical delete)", patient });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating patient", detail: String(error) });
    }
  }
}
EOF
```

#### 8.5 Estado final consolidado — `patient.routes.ts`

``` bash
: > src/features/business/patient/patient.routes.ts
cat >> src/features/business/patient/patient.routes.ts << 'EOF'
import { Application } from "express";
import { PatientController } from "./patient.controller";

export class PatientRoutes {
  public patientController: PatientController = new PatientController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/patients")
      .get(this.patientController.getAll.bind(this.patientController));

    // getOne
    app
      .route("/api/patients/:id")
      .get(this.patientController.getOne.bind(this.patientController));

    // create
    app
      .route("/api/patients")
      .post(this.patientController.create.bind(this.patientController));

    // update (PUT / PATCH)
    app
      .route("/api/patients/:id")
      .put(this.patientController.updatePut.bind(this.patientController))
      .patch(this.patientController.updatePatch.bind(this.patientController));

    // delete físico
    app
      .route("/api/patients/:id")
      .delete(this.patientController.deletePhysical.bind(this.patientController));

    // delete lógico
    app
      .route("/api/patients/:id/deactivate")
      .patch(this.patientController.deleteLogical.bind(this.patientController));
  }
}
EOF
```

#### Verificación ISS-03-E

``` bash
npx tsc --noEmit
```

Con el servidor corriendo, en este orden (primero la baja lógica, luego la física, como en el manual):

``` bash
curl -s -X PATCH http://localhost:4000/api/patients/1/deactivate
curl -s http://localhost:4000/api/patients
curl -s -X DELETE http://localhost:4000/api/patients/1
curl -s http://localhost:4000/api/patients/1
```

> Después de la baja lógica, `GET /api/patients` ya no lista el id 1 porque solo muestra `active`. Después del DELETE, `GET /api/patients/1` responde 404.

![](images/clipboard-3894485331.png)

#### Cierre del ISS

![](images/clipboard-1105693956.png)

## 9. ISS-04 — Seeders con Faker (feature + runner externo)

**Objetivo:** generar datos falsos de Patient con Faker, más un orquestador externo que ejecuta todos los seeders con una cantidad configurable por entidad.\
**Bloqueado por:** ISS-03-A (modelo). Se recomienda hacerlo después de ISS-03-E.

### 9.1 Seeder dentro del feature Patient

#### 9.1.a Dependencia

Es infraestructura genérica, así que va igual que en el manual:

``` bash
npm install -D @faker-js/faker@^10.6.0
```

#### 9.1.b `patient.seeder.ts` (archivo nuevo)

![](images/clipboard-3596340159.png)

### 9.2 SeedersRunner + conteos por entidad (`database/seeders`)

#### 9.2.1 `counts.ts` (archivo nuevo)

![](images/clipboard-3429447933.png)

#### 9.2.2 `index.ts`, el runner (archivo nuevo)

![](images/clipboard-3180642736.png)

#### 9.2.3 PARCHE — `package.json` (script `db:seed`)

Dentro de `"scripts"`, debajo de `"dev"`, se agrega la clave `db:seed`:

``` bash
npm pkg set "scripts.db:seed=ts-node -- src/database/seeders/index.ts"
```

Estado esperado:

![](images/clipboard-4104031887.png)

#### Verificación ISS-04

``` bash
npx tsc --noEmit
```

``` bash
npm run db:seed
npm run db:seed -- --patients=20
SEED_PATIENTS=5 npm run db:seed
```

![](images/clipboard-496619547.png)

La primera inserta 10, porque es el default. La segunda y la tercera muestran `📊 Conteos: { patients: 20 }` y `{ patients: 5 }`, lo que confirma que el CLI y el env se leen bien. Pero omiten la inserción, porque ya hay filas. Ese es exactamente el comportamiento del manual. Para ver insertar 20 o 5, vacía la tabla antes de cada una.

``` bash
curl -s -w "\n%{http_code}\n" http://localhost:4000/api/patients
```

![](images/clipboard-794612193.png)

#### Cierre del ISS

![](images/clipboard-1844324295.png)

## 10. ISS-05 — Swagger / OpenAPI (feature + registry externo)

**Objetivo:** documentar el API de Patient en OpenAPI 3 y montar Swagger UI desde un registry externo, con el mismo patrón que los seeders.\
**Bloqueado por:** ISS-03-E (rutas CRUD definidas).

### 10.1 OpenAPI dentro del feature Patient

#### 10.1.a Dependencias

``` bash
npm install swagger-ui-express@^5.0.1
npm install -D @types/swagger-ui-express@^4.1.8
```

#### 10.1.b `patient.swagger.ts` (archivo nuevo)

![](images/clipboard-2421580916.png)

### 10.2 Registry externo + montaje en Config

#### 10.2.a Carpeta `src/swagger/`

``` bash
mkdir -p src/swagger
```

#### 10.2.b `src/swagger/index.ts` (archivo nuevo)

![](images/clipboard-4154904745.png)

#### 10.2.c PARCHE — `src/config/index.ts`

**1. Debajo de** `import { Routes } from "../routes/index";`, **añadir:**

``` typescript
import { setupSwagger } from "../swagger/index";
```

![](images/clipboard-3702101409.png)

**2. Dentro del** `constructor`, **debajo de** `this.routes();` y **encima de** `this.dbConnection();`, **añadir:**

``` typescript
    this.docs();
```

![](images/clipboard-2023364622.png)

**3. Dentro de** la clase `App`, **debajo de** el método `routes()` completo (después de su llave de cierre `}`) y **encima de** `private async dbConnection()`, **añadir:**

``` typescript
  
  private docs(): void {
    setupSwagger(this.app);
  }
```

![](images/clipboard-3949529064.png)

**Comprobación rápida:**

``` bash
grep -n -E "setupSwagger|this.docs|private docs" src/config/index.ts
```

![](images/clipboard-15935849.png)

#### Verificación ISS-05

``` bash
npx tsc --noEmit

curl -s http://localhost:4000/api/docs.json | head -c 400; echo
```

![](images/clipboard-2348473214.png)

#### Cierre del ISS

![](images/clipboard-109046364.png)

![](images/clipboard-3318392445.png)

## 11. ISS-06 — Feature Specialty (especialidades)

**Objetivo:** CRUD + seeder + swagger de Specialty, un catálogo simple sin FK.\
**Bloqueado por:** ISS-05.\
**API:** `/api/specialties`, **SIN AUTH**.\
**Patrón del manual:** ProductType (§11.1–11.6).

La carpeta de la entidad es nueva. Un solo `mkdir -p` crea la base y `http/`, como en el manual (§11):

``` bash
mkdir -p src/features/business/specialty/http
```

#### 11.1 Modelo Specialty

![](images/clipboard-919984415.png)

### 11.2 Controller + routes (CRUD completo)

#### 11.2.a `specialty.controller.ts`

![](images/clipboard-2839363257.png)

![](images/clipboard-4283427389.png)

#### 11.2.b `specialty.routes.ts`

![](images/clipboard-2817800089.png)

### 11.3 HTTP (REST Client)

#### 11.3.a `specialties.get.http`

![](images/clipboard-3655790874.png)

#### 11.3.b `specialties.create.http`

![](images/clipboard-1158634796.png)

#### 11.3.c `specialties.update.http`

![](images/clipboard-2180701181.png)

#### 11.3.d `specialties.delete.http`

![](images/clipboard-1133132468.png)

### 11.4 Cableado Routes + Config

#### 11.4.a PARCHE — `src/routes/index.ts`

**1. Debajo de** `import { PatientRoutes } from "../features/business/patient/patient.routes";`, **añadir:**

``` typescript
import { SpecialtyRoutes } from "../features/business/specialty/specialty.routes";
```

![](images/clipboard-2445337132.png)

**2. Dentro de** `export class Routes`, **debajo de** `public patientRoutes: PatientRoutes = new PatientRoutes();`, **añadir:**

``` typescript
  public specialtyRoutes: SpecialtyRoutes = new SpecialtyRoutes();
```

![](images/clipboard-132731105.png)

#### 11.4.b PARCHE — `src/config/index.ts`

**1. Debajo de** `import "../features/business/patient/patient.model";`, **añadir:**

``` typescript
import "../features/business/specialty/specialty.model";
```

![](images/clipboard-1212819875.png)

**2. Dentro de** `routes()`, **debajo de** `this.routePrv.patientRoutes.routes(this.app);`, **añadir:**

``` typescript
    this.routePrv.specialtyRoutes.routes(this.app);
```

![](images/clipboard-2227003245.png)

``` bash
npx tsc --noEmit
```

#### Verificación intermedia (API)

``` bash
curl -s -w "\n%{http_code}\n" -X POST http://localhost:4000/api/specialties \
  -H 'Content-Type: application/json' \
  -d '{"name":"Pediatría","description":"Atención de niños y adolescentes","status":"active"}'
curl -s -w "\n%{http_code}\n" http://localhost:4000/api/specialties
```

![](images/clipboard-1733634952.png)

### 11.5 Seeder Specialty

#### 11.5.a `specialty.seeder.ts` (archivo nuevo)

![](images/clipboard-1084376610.png)

#### 11.5.b PARCHE — `src/database/seeders/counts.ts`

**1. Dentro de** `export type SeedCounts`, **reemplazar** la línea:

``` typescript
  // specialties?: number;
```

**por:**

``` typescript
  specialties: number;
```

![](images/clipboard-2834746762.png)

**2. Dentro de** `DEFAULT_SEED_COUNTS`, **debajo de** `patients: 10,`, **añadir:**

``` typescript
  specialties: 10,
```

![](images/clipboard-2308104001.png)

**3. Dentro de** `resolveSeedCounts`, **debajo de** el bloque `if (envPatients ...) { ... }` (su llave de cierre) y **encima de** `for (const arg of argv) {`, **añadir:**

``` typescript

  const envSpecialties = process.env.SEED_SPECIALTIES;
  if (envSpecialties !== undefined && envSpecialties !== "") {
    counts.specialties = Number(envSpecialties);
  }
```

![](images/clipboard-1893552122.png)

#### 11.5.c PARCHE — `src/database/seeders/index.ts` (runner)

**1. Debajo de** `import "../../features/business/patient/patient.model";`, **añadir:**

``` typescript
import "../../features/business/specialty/specialty.model";
```

![](images/clipboard-3463802318.png)

**2. Debajo de** `import { seedPatients } from "../../features/business/patient/patient.seeder";`, **añadir:**

``` typescript
import { seedSpecialties } from "../../features/business/specialty/specialty.seeder";
```

![](images/clipboard-2409295992.png)

**3. Debajo de** `await seedPatients(counts.patients);`, **añadir:**

``` typescript
  await seedSpecialties(counts.specialties);
```

![](images/clipboard-3193136178.png)

``` bash
npx tsc --noEmit
```

> `specialties` ya tiene la fila que creaste en la verificación intermedia, así que el seeder la omitirá. Si quieres verlo insertar, vacía primero: `mysql -h 127.0.0.1 -P 3307 -u express_admin -p backend_express -e "DELETE FROM specialties;"`

``` bash
npm run db:seed
```

![](images/clipboard-4048940731.png)

### 11.6 Swagger Specialty

#### 11.6.a `specialty.swagger.ts` (archivo nuevo)

![](images/clipboard-2813221844.png)

![![](images/clipboard-4129560852.png)](images/clipboard-1446177125.png)

![](images/clipboard-3791076147.png)

#### 11.6.b PARCHE — `src/swagger/index.ts` (registry)

**1. Debajo de** `import { patientSwagger } from "../features/business/patient/patient.swagger";`, **añadir:**

``` typescript
import { specialtySwagger } from "../features/business/specialty/specialty.swagger";
```

![](images/clipboard-2864213613.png)

**2. Dentro de** `featureSwaggerModules`, **reemplazar** la línea:

``` typescript
  // specialtySwagger,
```

**por:**

``` typescript
  specialtySwagger,
```

![](images/clipboard-3883906777.png)

#### Verificación ISS-06

``` bash
npx tsc --noEmit
```

**Con el servidor corriendo:**

```         
curl -s -w "\n%{http_code}\n" http://localhost:4000/api/specialties
curl -s http://localhost:4000/api/docs.json | grep -o '"name":"Specialties"'
```

![](images/clipboard-3733768214.png)

#### Cierre del ISS

``` bash
npm run dev
```

![](images/clipboard-1227945918.png)

![](images/clipboard-3408712436.png)

## 12. ISS-07 — Feature Doctor (médicos)

**Objetivo:** CRUD + seeder + swagger de Doctor.\
**Bloqueado por:** ISS-06.\
**API:** `/api/doctors`, **SIN AUTH**.\
**Patrón del manual:** Product (§12.1–12.6), adaptado.

``` bash
mkdir -p src/features/business/doctor/http
```

#### 12.1 Modelo Doctor

![](images/clipboard-3238989568.png)

### 12.2 Controller + routes

#### 12.2.a `doctor.controller.ts`

![](images/clipboard-716057360.png)

![](images/clipboard-804977858.png)

#### 12.2.b `doctor.routes.ts`

![](images/clipboard-1473753809.png)

### 12.3 HTTP

#### 12.3.a `doctors.get.http`

![](images/clipboard-290385679.png)

#### 12.3.b `doctors.create.http`

![](images/clipboard-21995143.png)

#### 12.3.c `doctors.update.http`

![](images/clipboard-2125279583.png)

#### 12.3.d `doctors.delete.http`

![](images/clipboard-3368906699.png)

### 12.4 Cableado

#### 12.4.a PARCHE — `src/routes/index.ts`

**1. Debajo de** `import { SpecialtyRoutes } from "../features/business/specialty/specialty.routes";`, **añadir:**

``` typescript
import { DoctorRoutes } from "../features/business/doctor/doctor.routes";
```

![](images/clipboard-2652895141.png)

**2. Dentro de** `Routes`, **debajo de** `public specialtyRoutes: SpecialtyRoutes = new SpecialtyRoutes();`, **añadir:**

``` typescript
public doctorRoutes: DoctorRoutes = new DoctorRoutes();
```

![](images/clipboard-77003844.png)

#### 12.4.b PARCHE — `src/config/index.ts` (modelo + ruta)

**1. Debajo de** `import "../features/business/specialty/specialty.model";`, **añadir:**

``` typescript
import "../features/business/doctor/doctor.model";
```

![](images/clipboard-91547910.png)

**2. Dentro de** `routes()`, **debajo de** `this.routePrv.specialtyRoutes.routes(this.app);`, **añadir:**

``` typescript
this.routePrv.doctorRoutes.routes(this.app);
```

![](images/clipboard-789136559.png)

``` bash
npx tsc --noEmit
```

### 12.5 Sync seguro para FKs (hueco del manual) — PARCHE `src/config/index.ts`

**Por qué ahora:** en ISS-08 aparecen las primeras FKs (`doctor_specialties → doctors / specialties`). Con MySQL, `sync({ alter: true })` puede fallar al alterar tablas que ya tienen restricciones FK. El manual lo resuelve en §13.7 desactivando `FOREIGN_KEY_CHECKS` solo durante el sync, y añade la opción `DB_SYNC_FORCE`. Lo dejo instalado desde ya.

**Dentro de** `dbConnection()`, **reemplazar** estas 4 líneas:

```         
      // alter: true actualiza columnas faltantes (ej. createdAt/updatedAt tras timestamps: true).
      // force: false no recrea tablas; no borra datos. En producción preferir migraciones.
      await sequelize.sync({ force: false, alter: true });
      console.log(`📦 Base de datos sincronizada exitosamente`);
```

**por:**

``` typescript
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
```

![](images/clipboard-3168607829.png)

- `DB_SYNC_FORCE` **no** se agrega al `.env`. Por defecto no existe, así que el comportamiento es `alter: true`, igual que antes.

- ⚠️ Si algún día corres `DB_SYNC_FORCE=true npm run dev`, se **borran y recrean todas las tablas con sus datos**. Úsalo solo cuando quieras empezar la BD desde cero.

```         
npx tsc --noEmit
```

### 12.6 Seeder + Swagger Doctor

#### 12.6.a `doctor.seeder.ts` (archivo nuevo)

![](images/clipboard-2527936000.png)

#### 12.6.b PARCHE — `src/database/seeders/counts.ts`

**1. Dentro de** `SeedCounts`, **reemplazar** la línea:

``` typescript
  // doctors?: number;
```

**por:**

``` typescript
  doctors: number;
```

![](images/clipboard-2720671105.png)

**2. Dentro de** `DEFAULT_SEED_COUNTS`, **debajo de** `specialties: 10,`, **añadir:**

``` typescript
  doctors: 15,
```

![](images/clipboard-984042910.png)

**3. Dentro de** `resolveSeedCounts`, **debajo de** el bloque `if (envSpecialties ...) { ... }` y **encima de** `for (const arg of argv) {`, **añadir:**

``` typescript

  const envDoctors = process.env.SEED_DOCTORS;
  if (envDoctors !== undefined && envDoctors !== "") {
    counts.doctors = Number(envDoctors);
  }
```

![](images/clipboard-746242098.png)

#### 12.6.c PARCHE — `src/database/seeders/index.ts` (runner)

**1. Debajo de** `import "../../features/business/specialty/specialty.model";`, **añadir:**

``` typescript
import "../../features/business/doctor/doctor.model";
```

![](images/clipboard-3465110976.png)

**2. Debajo de** `import { seedSpecialties } from "../../features/business/specialty/specialty.seeder";`, **añadir:**

``` typescript
import { seedDoctors } from "../../features/business/doctor/doctor.seeder";
```

![](images/clipboard-176202122.png)

**3. Debajo de** `await seedSpecialties(counts.specialties);`, **añadir:**

``` typescript
  await seedDoctors(counts.doctors);
```

![](images/clipboard-1417754122.png)

#### 12.6.d `doctor.swagger.ts` (archivo nuevo)

![![](images/clipboard-722836965.png)](images/clipboard-4098916138.png)

#### 12.6.e PARCHE — `src/swagger/index.ts` (registry)

**1. Debajo de** `import { specialtySwagger } from "../features/business/specialty/specialty.swagger";`, **añadir:**

``` typescript
import { doctorSwagger } from "../features/business/doctor/doctor.swagger";
```

![](images/clipboard-3618266313.png)

**2. Dentro de** `featureSwaggerModules`, **reemplazar** la línea:

``` typescript
  // doctorSwagger,
```

**por:**

``` typescript
  doctorSwagger,
```

![](images/clipboard-4193049817.png)

#### Verificación ISS-07

``` bash
npx tsc --noEmit 
npm run db:seed
```

> Esperado: `📊 Conteos: { patients: 10, specialties: 10, doctors: 15 }`, luego `⏭️` para patients y specialties (ya tienen filas) y `✅ doctors: insertados 15`.

![](images/clipboard-2571746492.png)

**Con `npm run dev` corriendo:**

``` bash
curl -s -w "\n%{http_code}\n" http://localhost:4000/api/doctors
curl -s -w "\n%{http_code}\n" -X POST http://localhost:4000/api/doctors \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dra. Laura Ríos","description":"Pediatra","status":"active"}'
```

> En [**http://localhost:4000/api/docs**](http://localhost:4000/api/docs) deben aparecer tres grupos: Patients, Specialties y Doctors.

![](images/clipboard-2948459209.png)

#### Cierre del ISS

![![](images/clipboard-917540823.png)](images/clipboard-2643533845.png)

## 13. ISS-08 — Feature DoctorSpecialty (pivote N:M médico ↔ especialidad)

**Objetivo:** implementar la relación N:M Doctor ↔ Specialty con un feature propio `doctor-specialty/` (tabla `doctor_specialties`), con CRUD, asociaciones, seeder y swagger.\
**Bloqueado por:** ISS-07 (Doctor) y ISS-06 (Specialty).\
**API:** `/api/doctor-specialties`, **SIN AUTH**.\
**Patrón del manual:** el feature `product-sale/` de ISS-08 (§13.1, 13.1b, 13.2b, 13.3b, 13.4b, 13.6b). La parte de Sale del manual corresponde a Cita (ISS-11), no a este ISS.

### 13.1 Modelo y asociaciones

#### 13.1.a `doctor-specialty.model.ts`

![](images/clipboard-2655353377.png)

#### 13.1.b `doctor-specialty.associations.ts`

![](images/clipboard-2011277876.png)

#### 13.2 Controller DoctorSpecialty

![![](images/clipboard-2734909804.png)](images/clipboard-620016912.png)

![](images/clipboard-587062383.png)

### 13.3 Routes + HTTP

#### 13.3.a `doctor-specialty.routes.ts`

![](images/clipboard-3859400043.png)

#### 13.3.b `doctor-specialties.get.http`

![](images/clipboard-526382800.png)

#### 13.3.c `doctor-specialties.create.http`

![](images/clipboard-807634614.png)

#### 13.3.d `doctor-specialties.update.http`

![](images/clipboard-967993009.png)

#### 13.3.e `doctor-specialties.delete.http`

![](images/clipboard-1626449416.png)

### 13.4 Cableado + relaciones

#### 13.4.a PARCHE — `src/routes/index.ts`

**1. Debajo de** `import { DoctorRoutes } from "../features/business/doctor/doctor.routes";`, **añadir:**

``` typescript
import { DoctorSpecialtyRoutes } from "../features/business/doctor-specialty/doctor-specialty.routes";
```

![](images/clipboard-3145334434.png)

**2. Dentro de** `Routes`, **debajo de** `public doctorRoutes: DoctorRoutes = new DoctorRoutes();`, **añadir:**

``` typescript
  public doctorSpecialtyRoutes: DoctorSpecialtyRoutes = new DoctorSpecialtyRoutes();
```

![](images/clipboard-2343117070.png)

#### 13.4.b PARCHE — `src/config/index.ts`

**1. Debajo de** `import "../features/business/doctor/doctor.model";`, **añadir** el modelo y, justo debajo, sus asociaciones. Van encima de `import { Routes }`, como indica el manual en §12.5 y §13.5:

``` typescript
import "../features/business/doctor-specialty/doctor-specialty.model";
import "../features/business/doctor-specialty/doctor-specialty.associations";
```

![](images/clipboard-3714236713.png)

**2. Dentro de** `routes()`, **debajo de** `this.routePrv.doctorRoutes.routes(this.app);`, **añadir:**

``` typescript
    this.routePrv.doctorSpecialtyRoutes.routes(this.app);
```

![](images/clipboard-644098041.png)

**Comprobación de que las asociaciones quedaron después de los tres modelos que usan:**

``` bash
grep -n "features/business" src/config/index.ts
```

> Orden esperado: patient.model → specialty.model → doctor.model → doctor-specialty.model → doctor-specialty.associations.

![](images/clipboard-960312584.png)

### 13.5 Seeder + counts + runner

#### 13.5.a `doctor-specialty.seeder.ts`

![](images/clipboard-877576420.png)

#### 13.5.b PARCHE — `src/database/seeders/counts.ts`

**1. Dentro de** `SeedCounts`, **reemplazar** la línea:

``` typescript
  // doctor_specialties?: number;
```

**por:**

``` typescript
  doctor_specialties: number;
```

![](images/clipboard-505143214.png)

**2. Dentro de** `DEFAULT_SEED_COUNTS`, **debajo de** `doctors: 15,`, **añadir:**

``` typescript
  doctor_specialties: 12,
```

![](images/clipboard-572543308.png)

**3. Dentro de** `resolveSeedCounts`, **debajo de** el bloque `if (envDoctors ...) { ... }` y **encima de** `for (const arg of argv) {`, **añadir:**

``` typescript

  const envDoctorSpecialties = process.env.SEED_DOCTOR_SPECIALTIES;
  if (envDoctorSpecialties !== undefined && envDoctorSpecialties !== "") {
    counts.doctor_specialties = Number(envDoctorSpecialties);
  }
```

![](images/clipboard-1673377857.png)

#### 13.5.c PARCHE — `src/database/seeders/index.ts` (runner)

**1. Debajo de** `import "../../features/business/doctor/doctor.model";`, **añadir:**

``` typescript
import "../../features/business/doctor-specialty/doctor-specialty.model"; 
import "../../features/business/doctor-specialty/doctor-specialty.associations";
```

![](images/clipboard-302348298.png)

**2. Debajo de** `import { seedDoctors } from "../../features/business/doctor/doctor.seeder";`, **añadir:**

``` typescript
import { seedDoctorSpecialties } from "../../features/business/doctor-specialty/doctor-specialty.seeder";
```

![](images/clipboard-2418679764.png)

**3. Dentro de** `runAllSeeders()`, **reemplazar** la línea:

``` typescript
  await sequelize.sync({ force: false, alter: true });
```

**por el bloque del manual (§13.7), porque ya hay FKs:**

``` typescript
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
```

![](images/clipboard-1316473249.png)

**4. Debajo de** `await seedDoctors(counts.doctors);`, **añadir:**

``` typescript
  await seedDoctorSpecialties(counts.doctor_specialties);
```

![](images/clipboard-2233492553.png)

```         
npx tsc --noEmit
```

### 13.6 Swagger DoctorSpecialty

#### 13.6.a `doctor-specialty.swagger.ts`

![](images/clipboard-456845312.png)

![](images/clipboard-156882560.png)

#### 13.6.b PARCHE — `src/swagger/index.ts` (registry)

**1. Debajo de** `import { doctorSwagger } from "../features/business/doctor/doctor.swagger";`, **añadir:**

``` typescript
import { doctorSpecialtySwagger } from "../features/business/doctor-specialty/doctor-specialty.swagger";
```

![](images/clipboard-797831054.png)

**2. Dentro de** `featureSwaggerModules`, **debajo de** `doctorSwagger,`, **añadir:**

``` typescript
  doctorSpecialtySwagger,
```

![](images/clipboard-1892067709.png)

#### Verificación ISS-08

``` bash
npx tsc --noEmit npm run db:seed
```

> Esperado: `📊 Conteos: { patients: 10, specialties: 10, doctors: 15, doctor_specialties: 12 }` y `✅ doctor_specialties: insertados 12`.

![](images/clipboard-3515098646.png)

**Revisa en la BD las FKs y el índice único con nombre:**

``` bash
mysql -h 127.0.0.1 -P 3307 -u express_admin -p backend_express -e "SHOW CREATE TABLE doctor_specialties\G"
```

> Deben aparecer `FOREIGN KEY (doctor_id) REFERENCES doctors (id)`, `FOREIGN KEY (specialty_id) REFERENCES specialties (id)` y `UNIQUE KEY doctor_specialties_doctor_id_specialty_id_unique (doctor_id, specialty_id)`.

![](images/clipboard-303358699.png)

**Con `npm run dev` corriendo:**

``` bash
curl -s -w "\n%{http_code}\n" http://localhost:4000/api/doctor-specialties
```

![](images/clipboard-525966440.png)

**Prueba del par repetido. Toma un `doctor_id` / `specialty_id` que ya salgan en el GET anterior:**

``` bash
curl -s -w "\n%{http_code}\n" -X POST http://localhost:4000/api/doctor-specialties \
  -H 'Content-Type: application/json' \
  -d '{"doctor_id":1,"specialty_id":1,"relation_data":"Prueba"}'
```

> Si el par ya existe, la respuesta es `400` con `"Doctor already has this specialty"`. Si no existe, es `201`. Repite el mismo comando para ver el `400`.
>
> ![](images/clipboard-3496712200.png)
>
> En **/api/docs** aparece el grupo **DoctorSpecialties**, y ya son 4 grupos en total.

**Nota sobre el borrado físico de padres.** Ahora que existen FKs, un `DELETE /api/doctors/:id` o `/api/specialties/:id` de un registro que tenga relaciones en `doctor_specialties` queda sujeto a la regla ON DELETE que Sequelize puso en la FK (puedes verla en el `SHOW CREATE TABLE` de arriba). Según esa regla, se borran las relaciones en cascada o MySQL rechaza el borrado (500). En ambos casos, para médicos o especialidades con relaciones, lo indicado es la **baja lógica** (`/deactivate`).

#### Cierre del ISS

``` bash
npm run dev
```

![](images/clipboard-3613196036.png)

![](images/clipboard-1903178759.png)

## 14. ISS-09 — Feature Service (servicios)

**Objetivo:** CRUD + seeder + swagger de Service, un catálogo simple sin FK.\
**Bloqueado por:** ISS-08.\
**API:** `/api/services`, **SIN AUTH**.\
**Patrón del manual:** ProductType (§11.1–11.6), igual que Specialty en ISS-06.

#### 14.1 Modelo Service

![](images/clipboard-2025431553.png)

### 14.2 Controller + routes

#### 14.2.a `service.controller.ts`

![](images/clipboard-830644158.png)

#### 14.2.b `service.routes.ts`

![](images/clipboard-3047487996.png)

### 14.3 HTTP

#### 14.3.a `services.get.http`

![](images/clipboard-4203127800.png)

#### 14.3.b `services.create.http`

![](images/clipboard-3314790484.png)

#### 14.3.c `services.update.http`

![](images/clipboard-286109110.png)

#### 14.3.d `services.delete.http`

![](images/clipboard-2774307527.png)

### 14.4 Cableado Routes + Config

#### 14.4.a PARCHE — `src/routes/index.ts`

**1. Debajo de** `import { DoctorSpecialtyRoutes } from "../features/business/doctor-specialty/doctor-specialty.routes";`, **añadir:**

``` typescript
import { ServiceRoutes } from "../features/business/service/service.routes";
```

![](images/clipboard-876337061.png)

**2. Dentro de** `Routes`, **debajo de** `public doctorSpecialtyRoutes: DoctorSpecialtyRoutes = new DoctorSpecialtyRoutes();`, **añadir:**

``` typescript
  public serviceRoutes: ServiceRoutes = new ServiceRoutes();
```

![](images/clipboard-3104060567.png)

#### 14.4.b PARCHE — `src/config/index.ts`

**1. Debajo de** `import "../features/business/doctor-specialty/doctor-specialty.model";` (y **encima de** `import "../features/business/doctor-specialty/doctor-specialty.associations";`), **añadir:**

``` typescript
import "../features/business/service/service.model";
```

> ![](images/clipboard-546192187.png)

**2. Dentro de** `routes()`, **debajo de** `this.routePrv.doctorSpecialtyRoutes.routes(this.app);`, **añadir:**

```         
    this.routePrv.serviceRoutes.routes(this.app);
```

![](images/clipboard-3753364835.png)

### 14.5 Seeder Service

#### 14.5.a `service.seeder.ts`

![](images/clipboard-939097638.png)

#### 14.5.b PARCHE — `src/database/seeders/counts.ts`

**1. Dentro de** `SeedCounts`, **debajo de** `doctor_specialties: number;`, **añadir:**

``` typescript
  services: number;
```

![](images/clipboard-1433314118.png)

**2. Dentro de** `DEFAULT_SEED_COUNTS`, **debajo de** `doctor_specialties: 12,`, **añadir:**

``` typescript
  services: 10,
```

![](images/clipboard-92040153.png)

**3. Dentro de** `resolveSeedCounts`, **debajo de** el bloque `if (envDoctorSpecialties ...) { ... }` y **encima de** `for (const arg of argv) {`, **añadir:**

``` typescript

  const envServices = process.env.SEED_SERVICES;
  if (envServices !== undefined && envServices !== "") {
    counts.services = Number(envServices);
  }
```

![](images/clipboard-1560173970.png)

#### 14.5.c PARCHE — `src/database/seeders/index.ts` (runner)

**1. Debajo de** `import "../../features/business/doctor-specialty/doctor-specialty.model";` (y **encima de** su import de `.associations`), **añadir:**

``` typescript
import "../../features/business/service/service.model";
```

![](images/clipboard-2808292248.png)

**2. Debajo de** `import { seedDoctorSpecialties } from "../../features/business/doctor-specialty/doctor-specialty.seeder";`, **añadir:**

``` typescript
import { seedServices } from "../../features/business/service/service.seeder";
```

![](images/clipboard-105079203.png)

**3. Debajo de** `await seedDoctorSpecialties(counts.doctor_specialties);`, **añadir:**

``` typescript
  await seedServices(counts.services);
```

### ![](images/clipboard-1054835971.png)

### 14.6 Swagger Service

#### 14.6.a `service.swagger.ts`

![](images/clipboard-4274892972.png)

![](images/clipboard-2950721269.png)

#### 14.6.b PARCHE — `src/swagger/index.ts` (registry)

**1. Debajo de** `import { doctorSpecialtySwagger } from "../features/business/doctor-specialty/doctor-specialty.swagger";`, **añadir:**

``` typescript
import { serviceSwagger } from "../features/business/service/service.swagger";
```

![](images/clipboard-2271674548.png)

**2. Dentro de** `featureSwaggerModules`, **debajo de** `doctorSpecialtySwagger,`, **añadir:**

``` typescript
  serviceSwagger,
```

![](images/clipboard-3195631886.png)

#### Verificación ISS-09

``` bash
npx tsc --noEmit 
npm run db:seed
```

>  Esperado: `📊 Conteos: { ..., doctor_specialties: 12, services: 10 }` y `✅ services: insertados 10`.

![](images/clipboard-1605310046.png)

**Con `npm run dev` corriendo:**

``` bash
curl -s -w "\n%{http_code}\n" http://localhost:4000/api/services
curl -s -w "\n%{http_code}\n" -X POST http://localhost:4000/api/services \
  -H 'Content-Type: application/json' \
  -d '{"name":"Holter 24 horas","description":"Monitoreo cardiaco ambulatorio","status":"active"}'
```

![](images/clipboard-4181361466.png)

#### Cierre del ISS

![](images/clipboard-3330534691.png)

![](images/clipboard-2884272039.png)

## **15. ISS-10 — Feature Agenda (agendas de médicos)**

**Objetivo:** CRUD + relación + seeder + swagger de Agenda, con FK `doctor_id` (Médico 1:N Agenda). **Bloqueado por:** ISS-09 (y Doctor, ISS-07). **API:** `/api/agendas`, **SIN AUTH**. **Patrón del manual:** Product (§12.1–12.6): catálogo con FK a padre + `assertActive…` + `*.associations.ts`.

### **15.1 Modelo Agenda**

#### **15.1.a `agenda.model.ts`**

![](images/clipboard-3334499264.png)

### **15.2 Controller + routes**

#### **15.2.a `agenda.controller.ts`**

![](images/clipboard-642275165.png)

![](images/clipboard-3748207310.png)

#### **15.2.b `agenda.routes.ts`**

![](images/clipboard-508931526.png)

### **15.3 HTTP**

#### **15.3.a `agendas.get.http`**

![](images/clipboard-1044085043.png)

#### **15.3.b `agendas.create.http`**

![](images/clipboard-4181127409.png)

#### **15.3.c `agendas.update.http`**

![](images/clipboard-3900427624.png)

#### **15.3.d `agendas.delete.http`**

![](images/clipboard-500976808.png)

### **15.4 Cableado Routes + Config**

#### **15.4.a PARCHE — `src/routes/index.ts`**

**1.** **Debajo de** `import { ServiceRoutes } from "../features/business/service/service.routes";`, **añadir:**

``` typescript
import { AgendaRoutes } from "../features/business/agenda/agenda.routes"; 
```

![](images/clipboard-1223866791.png)

**2.** **Dentro de** `Routes`, **debajo de** `public serviceRoutes: ServiceRoutes = new ServiceRoutes();`, **añadir:**

``` typescript
  public agendaRoutes: AgendaRoutes = new AgendaRoutes(); 
```

![](images/clipboard-1400031792.png)

#### **15.4.b PARCHE — `src/config/index.ts` (modelo + ruta)**

**1.** **Debajo de** `import "../features/business/service/service.model";` (bloque de modelos, **encima de** los imports `.associations`), **añadir:**

``` typescript
import "../features/business/agenda/agenda.model"; 
```

![](images/clipboard-3038231675.png)

**2.** **Dentro de** `routes()`, **debajo de** `this.routePrv.serviceRoutes.routes(this.app);`, **añadir:**

``` typescript
    this.routePrv.agendaRoutes.routes(this.app); 
```

![](images/clipboard-907659225.png)

### **15.5 Relaciones (obligatorio al cerrar la tabla)**

#### **15.5.a `agenda.associations.ts`**

![](images/clipboard-3427901151.png)

### **15.5.b PARCHE — `src/config/index.ts` (asociaciones)**

**Debajo de** `import "../features/business/doctor-specialty/doctor-specialty.associations";` (y **encima de** `import { Routes } ...`), **añadir:**

``` typescript
import "../features/business/agenda/agenda.associations";
```

![](images/clipboard-2774155368.png)

### **15.6 Seeder + Swagger Agenda**

#### **15.6.a `agenda.seeder.ts`**

![](images/clipboard-494490102.png)

#### **15.6.b PARCHE — `src/database/seeders/counts.ts`**

**1.** **Dentro de** `SeedCounts`, **debajo de** `services: number;`, **añadir:**

``` typescript
  agendas: number; 
```

![](images/clipboard-1825804366.png)

**2.** **Dentro de** `DEFAULT_SEED_COUNTS`, **debajo de** `services: 10,`, **añadir:**

``` typescript
  agendas: 15, 
```

![](images/clipboard-1550243606.png)

**3.** **Dentro de** `resolveSeedCounts`, **debajo de** el bloque `if (envServices ...) { ... }` (su llave de cierre) y **encima de** `for (const arg of argv) {`, **añadir:**

``` typescript

  const envAgendas = process.env.SEED_AGENDAS;
  if (envAgendas !== undefined && envAgendas !== "") {
    counts.agendas = Number(envAgendas);
  }
```

![](images/clipboard-3911328146.png)

#### **15.6.c PARCHE — `src/database/seeders/index.ts` (runner)**

**1.** **Debajo de** `import "../../features/business/service/service.model";` (bloque de modelos), **añadir:**

``` typescript
import "../../features/business/agenda/agenda.model"; 
```

![](images/clipboard-2882332743.png)

**2.** **Debajo de** `import "../../features/business/doctor-specialty/doctor-specialty.associations";`, **añadir:**

``` typescript
import "../../features/business/agenda/agenda.associations"; 
```

![](images/clipboard-849934330.png)

**3.** **Debajo de** `import { seedServices } from "../../features/business/service/service.seeder";`, **añadir:**

``` typescript
import { seedAgendas } from "../../features/business/agenda/agenda.seeder"; 
```

![](images/clipboard-3804853091.png)

**4.** **Dentro de** `runAllSeeders()`, **debajo de** `await seedServices(counts.services);`, **añadir:**

``` typescript
  await seedAgendas(counts.agendas); 
```

![](images/clipboard-801504797.png)

#### **15.6.d `agenda.swagger.ts`**

![](images/clipboard-3009067145.png)

![](images/clipboard-1811730560.png)

#### **15.6.e PARCHE — `src/swagger/index.ts` (registry)**

**1.** **Debajo de** `import { serviceSwagger } from "../features/business/service/service.swagger";`, **añadir:**

``` typescript
import { agendaSwagger } from "../features/business/agenda/agenda.swagger"; 
```

![](images/clipboard-1297849160.png)

**2.** **Dentro de** `featureSwaggerModules`, **debajo de** `serviceSwagger,`, **añadir:**

``` typescript
  agendaSwagger, 
```

![](images/clipboard-3504683203.png)

#### **Verificación ISS-10**

``` bash
npx tsc --noEmit 
npm run db:seed 
```

> Esperado: en `📊 Conteos` aparece `agendas: 15` y luego `✅ agendas: insertados 15`.

![](images/clipboard-2885844517.png)

**Con `npm run dev` corriendo:**

``` bash
curl -s -w "\n%{http_code}\n" http://localhost:4000/api/agendas
curl -s -w "\n%{http_code}\n" -X POST http://localhost:4000/api/agendas \
  -H 'Content-Type: application/json' \
  -d '{"name":"Agenda prueba","description":"Sábados","doctor_id":1,"status":"active"}'
curl -s -w "\n%{http_code}\n" -X POST http://localhost:4000/api/agendas \
  -H 'Content-Type: application/json' \
  -d '{"name":"Agenda sin médico","doctor_id":99999}'
```

> El primer POST responde `201` (si el médico 1 existe y está activo). El segundo responde `404` con `"Doctor not found"`.

![](images/clipboard-3038723269.png)

Revisa la FK en la BD:

``` bash
mysql -h 127.0.0.1 -P 3307 -u express_admin -p backend_express -e "SHOW CREATE TABLE agendas\G" 
```

> Debe aparecer `FOREIGN KEY (doctor_id) REFERENCES doctors (id)`. En **/api/docs** aparece el grupo **Agendas**.

![](images/clipboard-1133375987.png)

### **Cierre del ISS**

![](images/clipboard-448079756.png)

![](images/clipboard-2502191711.png)

## **16. ISS-11 — Feature Appointment (citas)**

**Objetivo:** citas con FKs `agenda_id` y `patient_id`, create **transaccional** con validaciones de negocio, estado de negocio `state`, relaciones, seeder y swagger. **Bloqueado por:** ISS-10 (Agenda) y ISS-03 (Patient). **API:** `/api/appointments`, **SIN AUTH**. **Patrón del manual:** Sale (§13): cabecera transaccional con orquestación (`sequelize.transaction()`, `lock`, `rollback`).

### **16.1 Modelo Appointment**

#### **16.1.a `appointment.model.ts`**

![](images/clipboard-3906753759.png)

### **16.2 Controller + routes**

#### **16.2.a `appointment.controller.ts`**

![](images/clipboard-3756026930.png)

![](images/clipboard-76632046.png)

![](images/clipboard-2603480625.png)

#### **16.2.b `appointment.routes.ts`**

![](images/clipboard-1681541715.png)

### **16.3 HTTP**

#### **16.3.a `appointments.get.http`**

![](images/clipboard-652127904.png)

#### **16.3.b `appointments.create.http`**

![](images/clipboard-1154989468.png)

#### **16.3.c `appointments.update.http`**

![](images/clipboard-3922306873.png)

#### **16.3.d `appointments.delete.http`**

![](images/clipboard-4174316757.png)

### **16.4 Cableado Routes + Config**

#### **16.4.a PARCHE — `src/routes/index.ts`**

**1.** **Debajo de** `import { AgendaRoutes } from "../features/business/agenda/agenda.routes";`, **añadir:**

``` typescript
import { AppointmentRoutes } from "../features/business/appointment/appointment.routes"; 
```

![](images/clipboard-641743269.png)

**2.** **Dentro de** `Routes`, **debajo de** `public agendaRoutes: AgendaRoutes = new AgendaRoutes();`, **añadir:**

``` typescript
  public appointmentRoutes: AppointmentRoutes = new AppointmentRoutes(); 
```

![](images/clipboard-544953465.png)

#### **16.4.b PARCHE — `src/config/index.ts` (modelo + ruta)**

**1.** **Debajo de** `import "../features/business/agenda/agenda.model";` (bloque de modelos, **encima de** los imports `.associations`), **añadir:**

``` typescript
import "../features/business/appointment/appointment.model"; 
```

![](images/clipboard-3270949156.png)

**2.** **Dentro de** `routes()`, **debajo de** `this.routePrv.agendaRoutes.routes(this.app);`, **añadir:**

``` typescript
    this.routePrv.appointmentRoutes.routes(this.app); 
```

![](images/clipboard-1478183322.png)

### **16.5 Relaciones (obligatorio al cerrar la tabla)**

#### **16.5.a `appointment.associations.ts`**

![](images/clipboard-1176217339.png)

#### **16.5.b PARCHE — `src/config/index.ts` (asociaciones)**

**Debajo de** `import "../features/business/agenda/agenda.associations";` (y **encima de** `import { Routes } ...`), **añadir:**

``` typescript
import "../features/business/appointment/appointment.associations"; 
```

![](images/clipboard-2400390744.png)

### **16.6 Seeder + Swagger Appointment**

#### **16.6.a `appointment.seeder.ts`**

![](images/clipboard-754374418.png)

### **16.6.b PARCHE — `src/database/seeders/counts.ts`**

**1.** **Dentro de** `SeedCounts`, **debajo de** `agendas: number;`, **añadir:**

``` typescript
  appointments: number; 
```

![](images/clipboard-3313044307.png)

**2.** **Dentro de** `DEFAULT_SEED_COUNTS`, **debajo de** `agendas: 15,`, **añadir:**

``` typescript
  appointments: 20, 
```

![](images/clipboard-962885524.png)

**3.** **Dentro de** `resolveSeedCounts`, **debajo de** el bloque `if (envAgendas ...) { ... }` (su llave de cierre) y **encima de** `for (const arg of argv) {`, **añadir:**

``` typescript

  const envAppointments = process.env.SEED_APPOINTMENTS;
  if (envAppointments !== undefined && envAppointments !== "") {
    counts.appointments = Number(envAppointments);
  }
```

![](images/clipboard-731897678.png)

### **16.6.c PARCHE — `src/database/seeders/index.ts` (runner)**

**1.** **Debajo de** `import "../../features/business/agenda/agenda.model";` (bloque de modelos), **añadir:**

``` typescript
import "../../features/business/appointment/appointment.model"; 
```

![](images/clipboard-2811142543.png)

**2.** **Debajo de** `import "../../features/business/agenda/agenda.associations";`, **añadir:**

``` typescript
import "../../features/business/appointment/appointment.associations"; 
```

![](images/clipboard-2967009020.png)

**3.** **Debajo de** `import { seedAgendas } from "../../features/business/agenda/agenda.seeder";`, **añadir:**

``` typescript
import { seedAppointments } from "../../features/business/appointment/appointment.seeder"; 
```

![](images/clipboard-1054205611.png)

**4.** **Dentro de** `runAllSeeders()`, **debajo de** `await seedAgendas(counts.agendas);`, **añadir:**

``` typescript
  await seedAppointments(counts.appointments); 
```

![](images/clipboard-1380240690.png)

### **16.6.d `appointment.swagger.ts`**

![![](images/clipboard-2360072257.png)](images/clipboard-1087054046.png)

### **16.6.e PARCHE — `src/swagger/index.ts` (registry)**

**1.** **Debajo de** `import { agendaSwagger } from "../features/business/agenda/agenda.swagger";`, **añadir:**

``` typescript
import { appointmentSwagger } from "../features/business/appointment/appointment.swagger"; 
```

![](images/clipboard-3485874918.png)

**2.** **Dentro de** `featureSwaggerModules`, **debajo de** `agendaSwagger,`, **añadir:**

``` typescript
  appointmentSwagger, 
```

![](images/clipboard-3474580228.png)

### **Verificación ISS-11**

``` bash
npx tsc --noEmit 
npm run db:seed 
```

> Esperado: `appointments: 20` en los conteos y `✅ appointments: insertados 20`.

![](images/clipboard-1759599115.png)

Con `npm run dev` corriendo. Usa un `agenda_id` y un `patient_id` activos (míralos con `curl -s http://localhost:4000/api/agendas` y `/api/patients`):

``` bash
 curl -s -w "\n%{http_code}\n" -X POST http://localhost:4000/api/appointments \
  -H 'Content-Type: application/json' \
  -d '{"agenda_id":1,"patient_id":4,"start_date":"2026-12-01T10:00:00","end_date":"2026-12-01T10:30:00","reason":"Prueba"}'
```

> `201`, con `"state":"scheduled"`. Si repites **el mismo** comando, responde `400` con `"Agenda already has an appointment in that time range"`: la regla de cruce funciona.

![](images/clipboard-3863596145.png)

Prueba de la regla del PDF (usa el `id` de la cita recién creada):

``` bash
curl -s -w "\n%{http_code}\n" -X PATCH http://localhost:4000/api/appointments/ID_DE_LA_CITA \
  -H 'Content-Type: application/json' -d '{"state":"attended"}'
```

> `400` con `"State 'attended' is set only by POST /api/encounters (requires clinical record)"`.

> En **/api/docs** aparece el grupo **Appointments**.

![](images/clipboard-1055814489.png)

### **Cierre del ISS**

![](images/clipboard-1585878503.png)

![](images/clipboard-329460774.png)
