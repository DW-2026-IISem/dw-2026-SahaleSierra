# Proceso del Manual de Creacion del Backend

## Índice

- [FASE 1: `00_BASE_INIT_NESTJS`](#fase-1-00_base_init_nestjs)
- [FASE 2: `01_BASE_DEPS_Y_PUERTO`](#fase-2-01_base_deps_y_puerto)
- [FASE 3: `02_BASE_ESTRUCTURA_CA`](#fase-3-02_base_estructura_ca)
- [FASE 4: `03_BASE_ENTORNO_ENV`](#fase-4-03_base_entorno_env)
- [FASE 5: `04_BASE_DATABASE_SEQUELIZE`](#fase-5-04_base_database_sequelize)
- [FASE 6: `05_BASE_APP_COMMON_SECURITY`](#fase-6-05_base_app_common_security)
- [FASE 7: `06_BUSINESS_PATIENTS`](#fase-7-06_business_patients)
- [FASE 8: `07_BUSINESS_SPECIALTIES`](#fase-8-07_business_specialties)
- [FASE 9: `08_BUSINESS_DOCTORS`](#fase-9-08_business_doctors)
- [FASE 10: `09_BUSINESS_DOCTOR_SPECIALTIES`](#fase-10-09_business_doctor_specialties)
- [FASE 11: `10_BUSINESS_SERVICES`](#fase-11-10_business_services)
- [FASE 12: `11_BUSINESS_AGENDAS`](#fase-12-11_business_agendas)
- [FASE 13: `12_BUSINESS_APPOINTMENTS`](#fase-13-12_business_appointments)
- [FASE 14: `13_BUSINESS_AUTHORIZATIONS`](#fase-14-13_business_authorizations)
- [FASE 15: `14_BUSINESS_CLINICAL_RECORDS`](#fase-15-14_business_clinical_records)
- [FASE 16: `15_BUSINESS_ENCOUNTERS`](#fase-16-15_business_encounters)
- [FASE 17: `16_BUSINESS_INVOICES`](#fase-17-16_business_invoices)
- [FASE 18: `17_FIXES_Y_AJUSTES`](#fase-18-17_fixes_y_ajustes)
- [FASE 19: `18_DEMO_SWAGGER_UI`](#fase-19-18_demo_swagger_ui)

------------------------------------------------------------------------

## FASE 1: `00_BASE_INIT_NESTJS` {#fase-1-00_base_init_nestjs}

### **Objetivo de la fase:** Dejar el esqueleto oficial Nest corriendo en un puerto libre, con Git inicial.

#### 1.1 — Crear carpetas padre y permisos

**Archivo:** `(sin archivo — comando de sistema)`

``` bash
mkdir -p ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/Backend
chmod -R 755 ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/Backend
```

#### 1.2 — Instalar Nest CLI (si no existe)

**Archivo:** `(sin archivo — comando de sistema)`

![](images/clipboard-590382690.png)

#### 1.3 — Crear proyecto NestJS

**Archivo:** `(scaffold generado por Nest CLI)`

<img src="images/clipboard-1022780847.png" width="598"/>

#### 1.4 — Crear `.env` mínimo (puerto)

**Archivo:** `.env`

![](images/clipboard-4185916596.png)

------------------------------------------------------------------------

## FASE 2: `01_BASE_DEPS_Y_PUERTO` {#fase-2-01_base_deps_y_puerto}

### **Objetivo de la fase:** Instalar el stack profesional y evitar que un `start:dev` colgado bloquee el puerto.

#### 2.1 — Dependencias de producción

**Archivo:** `(sin archivo — instalación de paquetes)`

![](images/clipboard-3576067118.png)

#### 2.2 — Dependencias de desarrollo

**Archivo:** `(sin archivo — instalación de paquetes)`

![](images/clipboard-67397687.png)

#### 2.3 — Script para liberar puerto (evita EADDRINUSE)

**Archivo:** `scripts/free-port.js`

![](images/clipboard-852153046.png)

#### 2.4 — Actualizar scripts npm en package.json

![](images/clipboard-2831284300.png)

#### 2.5 — Verificar arranque base

![](images/clipboard-174352802.png)

------------------------------------------------------------------------

## FASE 3: `02_BASE_ESTRUCTURA_CA` {#fase-3-02_base_estructura_ca}

### **Objetivo de la fase:** Crear el mapa mental: config / common / infrastructure / features (business + auth).

#### 3.1 — Crear árbol base de carpetas

![](images/clipboard-3682792134.png)

------------------------------------------------------------------------

## FASE 4: `03_BASE_ENTORNO_ENV` {#fase-4-03_base_entorno_env}

### **Objetivo de la fase:** Centralizar variables en `.env`: selector `DB_DIALECT` y un bloque de credenciales por motor (MySQL, PostgreSQL, SQL Server, Oracle). Validar antes del boot.

#### 4.1 — Crear `.env.example` y actualizar `.env` completo

![](images/clipboard-4286937071.png)

#### 4.2 — Interface de entorno

**Archivo:** `src/config/environment/env.interface.ts`

![](images/clipboard-1778451848.png)

#### 4.3 — Validación de entorno con class-validator

**Archivo:** `src/config/environment/env.validation.ts`

![](images/clipboard-334012108.png)

#### 4.4 — Resolver de credenciales por motor

**Archivo:** `src/config/environment/db-env.ts`

![](images/clipboard-3394449454.png)

#### 4.5 — Factory registerAs de entorno

**Archivo:** `src/config/environment/env.config.ts`

![](images/clipboard-1508642179.png)

------------------------------------------------------------------------

## FASE 5: `04_BASE_DATABASE_SEQUELIZE` {#fase-5-04_base_database_sequelize}

### **Objetivo de la fase:** Conectar Sequelize al motor de `DB_DIALECT` usando el bloque `DB_MYSQL_*` / `DB_POSTGRES_*` / `DB_MSSQL_*` / `DB_ORACLE_*`. Aún sin features (ALL_MODELS vacío).

#### 5.1 — Constante SEQUELIZE_TOKEN

**Archivo:** `src/common/constants/database.constants.ts`

![](images/clipboard-3003663146.png)

#### 5.2 — Tipos auxiliares de database config

**Archivo:** `src/config/database/database.types.ts`

![](images/clipboard-3144200624.png)

#### 5.3 — database.config.ts

**Archivo:** `src/config/database/database.config.ts`

![](images/clipboard-845239652.png)

#### 5.4 — database.module.ts / providers

**Archivo:** `src/config/database/database.module.ts`

#### ![](images/clipboard-1729629101.png)

#### 5.5 — database.providers.ts

**Archivo:** `src/config/database/database.providers.ts`

![](images/clipboard-1281927516.png)

#### 5.6 — Opciones Sequelize por dialecto

**Archivo:** `src/infrastructure/database/sequelize/sequelize.options.ts`

![](images/clipboard-2371518018.png)

#### 5.7 — Factory Sequelize (sin modelos aún)

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-2826245541.png)

#### 5.8 — DatabaseSeederService (sin seeders aún)

**Archivo:** `src/infrastructure/database/seeders/database-seeder.service.ts`

![](images/clipboard-412396631.png)

#### 5.9 — Módulo global Sequelize

**Archivo:** `src/infrastructure/database/sequelize/sequelize.module.ts`

![](images/clipboard-2365360281.png)

#### 5.10 — Verificar conexión a BD

![](images/clipboard-2449092585.png)

------------------------------------------------------------------------

## FASE 6: `05_BASE_APP_COMMON_SECURITY` {#fase-6-05_base_app_common_security}

### **Objetivo de la fase:** Dejar la infraestructura transversal lista antes de la primera entidad de negocio. Aún sin Business/Auth en AppModule y sin guards globales.

#### 6.1 — config/app/app.constants.ts

**Archivo:** `src/config/app/app.constants.ts`

![](images/clipboard-3923299630.png)

#### 6.2 — config/app/app.config.ts

**Archivo:** `src/config/app/app.config.ts`

![](images/clipboard-3400483805.png)

#### 6.3 — config/logger/logger.config.ts

**Archivo:** `src/config/logger/logger.config.ts`

![](images/clipboard-1090104160.png)

#### 6.4 — config/logger/logger.module.ts

**Archivo:** `src/config/logger/logger.module.ts`

![](images/clipboard-473056940.png)

#### 6.5 — config/jwt/jwt.constants.ts

**Archivo:** `src/config/jwt/jwt.constants.ts`

![](images/clipboard-2173381541.png)

#### 6.6 — config/jwt/jwt.config.ts

**Archivo:** `src/config/jwt/jwt.config.ts`

![](images/clipboard-605851505.png)

#### 6.7 — config/swagger/swagger.constants.ts

**Archivo:** `src/config/swagger/swagger.constants.ts`

![](images/clipboard-3915734812.png)

#### 6.8 — config/swagger/swagger.config.ts

**Archivo:** `src/config/swagger/swagger.config.ts`

![](images/clipboard-4071985303.png)

#### 6.9 — common/enums/status.enum.ts

**Archivo:** `src/common/enums/status.enum.ts`

![](images/clipboard-2368705527.png)

#### 6.10 — common/enums/http-method.enum.ts

**Archivo:** `src/common/enums/http-method.enum.ts`

![](images/clipboard-2584585628.png)

#### 6.11 — common/enums/sort-order.enum.ts

**Archivo:** `src/common/enums/sort-order.enum.ts`

![](images/clipboard-1376041380.png)

#### 6.12 — common/constants/app.constants.ts

**Archivo:** `src/common/constants/app.constants.ts`

![](images/clipboard-1293239555.png)

#### 6.13 — common/constants/pagination.constants.ts

**Archivo:** `src/common/constants/pagination.constants.ts`

![](images/clipboard-1612738389.png)

#### 6.14 — common/exceptions/application.exception.ts

**Archivo:** `src/common/exceptions/application.exception.ts`

![](images/clipboard-3615671173.png)

#### 6.15 — common/exceptions/domain.exception.ts

**Archivo:** `src/common/exceptions/domain.exception.ts`

![](images/clipboard-3664639502.png)

#### 6.16 — common/exceptions/entity-not-found.exception.ts

**Archivo:** `src/common/exceptions/entity-not-found.exception.ts`

![](images/clipboard-2034427598.png)

#### 6.17 — common/exceptions/validation.exception.ts

**Archivo:** `src/common/exceptions/validation.exception.ts`

![](images/clipboard-3507543829.png)

#### 6.18 — common/filters/global-exception.filter.ts

**Archivo:** `src/common/filters/global-exception.filter.ts`

![](images/clipboard-3503019339.png)

#### 6.19 — common/filters/sequelize-exception.filter.ts

**Archivo:** `src/common/filters/sequelize-exception.filter.ts`

![](images/clipboard-3950385940.png)

#### 6.20 — common/interceptors/response.interceptor.ts

**Archivo:** `src/common/interceptors/response.interceptor.ts`

![](images/clipboard-2534416736.png)

#### 6.21 — common/interceptors/logging.interceptor.ts

**Archivo:** `src/common/interceptors/logging.interceptor.ts`

![](images/clipboard-1743918062.png)

#### 6.22 — common/interceptors/timeout.interceptor.ts

**Archivo:** `src/common/interceptors/timeout.interceptor.ts`

![](images/clipboard-2114098301.png)

#### 6.23 — common/pipes/validation.pipe.ts

**Archivo:** `src/common/pipes/validation.pipe.ts`

![](images/clipboard-2194143402.png)

#### 6.24 — common/pipes/parse-positive-int.pipe.ts

**Archivo:** `src/common/pipes/parse-positive-int.pipe.ts`

![](images/clipboard-482923171.png)

#### 6.25 — common/decorators/public.decorator.ts

**Archivo:** `src/common/decorators/public.decorator.ts`

![](images/clipboard-3190035947.png)

#### 6.26 — common/decorators/roles.decorator.ts

**Archivo:** `src/common/decorators/roles.decorator.ts`

#### ![](images/clipboard-3622196574.png)

#### 6.27 — common/decorators/current-user.decorator.ts

**Archivo:** `src/common/decorators/current-user.decorator.ts`

![](images/clipboard-1302710967.png)

#### 6.28 — common/decorators/resource.decorator.ts

**Archivo:** `src/common/decorators/resource.decorator.ts`

![](images/clipboard-2038885873.png)

#### 6.29 — common/interfaces/authenticated-user.interface.ts

**Archivo:** `src/common/interfaces/authenticated-user.interface.ts`

![](images/clipboard-2233185964.png)

#### 6.30 — common/interfaces/pagination.interface.ts

**Archivo:** `src/common/interfaces/pagination.interface.ts`

![](images/clipboard-3035829082.png)

#### 6.31 — common/interfaces/api-response.interface.ts

**Archivo:** `src/common/interfaces/api-response.interface.ts`

![](images/clipboard-449959069.png)

#### 6.32 — common/types/nullable.type.ts

**Archivo:** `src/common/types/nullable.type.ts`

![](images/clipboard-1241693955.png)

#### 6.33 — common/types/optional.type.ts

**Archivo:** `src/common/types/optional.type.ts`

![](images/clipboard-754428442.png)

#### 6.34 — common/utils/pagination.util.ts

**Archivo:** `src/common/utils/pagination.util.ts`

![](images/clipboard-3647316464.png)

#### 6.35 — common/utils/date.util.ts

**Archivo:** `src/common/utils/date.util.ts`

![](images/clipboard-1734429927.png)

#### 6.36 — common/utils/string.util.ts

**Archivo:** `src/common/utils/string.util.ts`

![](images/clipboard-1340321766.png)

#### 6.37 — infrastructure/security/hashing/password-hasher.interface.ts

**Archivo:** `src/infrastructure/security/hashing/password-hasher.interface.ts`

![](images/clipboard-194140270.png)

#### 6.38 — infrastructure/security/hashing/bcrypt-password-hasher.service.ts

**Archivo:** `src/infrastructure/security/hashing/bcrypt-password-hasher.service.ts`

![](images/clipboard-1555029951.png)

#### 6.39 — infrastructure/security/tokens/token.interface.ts

**Archivo:** `src/infrastructure/security/tokens/token.interface.ts`

![](images/clipboard-3595858040.png)

#### 6.40 — infrastructure/security/tokens/token.service.ts

**Archivo:** `src/infrastructure/security/tokens/token.service.ts`

![](images/clipboard-1148571801.png)

#### 6.41 — infrastructure/security/security.module.ts

**Archivo:** `src/infrastructure/security/security.module.ts`

![](images/clipboard-3116395688.png)

#### 6.42 — Actualizar main.ts (bootstrap completo)

**Archivo:** `src/main.ts`

![](images/clipboard-2461679055.png)

#### 6.43 — Actualizar app.module.ts (base sin features ni guards)

**Archivo:** `src/app.module.ts`

![](images/clipboard-3988398871.png)

#### 6.44.1 — Correcion de archivos .ts a js.

El problema inicial fue de configuración de módulos. El proyecto utiliza NestJS en modo ESM, por lo que TypeScript debía estar configurado para resolver módulos usando `NodeNext`. Al no estar alineada la configuración, aparecieron errores `TS2307` porque los imports locales no se resolvían correctamente.

La solución fue mantener la configuración ESM del proyecto y configurar TypeScript con `NodeNext`. Además, se corrigieron los imports relativos para incluir la extensión `.js`, requerida por Node.js cuando se trabaja con ESM aunque los archivos fuente sean `.ts`.

Después, al iniciar la aplicación, apareció el error `ReferenceError: require is not defined` en la fábrica de Sequelize. Esto ocurre porque `require` no existe de forma global en ESM. Se solucionó usando `createRequire`, que permite cargar dinámicamente el driver correspondiente de la base de datos.

Archivos modificados, en orden:

1.  `tsconfig.json`

    - Se configuró:

``` typescript
"module": "nodenext", 
"moduleResolution": "nodenext"
```

2.  `tsconfig.build.json`

    - Se dejó extendiendo `tsconfig.json`, con:

``` typescript
"compilerOptions": {   
    "rootDir": "./src" 
}
```

3.  Archivos dentro de `src`

    - Se actualizaron imports relativos para terminar en `.js`.

``` typescript
import { AppModule } from './app.module.js'; 
import { envConfig } from './config/environment/env.config.js';
```

4.  `src/infrastructure/database/sequelize/sequelize.factory.ts`

    - Se agregó soporte para `require` compatible con ESM:

``` typescript
import { createRequire } from 'node:module'; 

const require = createRequire(import.meta.url);
```

Comandos ejecutados:

``` bash
pwd ls -la src/app.module.ts src/config/environment/env.config.ts 
npx tsc --showConfig 
git diff -- src 
find src -name '*.ts' -exec sed -i 's/\.js\.js/\.js/g' {} + grep -R '\.js\.js' src rm -rf dist 
npm run start:dev
```

#### 6.44 — Verificar bootstrap transversal

![](images/clipboard-1618933776.png)

![](images/clipboard-216055138.png)

------------------------------------------------------------------------

## FASE 7: `06_BUSINESS_PATIENTS` {#fase-7-06_business_patients}

### **Objetivo de la fase:** Primera entidad de negocio real. Orden: dominio → infraestructura → aplicación → presentación → módulo → cableado → verificación.

#### 7.1 — Entidad de dominio

**Archivo:** `src/features/business/patients/domain/entities/patient.entity.ts`

![](images/clipboard-3814066931.png)

#### 7.2 — Excepción: documento duplicado

**Archivo:** `src/features/business/patients/domain/exceptions/patient-document-already-exists.exception.ts`

![](images/clipboard-3670536466.png)

#### 7.3 — Excepción: paciente no encontrado

**Archivo:** `src/features/business/patients/domain/exceptions/patient-not-found.exception.ts`

![](images/clipboard-14091350.png)

#### 7.4 — Interfaz de repositorio

**Archivo:** `src/features/business/patients/domain/interfaces/patient-repository.interface.ts`

![](images/clipboard-10119738.png)

#### 7.5 — Validador de documento

**Archivo:** `src/features/business/patients/domain/validators/patient-document.validator.ts`

![](images/clipboard-2314033959.png)

#### 7.6 — Validador de contacto

**Archivo:** `src/features/business/patients/domain/validators/patient-contact.validator.ts`

![](images/clipboard-1887235088.png)

#### 7.7 — Modelo Sequelize

**Archivo:** `src/features/business/patients/infrastructure/persistence/models/patient.model.ts`

![](images/clipboard-391499701.png)

#### 7.8 — Repositorio de infraestructura

**Archivo:** `src/features/business/patients/infrastructure/persistence/repositories/patient.repository.ts`

![](images/clipboard-1565099425.png)

#### 7.9 — Migración

**Archivo:** `src/features/business/patients/infrastructure/persistence/migrations/create-patients-table.migration.ts`

![](images/clipboard-3349638977.png)

#### 7.10 — Seeder

**Archivo:** `src/features/business/patients/infrastructure/persistence/seeders/patients.seeder.ts`

![](images/clipboard-2926836498.png)

#### 7.11 — DTO de filtro

**Archivo:** `src/features/business/patients/application/dto/patient-filter.dto.ts`

![](images/clipboard-3371537884.png)

#### 7.12 — DTO de respuesta

**Archivo:** `src/features/business/patients/application/dto/patient-response.dto.ts`

![](images/clipboard-944493718.png)

#### 7.13 — DTO de creación

**Archivo:** `src/features/business/patients/application/dto/create-patient.dto.ts`

![](images/clipboard-543690936.png)

#### 7.14 — DTO de actualización

**Archivo:** `src/features/business/patients/application/dto/update-patient.dto.ts`

![](images/clipboard-4077661074.png)

#### 7.15 — Mapper

**Archivo:** `src/features/business/patients/application/mappers/patient.mapper.ts`

![](images/clipboard-3637310304.png)

#### 7.16 — Use-case: crear paciente

**Archivo:** `src/features/business/patients/application/use-cases/create-patient.use-case.ts`

![](images/clipboard-1213359149.png)

#### 7.17 — Use-case: eliminar paciente

**Archivo:** `src/features/business/patients/application/use-cases/delete-patient.use-case.ts`

![](images/clipboard-1154657984.png)

#### 7.18 — Use-case: obtener paciente

**Archivo:** `src/features/business/patients/application/use-cases/get-patient.use-case.ts`

![](images/clipboard-582404623.png)

#### 7.19 — Use-case: listar pacientes

**Archivo:** `src/features/business/patients/application/use-cases/list-patients.use-case.ts`

![](images/clipboard-2659283141.png)

#### 7.20 — Use-case: actualizar paciente

**Archivo:** `src/features/business/patients/application/use-cases/update-patient.use-case.ts`

![](images/clipboard-2625058706.png)

#### 7.21 — Serializer

**Archivo:** `src/features/business/patients/presentation/http/serializers/patient.serializer.ts`

![](images/clipboard-845051458.png)

#### 7.22 — Controller

**Archivo:** `src/features/business/patients/presentation/http/controllers/patients.controller.ts`

![](images/clipboard-3815057823.png)

#### 7.23 — Barrel `index.ts`

**Archivo:** `src/features/business/patients/index.ts`

![](images/clipboard-3007966731.png)

#### 7.24 — Módulo `patients.module.ts`

**Archivo:** `src/features/business/patients/patients.module.ts`

![](images/clipboard-923850090.png)

#### 7.25 — Registrar `PatientModel` en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-3683822868.png)

#### 7.26 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-2288402048.png)

#### 7.27 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-2010156917.png)

#### 7.28 — Actualizar `app.module.ts`

**Archivo:** `src/app.module.ts`

![](images/clipboard-2278087678.png)

#### 7.29 — Verificar tabla física `patients` y API

![](images/clipboard-133971602.png)

------------------------------------------------------------------------

## FASE 8: `07_BUSINESS_SPECIALTIES` {#fase-8-07_business_specialties}

### **Objetivo de la fase:** Catálogo de especialidades médicas (`nombre`, `descripcion`, `is_active`), sin relaciones salientes propias — es referenciada por `DoctorSpecialties` en la Fase 10.

#### 8.1 — Entidad de dominio

**Archivo:** `src/features/business/specialties/domain/entities/specialty.entity.ts`

![](images/clipboard-4036040989.png)

#### 8.2 — Excepción: especialidad no encontrada

**Archivo:** `src/features/business/specialties/domain/exceptions/specialty-not-found.exception.ts`

![](images/clipboard-709219115.png)

#### 8.3 — Excepción: nombre duplicado

**Archivo:** `src/features/business/specialties/domain/exceptions/specialty-name-already-exists.exception.ts`

![](images/clipboard-2374906236.png)

#### 8.4 — Interfaz de repositorio

**Archivo:** `src/features/business/specialties/domain/interfaces/specialty-repository.interface.ts`

![](images/clipboard-4229316524.png)

#### 8.5 — Modelo Sequelize

**Archivo:** `src/features/business/specialties/infrastructure/persistence/models/specialty.model.ts`

![](images/clipboard-3949817157.png)

#### 8.6 — Repositorio de infraestructura

**Archivo:** `src/features/business/specialties/infrastructure/persistence/repositories/specialty.repository.ts`

![](images/clipboard-1411980706.png)

#### 8.7 — Migración

**Archivo:** `src/features/business/specialties/infrastructure/persistence/migrations/create-specialties-table.migration.ts`

![](images/clipboard-3065602283.png)

#### 8.8 — Seeder

**Archivo:** `src/features/business/specialties/infrastructure/persistence/seeders/specialties.seeder.ts`

![](images/clipboard-731655275.png)

#### 8.9 — DTOs (filtro, respuesta, creación, actualización)

**Archivo:** `src/features/business/specialties/application/dto/specialty-filter.dto.ts`

![](images/clipboard-1815061801.png)

**Archivo:** `src/features/business/specialties/application/dto/specialty-response.dto.ts`

![**Archivo:** `src/features/business/specialties/application/dto/create-specialty.dto.ts`](images/clipboard-3664023027.png)

![](images/clipboard-1870699758.png)

**Archivo:** `src/features/business/specialties/application/dto/update-specialty.dto.ts`

![](images/clipboard-912986437.png)

#### 8.10 — Mapper

**Archivo:** `src/features/business/specialties/application/mappers/specialty.mapper.ts`

![](images/clipboard-2846066935.png)

#### 8.11 — Use-case: crear especialidad

**Archivo:** `src/features/business/specialties/application/use-cases/create-specialty.use-case.ts`

![](images/clipboard-4239378455.png)

#### 8.12 — Use-case: eliminar especialidad

**Archivo:** `src/features/business/specialties/application/use-cases/delete-specialty.use-case.ts`

![](images/clipboard-1625963837.png)

#### 8.13 — Use-case: obtener especialidad

**Archivo:** `src/features/business/specialties/application/use-cases/get-specialty.use-case.ts`

![](images/clipboard-2987961199.png)

#### 8.14 — Use-case: listar especialidades

**Archivo:** `src/features/business/specialties/application/use-cases/list-specialties.use-case.ts`

![](images/clipboard-204732368.png)

#### 8.15 — Use-case: actualizar especialidad

**Archivo:** `src/features/business/specialties/application/use-cases/update-specialty.use-case.ts`

![](images/clipboard-1387353211.png)

#### 8.16 — Serializer

**Archivo:** `src/features/business/specialties/presentation/http/serializers/specialty.serializer.ts`

![](images/clipboard-2694635987.png)

#### 8.17 — Controller

**Archivo:** `src/features/business/specialties/presentation/http/controllers/specialties.controller.ts`

![](images/clipboard-844237264.png)

#### 8.18 — Barrel, módulo y cableado

**Archivo:** `src/features/business/specialties/index.ts`

![](images/clipboard-4003216314.png)

**Archivo:** `src/features/business/specialties/specialties.module.ts`

![](images/clipboard-3343330776.png)

#### 8.19 — Registrar en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-1419556341.png)

#### 8.20 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-2917465803.png)

#### 8.21 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-134408047.png)

#### 8.22 — Verificar tabla física `specialties` y API

![](images/clipboard-1995220257.png)

![](images/clipboard-1223402139.png)

------------------------------------------------------------------------

## FASE 9: `08_BUSINESS_DOCTORS` {#fase-9-08_business_doctors}

### **Objetivo de la fase:** Entidad Medico. Su relación N:M con Especialidad se resuelve en la Fase 10 (`DoctorSpecialties`), una vez que ambos modelos (`DoctorModel` y `SpecialtyModel`) ya existen.

#### 9.1 — Entidad de dominio

**Archivo:** `src/features/business/doctors/domain/entities/doctor.entity.ts`

![](images/clipboard-3874157117.png)

#### 9.2 — Excepción: médico no encontrado

**Archivo:** `src/features/business/doctors/domain/exceptions/doctor-not-found.exception.ts`

![](images/clipboard-847066394.png)

#### 9.3 — Interfaz de repositorio

**Archivo:** `src/features/business/doctors/domain/interfaces/doctor-repository.interface.ts`

![](images/clipboard-3394553855.png)

#### 9.4 — Modelo Sequelize

**Archivo:** `src/features/business/doctors/infrastructure/persistence/models/doctor.model.ts`

![](images/clipboard-1176963800.png)

#### 9.5 — Repositorio de infraestructura

**Archivo:** `src/features/business/doctors/infrastructure/persistence/repositories/doctor.repository.ts`

![](images/clipboard-4148223849.png)

#### 9.6 — Migración

**Archivo:** `src/features/business/doctors/infrastructure/persistence/migrations/create-doctors-table.migration.ts`

![](images/clipboard-682313176.png)

#### 9.7 — Seeder

**Archivo:** `src/features/business/doctors/infrastructure/persistence/seeders/doctors.seeder.ts`

![](images/clipboard-1104709237.png)

#### 9.8 — DTO filtro

**Archivo:** `src/features/business/doctors/application/dto/doctor-filter.dto.ts`

![](images/clipboard-3116398373.png)

#### 9.9 — DTO respuesta

**Archivo:** `src/features/business/doctors/application/dto/doctor-response.dto.ts`

![](images/clipboard-1122573904.png)

#### 9.10 — DTO creación

**Archivo:** `src/features/business/doctors/application/dto/create-doctor.dto.ts`

![](images/clipboard-3153746762.png)

#### 9.11 — DTO actualización

**Archivo:** `src/features/business/doctors/application/dto/update-doctor.dto.ts`

![](images/clipboard-1935717206.png)

#### 9.12 — Mapper

**Archivo:** `src/features/business/doctors/application/mappers/doctor.mapper.ts`

![](images/clipboard-4206607647.png)

#### 9.13 — Use-case: crear médico

**Archivo:** `src/features/business/doctors/application/use-cases/create-doctor.use-case.ts`

![](images/clipboard-737367008.png)

#### 9.14 — Use-case: eliminar médico

**Archivo:** `src/features/business/doctors/application/use-cases/delete-doctor.use-case.ts`

![](images/clipboard-3879785435.png)

#### 9.15 — Use-case: obtener médico

**Archivo:** `src/features/business/doctors/application/use-cases/get-doctor.use-case.ts`

![](images/clipboard-1361212684.png)

#### 9.16 — Use-case: listar médicos

**Archivo:** `src/features/business/doctors/application/use-cases/list-doctors.use-case.ts`

![](images/clipboard-502330834.png)

#### 9.17 — Use-case: actualizar médico

**Archivo:** `src/features/business/doctors/application/use-cases/update-doctor.use-case.ts`

![](images/clipboard-1791063202.png)

#### 9.18 — Serializer

**Archivo:** `src/features/business/doctors/presentation/http/serializers/doctor.serializer.ts`

![](images/clipboard-3472537514.png)

#### 9.19 — Controller

**Archivo:** `src/features/business/doctors/presentation/http/controllers/doctors.controller.ts`

![](images/clipboard-2764228925.png)

#### 9.20 — Barrel, módulo y cableado

**Archivo:** `src/features/business/doctors/index.ts`

![](images/clipboard-1526553284.png)

**Archivo:** `src/features/business/doctors/doctors.module.ts`

![](images/clipboard-789137623.png)

#### 9.21 — Registrar en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-2989967567.png)

#### 9.22 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-112486929.png)

#### 9.23 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-1191558252.png)

#### 9.24 — Verificar tabla física `doctors` y API

![![](images/clipboard-3400602838.png)](images/clipboard-2921708135.png)

------------------------------------------------------------------------

## FASE 10: `09_BUSINESS_DOCTOR_SPECIALTIES` {#fase-10-09_business_doctor_specialties}

### **Objetivo de la fase:** Resolver la relación N:M `Medico ↔ Especialidad`. Requiere que `DoctorModel` (Fase 9) y `SpecialtyModel` (Fase 8) ya existan — por eso se implementa después de ambos. `principal_id` referencia a `doctors`, `relacionado_id` referencia a `specialties`, y `datos_relacion` guarda metadatos propios de la relación (ej. fecha de habilitación).

#### 10.1 — Entidad de dominio

**Archivo:** `src/features/business/doctor-specialties/domain/entities/doctor-specialty.entity.ts`

![](images/clipboard-883011185.png)

#### 10.2 — Excepción: relación duplicada

**Archivo:** `src/features/business/doctor-specialties/domain/exceptions/doctor-specialty-already-exists.exception.ts`

![](images/clipboard-1243894878.png)

#### 10.3 — Excepción: relación no encontrada

**Archivo:** `src/features/business/doctor-specialties/domain/exceptions/doctor-specialty-not-found.exception.ts`

![](images/clipboard-97298628.png)

#### 10.4 — Interfaz de repositorio

**Archivo:** `src/features/business/doctor-specialties/domain/interfaces/doctor-specialty-repository.interface.ts`

![](images/clipboard-3152666681.png)

#### 10.5 — Modelo Sequelize (con asociaciones a Doctor y Specialty, ya existentes)

**Archivo:** `src/features/business/doctor-specialties/infrastructure/persistence/models/doctor-specialty.model.ts`

![](images/clipboard-2688348035.png)

#### 10.6 — Repositorio de infraestructura

**Archivo:** `src/features/business/doctor-specialties/infrastructure/persistence/repositories/doctor-specialty.repository.ts`

![](images/clipboard-1080111412.png)

#### 10.7 — Migración (con FKs a `doctors` y `specialties`)

**Archivo:** `src/features/business/doctor-specialties/infrastructure/persistence/migrations/create-doctor-specialties-table.migration.ts`

![](images/clipboard-1935346972.png)

#### 10.8 — Seeder (usa los ids sembrados de Doctors y Specialties)

**Archivo:** `src/features/business/doctor-specialties/infrastructure/persistence/seeders/doctor-specialties.seeder.ts`

![](images/clipboard-139130002.png)

#### 10.9 — DTO de filtro

**Archivo:** `src/features/business/doctor-specialties/application/dto/doctor-specialty-filter.dto.ts`

![](images/clipboard-1935422337.png)

#### 10.10 — DTO de respuesta

**Archivo:** `src/features/business/doctor-specialties/application/dto/doctor-specialty-response.dto.ts`

![](images/clipboard-3626468020.png)

#### 10.11 — DTO de creación

**Archivo:** `src/features/business/doctor-specialties/application/dto/create-doctor-specialty.dto.ts`

![](images/clipboard-1171551054.png)

#### 10.12 — Mapper

**Archivo:** `src/features/business/doctor-specialties/application/mappers/doctor-specialty.mapper.ts`

![](images/clipboard-1276533739.png)

#### 10.13 — Use-case: asignar especialidad a médico

**Archivo:** `src/features/business/doctor-specialties/application/use-cases/create-doctor-specialty.use-case.ts`

![](images/clipboard-1460173133.png)

#### 10.14 — Use-case: quitar especialidad de médico

**Archivo:** `src/features/business/doctor-specialties/application/use-cases/delete-doctor-specialty.use-case.ts`

![](images/clipboard-600885170.png)

#### 10.15 — Use-case: listar relaciones médico-especialidad

**Archivo:** `src/features/business/doctor-specialties/application/use-cases/list-doctor-specialties.use-case.ts`

![](images/clipboard-2645415495.png)

#### 10.16 — Serializer

**Archivo:** `src/features/business/doctor-specialties/presentation/http/serializers/doctor-specialty.serializer.ts`

![](images/clipboard-1882360456.png)

#### 10.17 — Controller

**Archivo:** `src/features/business/doctor-specialties/presentation/http/controllers/doctor-specialties.controller.ts`

![](images/clipboard-1383031572.png)

#### 10.18 — Barrel `index.ts`

**Archivo:** `src/features/business/doctor-specialties/index.ts`

![](images/clipboard-4255625028.png)

#### 10.19 — Módulo `doctor-specialties.module.ts`

**Archivo:** `src/features/business/doctor-specialties/doctor-specialties.module.ts`

![](images/clipboard-3553720707.png)

#### 10.20 — Registrar en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-1325045534.png)

#### 10.21 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-3180499516.png)

#### 10.22 — Actualizar `database-seeder.service.ts` (orden: doctors → specialties → doctor_specialties)

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-2044096693.png)

#### 10.23 — Verificar tabla física `doctor_specialties` y API

![![](images/clipboard-1116631913.png)](images/clipboard-1558539880.png)

------------------------------------------------------------------------

## FASE 11: `10_BUSINESS_SERVICES` {#fase-11-10_business_services}

### **Objetivo de la fase:** Catálogo de servicios clínicos, referenciado luego por `Encounters` (Fase 15: `Servicio 1:N Atencion`).

#### 11.1 — Entidad de dominio

**Archivo:** `src/features/business/services/domain/entities/service.entity.ts`

![](images/clipboard-541589824.png)

#### 11.2 — Excepción: servicio no encontrado

**Archivo:** `src/features/business/services/domain/exceptions/service-not-found.exception.ts`

![](images/clipboard-1513165492.png)

#### 11.3 — Excepción: nombre de servicio duplicado

**Archivo:** `src/features/business/services/domain/exceptions/service-name-already-exists.exception.ts`

![](images/clipboard-971937387.png)

#### 11.4 — Interfaz de repositorio

**Archivo:** `src/features/business/services/domain/interfaces/service-repository.interface.ts`

![](images/clipboard-2732653662.png)

#### 11.5 — Modelo Sequelize

**Archivo:** `src/features/business/services/infrastructure/persistence/models/service.model.ts`

![](images/clipboard-1791473539.png)

#### 11.6 — Repositorio de infraestructura

**Archivo:** `src/features/business/services/infrastructure/persistence/repositories/service.repository.ts`

![](images/clipboard-520134851.png)

#### 11.7 — Migración

**Archivo:** `src/features/business/services/infrastructure/persistence/migrations/create-services-table.migration.ts`

![](images/clipboard-1966386688.png)

#### 11.8 — Seeder

**Archivo:** `src/features/business/services/infrastructure/persistence/seeders/services.seeder.ts`

![](images/clipboard-3863246267.png)

#### 11.9 — DTO de filtro

**Archivo:** `src/features/business/services/application/dto/service-filter.dto.ts`

![](images/clipboard-1920730475.png)

#### 11.10 — DTO de respuesta

**Archivo:** `src/features/business/services/application/dto/service-response.dto.ts`

![](images/clipboard-251644431.png)

#### 11.11 — DTO de creación

**Archivo:** `src/features/business/services/application/dto/create-service.dto.ts`

![](images/clipboard-4090505670.png)

#### 11.12 — DTO de actualización

**Archivo:** `src/features/business/services/application/dto/update-service.dto.ts`

![](images/clipboard-1324242416.png)

#### 11.13 — Mapper

**Archivo:** `src/features/business/services/application/mappers/service.mapper.ts`

![](images/clipboard-4264217520.png)

#### 11.14 — Use-case: crear servicio

**Archivo:** `src/features/business/services/application/use-cases/create-service.use-case.ts`

![](images/clipboard-3817425780.png)

#### 11.15 — Use-case: obtener servicio

**Archivo:** `src/features/business/services/application/use-cases/get-service.use-case.ts`

![](images/clipboard-1072766959.png)

#### 11.16 — Use-case: listar servicios

**Archivo:** `src/features/business/services/application/use-cases/list-services.use-case.ts`

![](images/clipboard-2408572411.png)

#### 11.17 — Use-case: actualizar servicio

**Archivo:** `src/features/business/services/application/use-cases/update-service.use-case.ts`

![](images/clipboard-4042430704.png)

#### 11.18 — Use-case: eliminar servicio

**Archivo:** `src/features/business/services/application/use-cases/delete-service.use-case.ts`

![](images/clipboard-2670921466.png)

#### 11.19 — Serializer

**Archivo:** `src/features/business/services/presentation/http/serializers/service.serializer.ts`

![](images/clipboard-46209851.png)

#### 11.20 — Controller

**Archivo:** `src/features/business/services/presentation/http/controllers/services.controller.ts`

![](images/clipboard-76533410.png)

#### 11.21 — Barrel `index.ts`

**Archivo:** `src/features/business/services/index.ts`

![](images/clipboard-1964295835.png)

#### 11.22 — Módulo `services.module.ts`

**Archivo:** `src/features/business/services/services.module.ts`

![](images/clipboard-3815497138.png)

#### 11.23 — Registrar en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-307484914.png)

#### 11.24 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-2386314622.png)

#### 11.25 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-3014431907.png)

#### 11.26 — Verificar tabla física `services` y API

![](images/clipboard-2461838265.png)

![](images/clipboard-3257488065.png)

------------------------------------------------------------------------

## FASE 12: `11_BUSINESS_AGENDAS` {#fase-12-11_business_agendas}

### **Objetivo de la fase:** Agenda pertenece a un médico (`Medico 1:N Agenda`). Requiere que `DoctorModel` (Fase 9) ya exista.

#### 12.1 — Entidad de dominio

**Archivo:** `src/features/business/agendas/domain/entities/agenda.entity.ts`

![](images/clipboard-1129044384.png)

#### 12.2 — Excepción: agenda no encontrada

**Archivo:** `src/features/business/agendas/domain/exceptions/agenda-not-found.exception.ts`

![](images/clipboard-1479283641.png)

#### 12.3 — Interfaz de repositorio

**Archivo:** `src/features/business/agendas/domain/interfaces/agenda-repository.interface.ts`

![](images/clipboard-291919451.png)

#### 12.4 — Modelo Sequelize (con FK a Doctor)

**Archivo:** `src/features/business/agendas/infrastructure/persistence/models/agenda.model.ts`

![](images/clipboard-2344709770.png)

#### 12.5 — Repositorio de infraestructura

**Archivo:** `src/features/business/agendas/infrastructure/persistence/repositories/agenda.repository.ts`

![](images/clipboard-3993194374.png)

#### 12.6 — Migración (con FK a `doctors`)

**Archivo:** `src/features/business/agendas/infrastructure/persistence/migrations/create-agendas-table.migration.ts`

![](images/clipboard-3963155581.png)

#### 12.7 — Seeder (usa ids sembrados de Doctors)

**Archivo:** `src/features/business/agendas/infrastructure/persistence/seeders/agendas.seeder.ts`

![](images/clipboard-3155268584.png)

#### 12.8 — DTO de filtro

**Archivo:** `src/features/business/agendas/application/dto/agenda-filter.dto.ts`

![](images/clipboard-3603531602.png)

#### 12.9 — DTO de respuesta

**Archivo:** `src/features/business/agendas/application/dto/agenda-response.dto.ts`

![](images/clipboard-3741761345.png)

#### 12.10 — DTO de creación

**Archivo:** `src/features/business/agendas/application/dto/create-agenda.dto.ts`

![](images/clipboard-1809118509.png)

#### 12.11 — DTO de actualización

**Archivo:** `src/features/business/agendas/application/dto/update-agenda.dto.ts`

![](images/clipboard-748315995.png)

#### 12.12 — Mapper

**Archivo:** `src/features/business/agendas/application/mappers/agenda.mapper.ts`

![](images/clipboard-1423238478.png)

#### 12.13 — Use-case: crear agenda

**Archivo:** `src/features/business/agendas/application/use-cases/create-agenda.use-case.ts`

![](images/clipboard-3418384137.png)

#### 12.14 — Use-case: eliminar agenda

**Archivo:** `src/features/business/agendas/application/use-cases/delete-agenda.use-case.ts`

![](images/clipboard-2542704223.png)

#### 12.15 — Use-case: obtener agenda

**Archivo:** `src/features/business/agendas/application/use-cases/get-agenda.use-case.ts`

![](images/clipboard-549562940.png)

#### 12.16 — Use-case: listar agendas

**Archivo:** `src/features/business/agendas/application/use-cases/list-agendas.use-case.ts`

![](images/clipboard-448049652.png)

#### 12.17 — Use-case: actualizar agenda

**Archivo:** `src/features/business/agendas/application/use-cases/update-agenda.use-case.ts`

![](images/clipboard-2889558332.png)

#### 12.18 — Serializer

**Archivo:** `src/features/business/agendas/presentation/http/serializers/agenda.serializer.ts`

![](images/clipboard-884873707.png)

#### 12.19 — Controller

**Archivo:** `src/features/business/agendas/presentation/http/controllers/agendas.controller.ts`

![](images/clipboard-991127381.png)

#### 12.20 — Barrel `index.ts`

**Archivo:** `src/features/business/agendas/index.ts`

![](images/clipboard-3861803298.png)

#### 12.21 — Módulo `agendas.module.ts`

**Archivo:** `src/features/business/agendas/agendas.module.ts`

![](images/clipboard-3051750504.png)

#### 12.22 — Registrar `AgendaModel` en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-937427398.png)

#### 12.23 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-3537679315.png)

#### 12.24 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-2912024320.png)

#### 12.25 — Verificar tabla física `agendas` y API

![](images/clipboard-791417835.png)

![](images/clipboard-2274054480.png)

------------------------------------------------------------------------

## FASE 13: `12_BUSINESS_APPOINTMENTS` {#fase-13-12_business_appointments}

### **Objetivo de la fase:** Cita depende de Patient (Fase 7) y Agenda (Fase 12), ambas ya existentes. Maneja su propio ciclo de vida (`PROGRAMADA` → `ATENDIDA` / `CANCELADA` / `NO_ASISTIO`), distinto del campo `is_active` de catálogo. La transición a `ATENDIDA` la dispara el use-case de Encounters en la Fase 15 — aquí solo se define el método de dominio que lo permite.

#### 13.1 — Enum de estado de cita

**Archivo:** `src/features/business/appointments/domain/enums/appointment-status.enum.ts`

![](images/clipboard-1803979149.png)

#### 13.2 — Entidad de dominio

**Archivo:** `src/features/business/appointments/domain/entities/appointment.entity.ts`

![](images/clipboard-1063233348.png)

#### 13.3 — Excepción: cita no encontrada

**Archivo:** `src/features/business/appointments/domain/exceptions/appointment-not-found.exception.ts`

![](images/clipboard-1695671849.png)

#### 13.4 — Excepción: transición de estado inválida

**Archivo:** `src/features/business/appointments/domain/exceptions/invalid-appointment-transition.exception.ts`

![](images/clipboard-2117785471.png)

#### 13.5 — Interfaz de repositorio

**Archivo:** `src/features/business/appointments/domain/interfaces/appointment-repository.interface.ts`

![](images/clipboard-3644168166.png)

#### 13.6 — Modelo Sequelize (con FK a Patient y Agenda)

**Archivo:** `src/features/business/appointments/infrastructure/persistence/models/appointment.model.ts`

![](images/clipboard-396727349.png)

#### 13.7 — Repositorio de infraestructura

**Archivo:** `src/features/business/appointments/infrastructure/persistence/repositories/appointment.repository.ts`

![](images/clipboard-2111728441.png)

#### 13.8 — Migración (con FKs a `patients` y `agendas`)

**Archivo:** `src/features/business/appointments/infrastructure/persistence/migrations/create-appointments-table.migration.ts`

![](images/clipboard-2041812576.png)

#### 13.9 — Seeder (usa ids sembrados de Patients y Agendas)

**Archivo:** `src/features/business/appointments/infrastructure/persistence/seeders/appointments.seeder.ts`

![](images/clipboard-1865534403.png)

#### 13.10 — DTO de filtro

**Archivo:** `src/features/business/appointments/application/dto/appointment-filter.dto.ts`

![](images/clipboard-3502530214.png)

#### 13.11 — DTO de respuesta

**Archivo:** `src/features/business/appointments/application/dto/appointment-response.dto.ts`

![](images/clipboard-2557497856.png)

#### 13.12 — DTO de creación

**Archivo:** `src/features/business/appointments/application/dto/create-appointment.dto.ts`

![](images/clipboard-1909847763.png)

#### 13.13 — DTO de reprogramación

**Archivo:** `src/features/business/appointments/application/dto/reschedule-appointment.dto.ts`

![](images/clipboard-617179983.png)

#### 13.14 — Mapper

**Archivo:** `src/features/business/appointments/application/mappers/appointment.mapper.ts`

![](images/clipboard-169306829.png)

#### 13.15 — Use-case: crear (agendar) cita

**Archivo:** `src/features/business/appointments/application/use-cases/create-appointment.use-case.ts`

![](images/clipboard-1102745396.png)

#### 13.16 — Use-case: reprogramar cita

**Archivo:** `src/features/business/appointments/application/use-cases/reschedule-appointment.use-case.ts`

![](images/clipboard-757867419.png)

#### 13.17 — Use-case: cancelar cita

**Archivo:** `src/features/business/appointments/application/use-cases/cancel-appointment.use-case.ts`

![](images/clipboard-698576034.png)

#### 13.18 — Use-case: obtener cita

**Archivo:** `src/features/business/appointments/application/use-cases/get-appointment.use-case.ts`

![](images/clipboard-2772665900.png)

#### 13.19 — Use-case: listar citas

**Archivo:** `src/features/business/appointments/application/use-cases/list-appointments.use-case.ts`

![](images/clipboard-79024187.png)

#### 13.20 — Use-case: eliminar cita

**Archivo:** `src/features/business/appointments/application/use-cases/delete-appointment.use-case.ts`

![](images/clipboard-53306192.png)

#### 13.21 — Serializer

**Archivo:** `src/features/business/appointments/presentation/http/serializers/appointment.serializer.ts`

![](images/clipboard-496307131.png)

#### 13.22 — Controller

**Archivo:** `src/features/business/appointments/presentation/http/controllers/appointments.controller.ts`

![](images/clipboard-3027447132.png)

#### 13.23 — Barrel `index.ts`

**Archivo:** `src/features/business/appointments/index.ts`

![](images/clipboard-26545522.png)

#### 13.24 — Módulo `appointments.module.ts`

**Archivo:** `src/features/business/appointments/appointments.module.ts`

![](images/clipboard-1283885247.png)

#### 13.25 — Registrar `AppointmentModel` en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-4006580122.png)

#### 13.26 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-45299035.png)

#### 13.27 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-1401342032.png)

#### 13.28 — Verificar tabla física `appointments` y API

![![](images/clipboard-2307536974.png)](images/clipboard-1628073598.png)

------------------------------------------------------------------------

## FASE 14: `13_BUSINESS_AUTHORIZATIONS` {#fase-14-13_business_authorizations}

### Objetivo de la fase: Autorizacion representa el aval de la EPS/convenio para una cita puntual (`Cita 0..1:1 Autorizacion`). Requiere que `AppointmentModel` (Fase 13) ya exista. La FK `appointment_id` es única para expresar la cardinalidad 1:1 opcional.

#### 14.1 — Entidad de dominio

**Archivo:** `src/features/business/authorizations/domain/entities/authorization.entity.ts`

![](images/clipboard-2242990083.png)

#### 14.2 — Excepción: autorización no encontrada

**Archivo:** `src/features/business/authorizations/domain/exceptions/authorization-not-found.exception.ts`

![](images/clipboard-498080842.png)

#### 14.3 — Excepción: la cita ya tiene autorización

**Archivo:** `src/features/business/authorizations/domain/exceptions/appointment-already-authorized.exception.ts`

![](images/clipboard-2179765205.png)

#### 14.4 — Interfaz de repositorio

**Archivo:** `src/features/business/authorizations/domain/interfaces/authorization-repository.interface.ts`

![](images/clipboard-367307612.png)

#### 14.5 — Modelo Sequelize (FK única a Appointment)

**Archivo:** `src/features/business/authorizations/infrastructure/persistence/models/authorization.model.ts`

![](images/clipboard-1592418618.png)

#### 14.6 — Repositorio de infraestructura

**Archivo:** `src/features/business/authorizations/infrastructure/persistence/repositories/authorization.repository.ts`

![](images/clipboard-2203784173.png)

#### 14.7 — Migración (FK única a `appointments`)

**Archivo:** `src/features/business/authorizations/infrastructure/persistence/migrations/create-authorizations-table.migration.ts`

![](images/clipboard-4261791871.png)

#### 14.8 — Seeder (usa una cita ya sembrada)

**Archivo:** `src/features/business/authorizations/infrastructure/persistence/seeders/authorizations.seeder.ts`

![](images/clipboard-2893360910.png)

#### 14.9 — DTO de filtro

**Archivo:** `src/features/business/authorizations/application/dto/authorization-filter.dto.ts`

![](images/clipboard-2607878943.png)

#### 14.10 — DTO de respuesta

**Archivo:** `src/features/business/authorizations/application/dto/authorization-response.dto.ts`

![](images/clipboard-2670644105.png)

#### 14.11 — DTO de creación

**Archivo:** `src/features/business/authorizations/application/dto/create-authorization.dto.ts`

![](images/clipboard-889364158.png)

#### 14.12 — DTO de actualización

**Archivo:** `src/features/business/authorizations/application/dto/update-authorization.dto.ts`

![](images/clipboard-783141371.png)

#### 14.13 — Mapper

**Archivo:** `src/features/business/authorizations/application/mappers/authorization.mapper.ts`

![](images/clipboard-3251017268.png)

#### 14.14 — Use-case: crear autorización

**Archivo:** `src/features/business/authorizations/application/use-cases/create-authorization.use-case.ts`

![](images/clipboard-3215831674.png)

#### 14.15 — Use-case: eliminar autorización

**Archivo:** `src/features/business/authorizations/application/use-cases/delete-authorization.use-case.ts`

![](images/clipboard-3403584406.png)

#### 14.16 — Use-case: obtener autorización

**Archivo:** `src/features/business/authorizations/application/use-cases/get-authorization.use-case.ts`

![](images/clipboard-4276657474.png)

#### 14.17 — Use-case: listar autorizaciones

**Archivo:** `src/features/business/authorizations/application/use-cases/list-authorizations.use-case.ts`

![](images/clipboard-2269218205.png)

#### 14.18 — Use-case: actualizar autorización

**Archivo:** `src/features/business/authorizations/application/use-cases/update-authorization.use-case.ts`

![](images/clipboard-378751333.png)

#### 14.19 — Serializer

**Archivo:** `src/features/business/authorizations/presentation/http/serializers/authorization.serializer.ts`

![](images/clipboard-4201856750.png)

#### 14.20 — Controller

**Archivo:** `src/features/business/authorizations/presentation/http/controllers/authorizations.controller.ts`

![](images/clipboard-1305832599.png)

#### 14.21 — Barrel `index.ts`

**Archivo:** `src/features/business/authorizations/index.ts`

![](images/clipboard-1639653177.png)

#### 14.22 — Módulo `authorizations.module.ts`

**Archivo:** `src/features/business/authorizations/authorizations.module.ts`

![](images/clipboard-2832694999.png)

#### 14.23 — Registrar `AuthorizationModel` en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-510746442.png)

#### 14.24 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-494838822.png)

#### 14.25 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-930476244.png)

#### 14.26 — Verificar tabla física `authorizations` y API

![](images/clipboard-3917585667.png)

![](images/clipboard-3346721792.png)

------------------------------------------------------------------------

## FASE 15: `14_BUSINESS_CLINICAL_RECORDS` {#fase-15-14_business_clinical_records}

### Objetivo de la fase: HistoriaClinica pertenece a un único paciente (`Paciente 1:1 HistoriaClinica`) y será referenciada por Encounters en la Fase 16 (`HistoriaClinica 1:N Atencion`). Por eso se construye antes que Encounters, invirtiendo el orden original de la tabla de mapeo. Requiere que `PatientModel` (Fase 7) ya exista. Incluye el endpoint `GET /historias/:pacienteId` indicado en el RBAC del PDF.

#### 15.1 — Entidad de dominio

**Archivo:** `src/features/business/clinical-records/domain/entities/clinical-record.entity.ts`

![](images/clipboard-3567733754.png)

#### 15.2 — Excepción: historia clínica no encontrada

**Archivo:** `src/features/business/clinical-records/domain/exceptions/clinical-record-not-found.exception.ts`

![](images/clipboard-215507517.png)

#### 15.3 — Excepción: el paciente ya tiene historia clínica

**Archivo:** `src/features/business/clinical-records/domain/exceptions/patient-already-has-clinical-record.exception.ts`

![](images/clipboard-2948224716.png)

#### 15.4 — Interfaz de repositorio

**Archivo:** `src/features/business/clinical-records/domain/interfaces/clinical-record-repository.interface.ts`

![](images/clipboard-2322420088.png)

#### 15.5 — Modelo Sequelize (FK única a Patient)

**Archivo:** `src/features/business/clinical-records/infrastructure/persistence/models/clinical-record.model.ts`

![](images/clipboard-568709114.png)

#### 15.6 — Repositorio de infraestructura

**Archivo:** `src/features/business/clinical-records/infrastructure/persistence/repositories/clinical-record.repository.ts`

![](images/clipboard-4092854535.png)

#### 15.7 — Migración (FK única a `patients`)

**Archivo:** `src/features/business/clinical-records/infrastructure/persistence/migrations/create-clinical-records-table.migration.ts`

![](images/clipboard-181935930.png)

#### 15.8 — Seeder (una historia clínica por paciente sembrado)

**Archivo:** `src/features/business/clinical-records/infrastructure/persistence/seeders/clinical-records.seeder.ts`

![](images/clipboard-2263520867.png)

#### 15.9 — DTO de filtro

**Archivo:** `src/features/business/clinical-records/application/dto/clinical-record-filter.dto.ts`

![](images/clipboard-1497573982.png)

#### 15.10 — DTO de respuesta

**Archivo:** `src/features/business/clinical-records/application/dto/clinical-record-response.dto.ts`

![](images/clipboard-1773532588.png)

#### 15.11 — DTO de creación

**Archivo:** `src/features/business/clinical-records/application/dto/create-clinical-record.dto.ts`

![](images/clipboard-1800652970.png)

#### 15.12 — DTO de actualización

**Archivo:** `src/features/business/clinical-records/application/dto/update-clinical-record.dto.ts`

![](images/clipboard-3069313213.png)

#### 15.13 — Mapper

**Archivo:** `src/features/business/clinical-records/application/mappers/clinical-record.mapper.ts`

![](images/clipboard-1847734265.png)

#### 15.14 — Use-case: crear historia clínica

**Archivo:** `src/features/business/clinical-records/application/use-cases/create-clinical-record.use-case.ts`

![](images/clipboard-4061182537.png)

#### 15.15 — Use-case: eliminar historia clínica

**Archivo:** `src/features/business/clinical-records/application/use-cases/delete-clinical-record.use-case.ts`

![](images/clipboard-3474834031.png)

#### 15.16 — Use-case: obtener historia clínica por id

**Archivo:** `src/features/business/clinical-records/application/use-cases/get-clinical-record.use-case.ts`

![](images/clipboard-1268696106.png)

#### 15.17 — Use-case: obtener historia clínica por paciente (`GET /historias/:pacienteId`)

**Archivo:** `src/features/business/clinical-records/application/use-cases/get-clinical-record-by-patient.use-case.ts`

![](images/clipboard-2486518115.png)

#### 15.18 — Use-case: listar historias clínicas

**Archivo:** `src/features/business/clinical-records/application/use-cases/list-clinical-records.use-case.ts`

![](images/clipboard-4103466060.png)

#### 15.19 — Use-case: actualizar historia clínica

**Archivo:** `src/features/business/clinical-records/application/use-cases/update-clinical-record.use-case.ts`

![](images/clipboard-314165738.png)

#### 15.20 — Serializer

**Archivo:** `src/features/business/clinical-records/presentation/http/serializers/clinical-record.serializer.ts`

![](images/clipboard-2699611962.png)

#### 15.21 — Controller (incluye `GET /historias/:pacienteId`)

**Archivo:** `src/features/business/clinical-records/presentation/http/controllers/clinical-records.controller.ts`

![](images/clipboard-2921887044.png)

#### 15.22 — Barrel `index.ts`

**Archivo:** `src/features/business/clinical-records/index.ts`

![](images/clipboard-361135820.png)

#### 15.23 — Módulo `clinical-records.module.ts`

**Archivo:** `src/features/business/clinical-records/clinical-records.module.ts`

![](images/clipboard-2201460179.png)

#### 15.24 — Registrar `ClinicalRecordModel` en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-2294734183.png)

#### 15.25 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-3434264203.png)

#### 15.26 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-1235065780.png)

#### 15.27 — Verificar tabla física `clinical_records` y API

![](images/clipboard-1385265418.png)

![](images/clipboard-3815355896.png)

------------------------------------------------------------------------

## FASE 16: `15_BUSINESS_ENCOUNTERS` {#fase-16-15_business_encounters}

### **Objetivo de la fase:** Atencion es el registro clínico de lo ocurrido en una cita (`Cita 0..1:1 Atencion`, `Servicio 1:N Atencion`, `HistoriaClinica 1:N Atencion`). Requiere que `AppointmentModel` (Fase 13), `ServiceModel` (Fase 11) y `ClinicalRecordModel` (Fase 15) ya existan. Al crearse, marca la cita asociada como `ATENDIDA` (regla de negocio del PDF: *"Una cita solo pasa a atendida con profesional, paciente y registro clínico"*).

#### 16.1 — Enum de estado de atención

**Archivo:** `src/features/business/encounters/domain/enums/encounter-status.enum.ts`

![](images/clipboard-2621944187.png)

#### 16.2 — Entidad de dominio

**Archivo:** `src/features/business/encounters/domain/entities/encounter.entity.ts`

![](images/clipboard-1471280638.png)

#### 16.3 — Excepción: atención no encontrada

**Archivo:** `src/features/business/encounters/domain/exceptions/encounter-not-found.exception.ts`

![](images/clipboard-3277904351.png)

#### 16.4 — Excepción: la cita ya tiene atención registrada

**Archivo:** `src/features/business/encounters/domain/exceptions/appointment-already-attended.exception.ts`

![](images/clipboard-1725793003.png)

#### 16.5 — Excepción: la historia clínica no corresponde al paciente de la cita

**Archivo:** `src/features/business/encounters/domain/exceptions/clinical-record-patient-mismatch.exception.ts`

![](images/clipboard-1420906622.png)

#### 16.6 — Interfaz de repositorio

**Archivo:** `src/features/business/encounters/domain/interfaces/encounter-repository.interface.ts`

![](images/clipboard-4011034879.png)

#### 16.7 — Modelo Sequelize (FKs a Appointment, Service y ClinicalRecord)

**Archivo:** `src/features/business/encounters/infrastructure/persistence/models/encounter.model.ts`

![](images/clipboard-1194731527.png)

#### 16.8 — Repositorio de infraestructura

**Archivo:** `src/features/business/encounters/infrastructure/persistence/repositories/encounter.repository.ts`

![](images/clipboard-1075439925.png)

#### 16.9 — Migración (FKs a `appointments`, `services`, `clinical_records`)

**Archivo:** `src/features/business/encounters/infrastructure/persistence/migrations/create-encounters-table.migration.ts`

![](images/clipboard-2240441131.png)

#### 16.10 — Seeder (usa cita, servicio e historia clínica ya sembrados)

**Archivo:** `src/features/business/encounters/infrastructure/persistence/seeders/encounters.seeder.ts`

![](images/clipboard-2062415409.png)

#### 16.11 — DTO de filtro

**Archivo:** `src/features/business/encounters/application/dto/encounter-filter.dto.ts`

![](images/clipboard-2214958483.png)

#### 16.12 — DTO de respuesta

**Archivo:** `src/features/business/encounters/application/dto/encounter-response.dto.ts`

![](images/clipboard-1031323164.png)

#### 16.13 — DTO de creación

**Archivo:** `src/features/business/encounters/application/dto/create-encounter.dto.ts`

![](images/clipboard-3541715740.png)

#### 16.14 — DTO de actualización

**Archivo:** `src/features/business/encounters/application/dto/update-encounter.dto.ts`

![](images/clipboard-1557351125.png)

#### 16.15 — Mapper

**Archivo:** `src/features/business/encounters/application/mappers/encounter.mapper.ts`

![](images/clipboard-157258515.png)

#### 16.16 — Use-case: registrar atención (marca la cita como `ATENDIDA`)

**Archivo:** `src/features/business/encounters/application/use-cases/create-encounter.use-case.ts`

![](images/clipboard-441570810.png)

#### 16.17 — Use-case: eliminar atención

**Archivo:** `src/features/business/encounters/application/use-cases/delete-encounter.use-case.ts`

![](images/clipboard-1011700628.png)

#### 16.18 — Use-case: obtener atención

**Archivo:** `src/features/business/encounters/application/use-cases/get-encounter.use-case.ts`

![](images/clipboard-3771344729.png)

#### 16.19 — Use-case: listar atenciones

**Archivo:** `src/features/business/encounters/application/use-cases/list-encounters.use-case.ts`

![](images/clipboard-4225958360.png)

#### 16.20 — Use-case: actualizar atención

**Archivo:** `src/features/business/encounters/application/use-cases/update-encounter.use-case.ts`

![](images/clipboard-1520055463.png)

#### 16.21 — Serializer

**Archivo:** `src/features/business/encounters/presentation/http/serializers/encounter.serializer.ts`

![](images/clipboard-2271596766.png)

#### 16.22 — Controller

**Archivo:** `src/features/business/encounters/presentation/http/controllers/encounters.controller.ts`

![](images/clipboard-2214271970.png)

#### 16.23 — Barrel `index.ts`

**Archivo:** `src/features/business/encounters/index.ts`

![](images/clipboard-3852977788.png)

#### 16.24 — Módulo `encounters.module.ts`

**Archivo:** `src/features/business/encounters/encounters.module.ts`

![](images/clipboard-3221819288.png)

#### 16.25 — Registrar `EncounterModel` en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-2528519140.png)

#### 16.26 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-3200517854.png)

#### 16.27 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-3231877587.png)

#### 16.28 — Verificar tabla física `encounters` y transición de cita

![](images/clipboard-3512139714.png)

![](images/clipboard-4096869873.png)

------------------------------------------------------------------------

## FASE 17: `16_BUSINESS_INVOICES` {#fase-17-16_business_invoices}

### **Objetivo de la fase:** Factura agrupa una o más atenciones facturables (`Factura agrupa atenciones facturables`). Como `EncounterModel` (Fase 16) ya existe pero no puede referenciar a `Invoice` (aún no existía), esta fase primero **extiende** Encounter con una FK opcional `invoice_id` mediante una migración adicional, y luego construye Invoice completo.

#### 17.1 — Migración adicional: agregar `invoice_id` a `encounters`

**Archivo:** `src/features/business/encounters/infrastructure/persistence/migrations/add-invoice-id-to-encounters.migration.ts`

![](images/clipboard-458927303.png)

#### 17.2 — Extender `EncounterModel` con `invoiceId` (FK opcional)

**Archivo:** `src/features/business/encounters/infrastructure/persistence/models/encounter.model.ts`

![](images/clipboard-2985500537.png)

#### 17.3 — Extender entidad de dominio `Encounter` con `invoiceId`

**Archivo:** `src/features/business/encounters/domain/entities/encounter.entity.ts`

![](images/clipboard-2829425124.png)

#### 17.4 — Extender `EncounterMapper` con `invoiceId`

**Archivo:** `src/features/business/encounters/application/dto/encounter-response.dto.ts`

![](images/clipboard-92141451.png)

#### 17.5 — Entidad de dominio Invoice

**Archivo:** `src/features/business/invoices/domain/entities/invoice.entity.ts`

![](images/clipboard-3751060674.png)

#### 17.6 — Excepción: factura no encontrada

**Archivo:** `src/features/business/invoices/domain/exceptions/invoice-not-found.exception.ts`

![](images/clipboard-2439711162.png)

#### 17.7 — Excepción: número de factura duplicado

**Archivo:** `src/features/business/invoices/domain/exceptions/invoice-number-already-exists.exception.ts`

![](images/clipboard-3488891800.png)

#### 17.8 — Excepción: atención ya facturada

**Archivo:** `src/features/business/invoices/domain/exceptions/encounter-already-invoiced.exception.ts`

![](images/clipboard-1440845183.png)

#### 17.9 — Interfaz de repositorio

**Archivo:** `src/features/business/invoices/domain/interfaces/invoice-repository.interface.ts`

![](images/clipboard-3443321258.png)

#### 17.10 — Modelo Sequelize

**Archivo:** `src/features/business/invoices/infrastructure/persistence/models/invoice.model.ts`

![](images/clipboard-2338715442.png)

#### 17.11 — Repositorio de infraestructura

**Archivo:** `src/features/business/invoices/infrastructure/persistence/repositories/invoice.repository.ts`

![](images/clipboard-280812605.png)

#### 17.12 — Migración `create-invoices-table`

**Archivo:** `src/features/business/invoices/infrastructure/persistence/migrations/create-invoices-table.migration.ts`

![](images/clipboard-3253464237.png)

**Nota de orden:** esta migración (crear `invoices`) debe ejecutarse **antes** que la del paso 17.1 (agregar `invoice_id` a `encounters`), porque esa columna referencia a `invoices.id`. Coloca este archivo con un timestamp/prefijo anterior si usas `sequelize-cli db:migrate` con orden por nombre de archivo.

#### 17.13 — Seeder (factura demo, sin atenciones asociadas todavía)

**Archivo:** `src/features/business/invoices/infrastructure/persistence/seeders/invoices.seeder.ts`

![](images/clipboard-3430894586.png)

#### 17.14 — DTO de filtro

**Archivo:** `src/features/business/invoices/application/dto/invoice-filter.dto.ts`

![](images/clipboard-547632166.png)

#### 17.15 — DTO de respuesta

**Archivo:** `src/features/business/invoices/application/dto/invoice-response.dto.ts`

![](images/clipboard-2924871101.png)

#### 17.16 — DTO de creación (a partir de atenciones facturables)

**Archivo:** `src/features/business/invoices/application/dto/create-invoice.dto.ts`

![](images/clipboard-2755431834.png)

#### 17.17 — Mapper

**Archivo:** `src/features/business/invoices/application/mappers/invoice.mapper.ts`

![](images/clipboard-2633323116.png)

#### 17.18 — Use-case: generar factura a partir de atenciones (IVA 19%)

**Archivo:** `src/features/business/invoices/application/use-cases/create-invoice.use-case.ts`

![](images/clipboard-3855444357.png)

#### 17.19 — Use-case: marcar factura como pagada

**Archivo:** `src/features/business/invoices/application/use-cases/pay-invoice.use-case.ts`

![](images/clipboard-2589186305.png)

#### 17.20 — Use-case: anular factura

**Archivo:** `src/features/business/invoices/application/use-cases/cancel-invoice.use-case.ts`

![](images/clipboard-2924036656.png)

#### 17.21 — Use-case: obtener factura

**Archivo:** `src/features/business/invoices/application/use-cases/get-invoice.use-case.ts`

![](images/clipboard-3793944072.png)

#### 17.22 — Use-case: listar facturas

**Archivo:** `src/features/business/invoices/application/use-cases/list-invoices.use-case.ts`

![](images/clipboard-2700640797.png)

#### 17.23 — Use-case: eliminar factura

**Archivo:** `src/features/business/invoices/application/use-cases/delete-invoice.use-case.ts`

![](images/clipboard-531284708.png)

#### 17.24 — Serializer

**Archivo:** `src/features/business/invoices/presentation/http/serializers/invoice.serializer.ts`

![](images/clipboard-1759957022.png)

#### 17.25 — Controller

**Archivo:** `src/features/business/invoices/presentation/http/controllers/invoices.controller.ts`

![](images/clipboard-33864342.png)

#### 17.26 — Barrel `index.ts`

**Archivo:** `src/features/business/invoices/index.ts`

![](images/clipboard-3581477774.png)

#### 17.27 — Módulo `invoices.module.ts`

**Archivo:** `src/features/business/invoices/invoices.module.ts`

![](images/clipboard-4253808965.png)

#### 17.28 — Registrar `InvoiceModel` en `sequelize.factory.ts`

**Archivo:** `src/infrastructure/database/sequelize/sequelize.factory.ts`

![](images/clipboard-1237820884.png)

#### 17.29 — Actualizar `business.module.ts`

**Archivo:** `src/features/business/business.module.ts`

![](images/clipboard-2987944455.png)

#### 17.30 — Actualizar `database-seeder.service.ts`

**Archivo:** `src/infrastructure/database/sequelize/database-seeder.service.ts`

![](images/clipboard-1068979256.png)

#### 17.31 — Verificar tabla física `invoices` y flujo completo de facturación

![](images/clipboard-3109777475.png)

![](images/clipboard-3483783539.png)

------------------------------------------------------------------------

## FASE 18: `17_FIXES_Y_AJUSTES` {#fase-18-17_fixes_y_ajustes}

### **Objetivo de la fase:** Esta fase junta dos tipos de ajustes detectados después de correr las Fases 1–17:

1.  Los pasos 17.2–17.4 solo dejaron **comentarios guía**, no código real — aquí se aplica la extensión de `Encounter` con `invoiceId` de verdad (esto es lo que corrige el error `Property 'invoiceId' does not exist on type 'Encounter'`).

2.  Se agrega `@ApiOperation({ summary: '...' })` a cada endpoint de los 11 controladores de negocio, para que Swagger (`/api/docs`) muestre una descripción corta de qué hace cada ruta

#### 18.1 — Extender `EncounterModel` con `invoiceId` (FK opcional) — corrección real

**Archivo:** `src/features/business/encounters/infrastructure/persistence/models/encounter.model.ts`

![](images/clipboard-569642085.png)

#### 18.2 — Extender entidad de dominio `Encounter` con `invoiceId` y `assignInvoice()` — corrección real

**Archivo:** `src/features/business/encounters/domain/entities/encounter.entity.ts`

![](images/clipboard-2535021115.png)

#### 18.3 — Extender `EncounterMapper` y `EncounterResponseDto` con `invoiceId` — corrección real

**Archivo:** `src/features/business/encounters/application/dto/encounter-response.dto.ts`

![**Archivo:** `src/features/business/encounters/application/mappers/encounter.mapper.ts`](images/clipboard-83442766.png)

![](images/clipboard-4125511886.png)

#### 18.4 — Agregar `@ApiOperation` a PatientsController

**Archivo:** `src/features/business/patients/presentation/http/controllers/patients.controller.ts`

![](images/clipboard-309807608.png)

#### 18.5 — Agregar `@ApiOperation` a SpecialtiesController

**Archivo:** `src/features/business/specialties/presentation/http/controllers/specialties.controller.ts`

![](images/clipboard-3253927727.png)

#### 18.6 — Agregar `@ApiOperation` a DoctorsController

**Archivo:** `src/features/business/doctors/presentation/http/controllers/doctors.controller.ts`

![](images/clipboard-31569731.png)

#### 18.7 — Agregar `@ApiOperation` a DoctorSpecialtiesController

**Archivo:** `src/features/business/doctor-specialties/presentation/http/controllers/doctor-specialties.controller.ts`

![](images/clipboard-2720055433.png)

#### 18.8 — Agregar `@ApiOperation` a ServicesController

**Archivo:** `src/features/business/services/presentation/http/controllers/services.controller.ts`

![](images/clipboard-2438885181.png)

#### 18.9 — Agregar `@ApiOperation` a AgendasController

**Archivo:** `src/features/business/agendas/presentation/http/controllers/agendas.controller.ts`

![](images/clipboard-1399457046.png)

#### 18.10 — Agregar `@ApiOperation` a AppointmentsController

**Archivo:** `src/features/business/appointments/presentation/http/controllers/appointments.controller.ts`

![](images/clipboard-3726417910.png)

#### 18.11 — Agregar `@ApiOperation` a AuthorizationsController

**Archivo:** `src/features/business/authorizations/presentation/http/controllers/authorizations.controller.ts`

![](images/clipboard-257180339.png)

#### 18.12 — Agregar `@ApiOperation` a ClinicalRecordsController

**Archivo:** `src/features/business/clinical-records/presentation/http/controllers/clinical-records.controller.ts`

![](images/clipboard-1585936138.png)

#### 18.13 — Agregar `@ApiOperation` a EncountersController

**Archivo:** `src/features/business/encounters/presentation/http/controllers/encounters.controller.ts`

![](images/clipboard-4164110344.png)

#### 18.14 — Agregar `@ApiOperation` a InvoicesController

**Archivo:** `src/features/business/invoices/presentation/http/controllers/invoices.controller.ts`

![](images/clipboard-759086906.png)

#### 18.15 — Verificar Swagger con los resúmenes de cada endpoint

![](images/clipboard-1981850871.png)

![![](images/clipboard-3606464633.png)](images/clipboard-4270563341.png)

![![](images/clipboard-2682107624.png)](images/clipboard-2165562762.png)

![](images/clipboard-1345155284.png)

------------------------------------------------------------------------

## FASE 19: `18_DEMO_SWAGGER_UI` {#fase-19-18_demo_swagger_ui}

### **Objetivo de la fase:** Demostrar el funcionamiento real de la base de datos ejecutando todas las operaciones desde **Swagger UI**, en el orden en que ocurren en el negocio: se registra un paciente, se crea una especialidad, se asigna a un médico, se publica una agenda, se agenda una cita, se valida la autorización, se abre la historia clínica, se registra la atención (que pasa la cita a `ATENDIDA`) y finalmente se genera la factura.

#### 19.1 — Preparar el entorno

Levanta la aplicación en una terminal:

``` bash
npm run start:dev
```

![](images/clipboard-2602498839.png)

Abre Swagger UI en el navegador:

<http://localhost:3000/api/docs>

#### 19.2 — Cómo se usa cada endpoint en Swagger

Este procedimiento se repite en todos los pasos siguientes:

1.  Clic en el grupo (por ejemplo `patients`) para desplegarlo.

2.  Clic en el endpoint (por ejemplo `POST /patients — Crear un paciente`).

3.  Presionar el botón **Try it out**, arriba a la derecha del endpoint.

4.  Borrar el body de ejemplo y pegar el JSON del paso.

5.  Presionar **Execute**.

6.  Revisar abajo, en **Server response**: el código debe ser `201` y el cuerpo mostrar el registro creado.

7.  **Anotar el `id` devuelto**, porque los pasos siguientes lo necesitan.

Tabla de referencia del recorrido completo:

| \# | Paso | Grupo en Swagger | Endpoint | Tabla |
|:---|:---|:---|:---|:---|
| 1 | Paciente | `patients` | POST /patients | `patients` |
| 2 | Especialidad | `specialties` | POST /specialties | `specialties` |
| 3 | Médico | `doctors` | POST /doctors | `doctors` |
| 4 | Asignación N:M | `doctor-specialties` | POST /doctor-specialties | `doctor_specialties` |
| 5 | Servicio | `services` | POST /services | `services` |
| 6 | Agenda | `agendas` | POST /agendas | `agendas` |
| 7 | Cita | `appointments` | POST /appointments | `appointments` |
| 8 | Autorización | `authorizations` | POST /authorizations | `authorizations` |
| 9 | Historia clínica | `clinical-records` | POST /clinical-records | `clinical_records` |
| 10 | Atención | `encounters` | POST /encounters | `encounters` |
| 11 | Factura | `invoices` | POST /invoices | `invoices` |
| 12 | Pago | `invoices` | PATCH /invoices/{id}/pay | `invoices` |

#### 19.3 — Registrar un paciente (tabla `patients`)

**En Swagger:** grupo `patients` → `POST /patients Crear un paciente` → **Try it out** → pegar el body → **Execute**.

**Body JSON:**

``` json
{
  "documentType": "CC",
  "documentNumber": "1118811828",
  "name": "Sahale Sierra Serrano",
  "birthDate": "2005-06-30",
  "contact": "sahalesierra75@gmail.com"
}
```

![](images/clipboard-2790742129.png)

#### En DBeaver:

``` sql
SELECT id, document_type, document_number, name, birth_date, contact, is_active
FROM patients
ORDER BY id DESC;
```

![](images/clipboard-3251353675.png)

**Prueba de validación:** presiona **Execute** una segunda vez con el mismo body. Swagger devuelve un error indicando que el documento ya existe — es la restricción `UNIQUE` sobre `document_number` más la validación del caso de uso trabajando juntas.

![](images/clipboard-100979269.png)

#### 19.4 — Crear una especialidad (tabla `specialties`)

**En Swagger:** grupo `specialties` → `POST /specialties Crear una especialidad` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "name": "Dermatologia",
  "description": "Diagnostico y tratamiento de enfermedades de la piel"
}
```

![](images/clipboard-1553774584.png)

**En DBeaver:**

``` sql
SELECT id, name, description, is_active
FROM specialties
ORDER BY id DESC;
```

![](images/clipboard-2520108154.png)

#### 19.5 — Crear un médico (tabla `doctors`)

**En Swagger:** grupo `doctors` → `POST /doctors Crear un médico` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "name": "Dr. Jaider Quintero",
  "description": "Especialista en dermatologia clinica"
}
```

![](images/clipboard-3153632221.png)

**En DBeaver:**

``` sql
SELECT id, name, description, is_active
FROM doctors
ORDER BY id DESC;
```

![](images/clipboard-38613997.png)

#### 19.6 — Asignar la especialidad al médico (tabla `doctor_specialties`, relación N:M)

**En Swagger:** grupo `doctor-specialties` → `POST /doctor-specialties Asignar una especialidad a un médico` → **Try it out** → **Execute**.

**Body JSON** (Los ids son los correspondientes a los pasos 19.5 y 19.4):

``` json
{
  "doctorId": 1,
  "specialtyId": 1,
  "relationData": "Habilitado desde 2026"
}
```

![](images/clipboard-283145731.png)

**En DBeaver** — aquí se ve la relación N:M resuelta con un `JOIN` de tres tablas:

``` sql
SELECT ds.id,
       d.name  AS medico,
       s.name  AS especialidad,
       ds.datos_relacion,
       ds.is_active
FROM doctor_specialties ds
JOIN doctors     d ON d.id = ds.principal_id
JOIN specialties s ON s.id = ds.relacionado_id
ORDER BY ds.id DESC;
```

![](images/clipboard-3007406044.png)

**Dos pruebas para mostrar:**

- Ejecuta otra vez con el mismo par: devuelve el error de relación duplicada.

- Cambia `doctorId` a un número que no exista (por ejemplo `999`): devuelve "Médico no encontrado". Esto demuestra que la validación vive en el caso de uso, antes de tocar la base de datos.

  ![](images/clipboard-1768957820.png)

  ![](images/clipboard-186845870.png)

#### 19.7 — Crear un servicio (tabla `services`)

**En Swagger:** grupo `services` → `POST /services Crear un servicio` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "name": "Consulta dermatologica",
  "description": "Valoracion dermatologica ambulatoria"
}
```

![](images/clipboard-2110344176.png)

**En DBeaver:**

``` sql
SELECT id, name, description, is_active
FROM services
ORDER BY id DESC;
```

![](images/clipboard-39669352.png)

#### 19.8 — Publicar una agenda del médico (tabla `agendas`, FK a `doctors`)

**En Swagger:** grupo `agendas` → `POST /agendas Crear una agenda` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "doctorId": 1,
  "name": "Agenda dermatologia manana",
  "description": "Lunes a viernes de 8am a 12pm"
}
```

![](images/clipboard-2427392410.png)

**En DBeaver:**

``` sql
SELECT a.id, a.name AS agenda, d.name AS medico, a.description, a.is_active
FROM agendas a
JOIN doctors d ON d.id = a.doctor_id
ORDER BY a.id DESC;
```

![](images/clipboard-4061179988.png)

#### 19.9 — Agendar una cita (tabla `appointments`, FK a `patients` y `agendas`)

**En Swagger:** grupo `appointments` → `POST /appointments Agendar una cita` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "patientId": 3,
  "agendaId": 1,
  "startDate": "2026-10-05T09:00:00",
  "endDate": "2026-10-05T09:30:00",
  "reason": "Lesion en la piel del antebrazo"
}
```

![](images/clipboard-4037173233.png)

**En DBeaver:**

``` sql
SELECT c.id,
       p.name  AS paciente,
       d.name  AS medico,
       a.name  AS agenda,
       c.fecha_inicio,
       c.fecha_fin,
       c.reason AS motivo,
       c.status AS estado
FROM appointments c
JOIN patients p ON p.id = c.patient_id
JOIN agendas  a ON a.id = c.agenda_id
JOIN doctors  d ON d.id = a.doctor_id
ORDER BY c.id DESC;
```

![](images/clipboard-1263303692.png)

#### 19.10 — Registrar la autorización de la cita (tabla `authorizations`, 0..1:1)

**En Swagger:** grupo `authorizations` → `POST /authorizations Registrar una autorización` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "appointmentId": 1,
  "name": "Autorizacion EPS Sura 998877",
  "description": "Autorizacion vigente para consulta especializada"
}
```

![](images/clipboard-2864667957.png)

**En DBeaver:**

``` sql
SELECT au.id,
       au.name AS autorizacion,
       p.name  AS paciente,
       c.fecha_inicio,
       au.is_active
FROM authorizations au
JOIN appointments c ON c.id = au.appointment_id
JOIN patients     p ON p.id = c.patient_id
ORDER BY au.id DESC;
```

![](images/clipboard-948884950.png)

**Para mostrar la cardinalidad:** presiona **Execute** otra vez con la misma cita. Falla con "La cita ya tiene una autorización registrada". Eso es la relación `0..1:1` — una cita no puede tener dos autorizaciones, garantizado por el `UNIQUE` sobre `appointment_id`.

![](images/clipboard-398979229.png)

#### 19.11 — Abrir la historia clínica del paciente (tabla `clinical_records`, 1:1)

**En Swagger:** grupo `clinical-records` → `POST /clinical-records Crear una historia clínica` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "patientId": 3,
  "name": "Historia clinica Ana Maria Rojas",
  "description": "Apertura de historia clinica en admisiones"
}
```

![![](images/clipboard-3090175469.png)](images/clipboard-2371418099.png)

**En DBeaver:**

``` sql
SELECT hc.id,
       p.name AS paciente,
       p.document_number,
       hc.name AS historia,
       hc.is_active
FROM clinical_records hc
JOIN patients p ON p.id = hc.patient_id
ORDER BY hc.id DESC;
```

![](images/clipboard-578168333.png)

#### 19.12 — Registrar la atención (tabla `encounters`, pasa la cita a `ATENDIDA`)

Este es el paso más importante de la demostración, porque dispara una regla de negocio automática.

**Paso A — el "antes".** Grupo `appointments` → `GET /appointments/{id} Obtener una cita por ID` → **Try it out** → `id` = `1` → **Execute**. Verás `"status": "PROGRAMADA"`.

![](images/clipboard-213241043.png)

**Paso B — registrar la atención.** Grupo `encounters` → `POST /encounters Registrar una atención` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "appointmentId": 1,
  "serviceId": 1,
  "clinicalRecordId": 1,
  "total": 12000,
  "observations": "Dermatitis de contacto. Se formula crema topica y control en 30 dias."
}
```

![](images/clipboard-769833407.png)

**Paso C — el "después".** Vuelve a `GET /appointments/{id}` con el mismo `id` y presiona **Execute** de nuevo. Ahora dice `"status": "ATENDIDA"`.

![](images/clipboard-2372018767.png)

**En DBeaver** — la consulta que amarra toda la cadena asistencial:

``` sql
SELECT at.id           AS atencion,
       p.name          AS paciente,
       d.name          AS medico,
       s.name          AS servicio,
       hc.name         AS historia_clinica,
       at.total,
       at.observations AS observaciones,
       c.status        AS estado_cita,
       at.invoice_id   AS factura
FROM encounters at
JOIN appointments     c  ON c.id  = at.referencia_id
JOIN patients         p  ON p.id  = c.patient_id
JOIN agendas          a  ON a.id  = c.agenda_id
JOIN doctors          d  ON d.id  = a.doctor_id
JOIN services         s  ON s.id  = at.service_id
JOIN clinical_records hc ON hc.id = at.clinical_record_id
ORDER BY at.id DESC;
```

![](images/clipboard-3517430817.png)

**Dos cosas para señalar en pantalla:**

- `estado_cita` ahora dice `ATENDIDA` — cambió sola al registrar la atención, cumpliendo la regla del proyecto: *"Una cita solo pasa a atendida con profesional, paciente y registro clínico"*.

- `factura` está en `NULL` porque la atención todavía no ha sido facturada. En el siguiente paso se llena.

#### 19.13 — Generar la factura (tabla `invoices`, agrupa atenciones)

**En Swagger:** grupo `invoices` → `POST /invoices Generar una factura` → **Try it out** → **Execute**.

**Body JSON:**

``` json
{
  "number": "FAC-2026-0001",
  "encounterIds": [1]
}
```

![](images/clipboard-3160240728.png)

**En DBeaver:**

``` sql
SELECT f.number    AS factura,
       f.total     AS total_factura,
       f.status    AS estado_factura,
       at.id       AS atencion,
       p.name      AS paciente,
       s.name      AS servicio,
       at.total    AS valor_atencion
FROM invoices f
JOIN encounters   at ON at.invoice_id = f.id
JOIN appointments c  ON c.id = at.referencia_id
JOIN patients     p  ON p.id = c.patient_id
JOIN services     s  ON s.id = at.service_id
ORDER BY f.id DESC, at.id;
```

![](images/clipboard-286180778.png)

#### 19.14 — Cerrar el ciclo: pagar la factura

**En Swagger:** grupo `invoices` → `PATCH /invoices/{id}/pay Marcar una factura como pagada` → **Try it out** → `id` = `1` → **Execute**. No lleva body.

**Respuesta esperada:** `"status": "PAGADA"`.

![](images/clipboard-4013624240.png)

**En DBeaver:**

``` sql
SELECT id, number AS numero, total, status AS estado
FROM invoices
ORDER BY id DESC;
```

![](images/clipboard-857021000.png)

#### 19.15 — Verificación final: conteo de las 11 tablas

![](images/clipboard-4183825898.png)
