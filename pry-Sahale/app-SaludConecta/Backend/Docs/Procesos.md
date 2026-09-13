# Proceso del Manual de Creacion del Backend

## **FASE 1 — `00_BASE_INIT_NESTJS`**

### **Objetivo de la fase:** Dejar el esqueleto oficial Nest corriendo en un puerto libre, con Git inicial.

#### **1.1 — Crear carpetas padre y permisos**

``` bash
mkdir -p ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/Backend$
chmod -R 755 ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/Backend$
```

#### **1.2 — Instalar Nest CLI (si no existe)**

![](images/clipboard-590382690.png)

#### **1.3 — Crear proyecto NestJS**

![](images/clipboard-1022780847.png){width="598"}

#### **1.4 — Crear `.env` mínimo (puerto)**

![](images/clipboard-4185916596.png)

## **FASE 2 — `01_BASE_DEPS_Y_PUERTO`**

### **Objetivo de la fase:** Instalar el stack profesional y evitar que un `start:dev` colgado bloquee el puerto.

#### **2.1 — Dependencias de producción**

![](images/clipboard-3576067118.png)

#### **2.2 — Dependencias de desarrollo**

![](images/clipboard-67397687.png)

#### **2.3 — Script para liberar puerto (evita EADDRINUSE)**

![](images/clipboard-852153046.png)

#### **2.4 — Actualizar scripts npm en package.json**

![](images/clipboard-2831284300.png)

#### **2.5 — Verificar arranque base**

![](images/clipboard-174352802.png)

## **FASE 3 — `02_BASE_ESTRUCTURA_CA`**

### **Objetivo de la fase:** Crear el mapa mental: config / common / infrastructure / features (business + auth).

#### **3.1 — Crear árbol base de carpetas**

![](images/clipboard-3682792134.png)

## **FASE 4 — `03_BASE_ENTORNO_ENV`**

### **Objetivo de la fase:** Centralizar variables en `.env`: selector `DB_DIALECT` y un bloque de credenciales por motor (MySQL, PostgreSQL, SQL Server, Oracle). Validar antes del boot.

#### **4.1 — Crear `.env.example` y actualizar `.env` completo**

![](images/clipboard-4286937071.png)

#### **4.2 — Interface de entorno**

![](images/clipboard-1778451848.png)

#### **4.3 — Validación de entorno con class-validator**

![](images/clipboard-334012108.png)

#### **4.4 — Resolver de credenciales por motor**

![](images/clipboard-3394449454.png)

#### **4.5 — Factory registerAs de entorno**

![](images/clipboard-1508642179.png)

## **FASE 5 — `04_BASE_DATABASE_SEQUELIZE`**

### **Objetivo de la fase:** Conectar Sequelize al motor de `DB_DIALECT` usando el bloque `DB_MYSQL_*` / `DB_POSTGRES_*` / `DB_MSSQL_*` / `DB_ORACLE_*`. Aún sin features (ALL_MODELS vacío).

#### **5.1 — Constante SEQUELIZE_TOKEN**

![](images/clipboard-3003663146.png)

#### **5.2 — Tipos auxiliares de database config**

![](images/clipboard-3144200624.png)

#### **5.3 — database.config.ts**

![](images/clipboard-845239652.png)

#### **5.4 — database.module.ts / providers**

#### ![](images/clipboard-1729629101.png)

#### **5.5 — database.providers.ts**

![](images/clipboard-1281927516.png)

#### **5.6 — Opciones Sequelize por dialecto**

![](images/clipboard-2371518018.png)

#### **5.7 — Factory Sequelize (sin modelos aún)**

![](images/clipboard-2826245541.png)

#### **5.8 — DatabaseSeederService (sin seeders aún)**

![](images/clipboard-412396631.png)

#### **5.9 — Módulo global Sequelize**

![](images/clipboard-2365360281.png)

#### **5.10 — Verificar conexión a BD**

![](images/clipboard-2449092585.png)

## **FASE 6 — `05_BASE_APP_COMMON_SECURITY`**

### **Objetivo de la fase:** Dejar la infraestructura transversal lista antes de la primera entidad de negocio. Aún sin Business/Auth en AppModule y sin guards globales.

#### **6.1 — config/app/app.constants.ts**

![](images/clipboard-3923299630.png)

#### **6.2 — config/app/app.config.ts**

![](images/clipboard-3400483805.png)

#### **6.3 — config/logger/logger.config.ts**

![](images/clipboard-1090104160.png)

#### **6.4 — config/logger/logger.module.ts**

![](images/clipboard-473056940.png)

#### **6.5 — config/jwt/jwt.constants.ts**

![](images/clipboard-2173381541.png)

#### **6.6 — config/jwt/jwt.config.ts**

![](images/clipboard-605851505.png)

#### **6.7 — config/swagger/swagger.constants.ts**

![](images/clipboard-3915734812.png)

#### **6.8 — config/swagger/swagger.config.ts**

![](images/clipboard-4071985303.png)

#### **6.9 — common/enums/status.enum.ts**

![](images/clipboard-2368705527.png)

#### **6.10 — common/enums/http-method.enum.ts**

![](images/clipboard-2584585628.png)

#### **6.11 — common/enums/sort-order.enum.ts**

![](images/clipboard-1376041380.png)

#### **6.12 — common/constants/app.constants.ts**

![](images/clipboard-1293239555.png)

#### **6.13 — common/constants/pagination.constants.ts**

![](images/clipboard-1612738389.png)

#### **6.14 — common/exceptions/application.exception.ts**

![](images/clipboard-3615671173.png)

#### **6.15 — common/exceptions/domain.exception.ts**

![](images/clipboard-3664639502.png)

#### **6.16 — common/exceptions/entity-not-found.exception.ts**

![](images/clipboard-2034427598.png)

#### **6.17 — common/exceptions/validation.exception.ts**

![](images/clipboard-3507543829.png)

#### **6.18 — common/filters/global-exception.filter.ts**

![](images/clipboard-3503019339.png)

#### **6.19 — common/filters/sequelize-exception.filter.ts**

![](images/clipboard-3950385940.png)

#### **6.20 — common/interceptors/response.interceptor.ts**

![](images/clipboard-2534416736.png)

#### **6.21 — common/interceptors/logging.interceptor.ts**

![](images/clipboard-1743918062.png)

#### **6.22 — common/interceptors/timeout.interceptor.ts**

![](images/clipboard-2114098301.png)

#### **6.23 — common/pipes/validation.pipe.ts**

![](images/clipboard-2194143402.png)

#### **6.24 — common/pipes/parse-positive-int.pipe.ts**

![](images/clipboard-482923171.png)

#### **6.25 — common/decorators/public.decorator.ts**

![](images/clipboard-3190035947.png)

#### **6.26 — common/decorators/roles.decorator.ts**

#### ![](images/clipboard-3622196574.png)

#### **6.27 — common/decorators/current-user.decorator.ts**

![](images/clipboard-1302710967.png)

#### **6.28 — common/decorators/resource.decorator.ts**

![](images/clipboard-2038885873.png)

#### **6.29 — common/interfaces/authenticated-user.interface.ts**

![](images/clipboard-2233185964.png)

#### **6.30 — common/interfaces/pagination.interface.ts**

![](images/clipboard-3035829082.png)

#### **6.31 — common/interfaces/api-response.interface.ts**

![](images/clipboard-449959069.png)

#### **6.32 — common/types/nullable.type.ts**

![](images/clipboard-1241693955.png)

#### **6.33 — common/types/optional.type.ts**

![](images/clipboard-754428442.png)

#### **6.34 — common/utils/pagination.util.ts**

![](images/clipboard-3647316464.png)

#### **6.35 — common/utils/date.util.ts**

![](images/clipboard-1734429927.png)

#### **6.36 — common/utils/string.util.ts**

![](images/clipboard-1340321766.png)

#### **6.37 — infrastructure/security/hashing/password-hasher.interface.ts**

![](images/clipboard-194140270.png)

#### **6.38 — infrastructure/security/hashing/bcrypt-password-hasher.service.ts**

![](images/clipboard-1555029951.png)

#### **6.39 — infrastructure/security/tokens/token.interface.ts**

![](images/clipboard-3595858040.png)

#### **6.40 — infrastructure/security/tokens/token.service.ts**

![](images/clipboard-1148571801.png)

#### **6.41 — infrastructure/security/security.module.ts**

![](images/clipboard-3116395688.png)

#### **6.42 — Actualizar main.ts (bootstrap completo)**

![](images/clipboard-2461679055.png)

#### **6.43 — Actualizar app.module.ts (base sin features ni guards)**

![](images/clipboard-3988398871.png)

#### **6.44.1 — Correcion de archivos .ts a js.**

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

#### **6.44 — Verificar bootstrap transversal**

![](images/clipboard-1618933776.png)

![](images/clipboard-216055138.png)

## **FASE 7 — `06_BUSINESS_PATIENTS`**

### **Objetivo de la fase:** Primera entidad de negocio real. Orden: dominio → infraestructura → aplicación → presentación → módulo → cableado → verificación.

#### **7.1 — Entidad de dominio**

![](images/clipboard-3814066931.png)

#### **7.2 — Excepción: documento duplicado**

![](images/clipboard-3670536466.png)

#### **7.3 — Excepción: paciente no encontrado**

![](images/clipboard-14091350.png)

#### **7.4 — Interfaz de repositorio**

![](images/clipboard-10119738.png)

#### **7.5 — Validador de documento**

![](images/clipboard-2314033959.png)

#### **7.6 — Validador de contacto**

![](images/clipboard-1887235088.png)

#### **7.7 — Modelo Sequelize**

![](images/clipboard-391499701.png)

#### **7.8 — Repositorio de infraestructura**

![](images/clipboard-1565099425.png)

#### **7.9 — Migración**

![](images/clipboard-3349638977.png)

#### **7.10 — Seeder**

![](images/clipboard-2926836498.png)

#### **7.11 — DTO de filtro**

![](images/clipboard-3371537884.png)

#### **7.12 — DTO de respuesta**

![](images/clipboard-944493718.png)

#### **7.13 — DTO de creación**

![](images/clipboard-543690936.png)

#### **7.14 — DTO de actualización**

![](images/clipboard-4077661074.png)

#### **7.15 — Mapper**

![](images/clipboard-3637310304.png)

#### **7.16 — Use-case: crear paciente**

![](images/clipboard-1213359149.png)

#### **7.17 — Use-case: eliminar paciente**

![](images/clipboard-1154657984.png)

#### **7.18 — Use-case: obtener paciente**

![](images/clipboard-582404623.png)

#### **7.19 — Use-case: listar pacientes**

![](images/clipboard-2659283141.png)

#### **7.20 — Use-case: actualizar paciente**

![](images/clipboard-2625058706.png)

#### **7.21 — Serializer**

![](images/clipboard-845051458.png)

#### **7.22 — Controller**

![](images/clipboard-3815057823.png)

#### **7.23 — Barrel `index.ts`**

![](images/clipboard-3007966731.png)

#### **7.24 — Módulo `patients.module.ts`**

![](images/clipboard-923850090.png)

#### **7.25 — Registrar `PatientModel` en `sequelize.factory.ts`**

![](images/clipboard-3683822868.png)

#### **7.26 — Actualizar `business.module.ts`**

![](images/clipboard-2288402048.png)

#### **7.27 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-2010156917.png)

#### **7.28 — Actualizar `app.module.ts`**

![](images/clipboard-2278087678.png)

#### **7.29 — Verificar tabla física `patients` y API**

![](images/clipboard-133971602.png)

## **FASE 8 — `07_BUSINESS_SPECIALTIES`**

### **Objetivo de la fase:** Catálogo de especialidades médicas (`nombre`, `descripcion`, `is_active`), sin relaciones salientes propias — es referenciada por `DoctorSpecialties` en la Fase 10.

#### **8.1 — Entidad de dominio**

![](images/clipboard-4036040989.png)

#### **8.2 — Excepción: especialidad no encontrada**

![](images/clipboard-709219115.png)

#### **8.3 — Excepción: nombre duplicado**

![](images/clipboard-2374906236.png)

#### **8.4 — Interfaz de repositorio**

![](images/clipboard-4229316524.png)

#### **8.5 — Modelo Sequelize**

![](images/clipboard-3949817157.png)

#### **8.6 — Repositorio de infraestructura**

![](images/clipboard-1411980706.png)

#### **8.7 — Migración**

![](images/clipboard-3065602283.png)

#### **8.8 — Seeder**

![](images/clipboard-731655275.png)

#### **8.9 — DTOs (filtro, respuesta, creación, actualización)**

**Archivo:** `src/features/business/specialties/application/dto/specialty-filter.dto.ts`

![](images/clipboard-1815061801.png)

**Archivo:** `src/features/business/specialties/application/dto/specialty-response.dto.ts`

![**Archivo:** `src/features/business/specialties/application/dto/create-specialty.dto.ts`](images/clipboard-3664023027.png)

![](images/clipboard-1870699758.png)

**Archivo:** `src/features/business/specialties/application/dto/update-specialty.dto.ts`

![](images/clipboard-912986437.png)

#### **8.10 — Mapper**

![](images/clipboard-2846066935.png)

#### **8.11 — Use-case: crear especialidad**

![](images/clipboard-4239378455.png)

#### **8.12 — Use-case: eliminar especialidad**

![](images/clipboard-1625963837.png)

#### **8.13 — Use-case: obtener especialidad**

![](images/clipboard-2987961199.png)

#### **8.14 — Use-case: listar especialidades**

![](images/clipboard-204732368.png)

#### **8.15 — Use-case: actualizar especialidad**

![](images/clipboard-1387353211.png)

#### **8.16 — Serializer**

![](images/clipboard-2694635987.png)

#### **8.17 — Controller**

![](images/clipboard-844237264.png)

#### **8.18 — Barrel, módulo y cableado**

**Archivo:** `src/features/business/specialties/index.ts`

![](images/clipboard-4003216314.png)

**Archivo:** `src/features/business/specialties/specialties.module.ts`

![](images/clipboard-3343330776.png)

#### **8.19 — Registrar en `sequelize.factory.ts`**

![](images/clipboard-1419556341.png)

#### **8.20 — Actualizar `business.module.ts`**

![](images/clipboard-2917465803.png)

#### **8.21 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-134408047.png)

#### **8.22 — Verificar tabla física `specialties` y API**

![](images/clipboard-1995220257.png)

![](images/clipboard-1223402139.png)

## **FASE 9 — `08_BUSINESS_DOCTORS`**

### **Objetivo de la fase:** Entidad Medico. Su relación N:M con Especialidad se resuelve en la Fase 10 (`DoctorSpecialties`), una vez que ambos modelos (`DoctorModel` y `SpecialtyModel`) ya existen.

#### **9.1 — Entidad de dominio**

![](images/clipboard-3874157117.png)

#### **9.2 — Excepción: médico no encontrado**

![](images/clipboard-847066394.png)

#### **9.3 — Interfaz de repositorio**

![](images/clipboard-3394553855.png)

#### **9.4 — Modelo Sequelize**

![](images/clipboard-1176963800.png)

#### **9.5 — Repositorio de infraestructura**

![](images/clipboard-4148223849.png)

#### **9.6 — Migración**

![](images/clipboard-682313176.png)

#### **9.7 — Seeder**

![](images/clipboard-1104709237.png)

#### **9.8 — DTO filtro**

![](images/clipboard-3116398373.png)

#### **9.9 — DTO respuesta**

![](images/clipboard-1122573904.png)

#### **9.10 — DTO creación**

![](images/clipboard-3153746762.png)

#### **9.11 — DTO actualización**

![](images/clipboard-1935717206.png)

#### **9.12 — Mapper**

![](images/clipboard-4206607647.png)

#### **9.13 — Use-case: crear médico**

![](images/clipboard-737367008.png)

#### **9.14 — Use-case: eliminar médico**

![](images/clipboard-3879785435.png)

#### **9.15 — Use-case: obtener médico**

![](images/clipboard-1361212684.png)

#### **9.16 — Use-case: listar médicos**

![](images/clipboard-502330834.png)

#### **9.17 — Use-case: actualizar médico**

![](images/clipboard-1791063202.png)

#### **9.18 — Serializer**

![](images/clipboard-3472537514.png)

#### **9.19 — Controller**

![](images/clipboard-2764228925.png)

#### **9.20 — Barrel, módulo y cableado**

**Archivo:** `src/features/business/doctors/index.ts`

![](images/clipboard-1526553284.png)

**Archivo:** `src/features/business/doctors/doctors.module.ts`

![](images/clipboard-789137623.png)

#### **9.21 — Registrar en `sequelize.factory.ts`**

![](images/clipboard-2989967567.png)

#### **9.22 — Actualizar `business.module.ts`**

![](images/clipboard-112486929.png)

#### **9.23 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-1191558252.png)

#### **9.24 — Verificar tabla física `doctors` y API**

![![](images/clipboard-3400602838.png)](images/clipboard-2921708135.png)

## **FASE 10 — `09_BUSINESS_DOCTOR_SPECIALTIES`**

### **Objetivo de la fase:** Resolver la relación N:M `Medico ↔ Especialidad`. Requiere que `DoctorModel` (Fase 9) y `SpecialtyModel` (Fase 8) ya existan — por eso se implementa después de ambos. `principal_id` referencia a `doctors`, `relacionado_id` referencia a `specialties`, y `datos_relacion` guarda metadatos propios de la relación (ej. fecha de habilitación).

#### **10.1 — Entidad de dominio**

![](images/clipboard-883011185.png)

#### **10.2 — Excepción: relación duplicada**

![](images/clipboard-1243894878.png)

#### **10.3 — Excepción: relación no encontrada**

![](images/clipboard-97298628.png)

#### **10.4 — Interfaz de repositorio**

![](images/clipboard-3152666681.png)

#### **10.5 — Modelo Sequelize (con asociaciones a Doctor y Specialty, ya existentes)**

![](images/clipboard-2688348035.png)

#### **10.6 — Repositorio de infraestructura**

![](images/clipboard-1080111412.png)

#### **10.7 — Migración (con FKs a `doctors` y `specialties`)**

![](images/clipboard-1935346972.png)

#### **10.8 — Seeder (usa los ids sembrados de Doctors y Specialties)**

![](images/clipboard-139130002.png)

#### **10.9 — DTO de filtro**

![](images/clipboard-1935422337.png)

#### **10.10 — DTO de respuesta**

![](images/clipboard-3626468020.png)

#### **10.11 — DTO de creación**

![](images/clipboard-1171551054.png)

#### **10.12 — Mapper**

![](images/clipboard-1276533739.png)

#### **10.13 — Use-case: asignar especialidad a médico**

![](images/clipboard-1460173133.png)

#### **10.14 — Use-case: quitar especialidad de médico**

![](images/clipboard-600885170.png)

#### **10.15 — Use-case: listar relaciones médico-especialidad**

![](images/clipboard-2645415495.png)

#### **10.16 — Serializer**

![](images/clipboard-1882360456.png)

#### **10.17 — Controller**

![](images/clipboard-1383031572.png)

#### **10.18 — Barrel `index.ts`**

![](images/clipboard-4255625028.png)

#### **10.19 — Módulo `doctor-specialties.module.ts`**

![](images/clipboard-3553720707.png)

#### **10.20 — Registrar en `sequelize.factory.ts`**

![](images/clipboard-1325045534.png)

#### **10.21 — Actualizar `business.module.ts`**

![](images/clipboard-3180499516.png)

#### **10.22 — Actualizar `database-seeder.service.ts` (orden: doctors → specialties → doctor_specialties)**

![](images/clipboard-2044096693.png)

#### **10.23 — Verificar tabla física `doctor_specialties` y API**

![![](images/clipboard-1116631913.png)](images/clipboard-1558539880.png)

## **FASE 11 — `10_BUSINESS_SERVICES`**

### **Objetivo de la fase:** Catálogo de servicios clínicos, referenciado luego por `Encounters` (Fase 15: `Servicio 1:N Atencion`).

#### **11.1 — Entidad de dominio**

![](images/clipboard-541589824.png)

#### **11.2 — Excepción: servicio no encontrado**

![](images/clipboard-1513165492.png)

#### **11.3 — Excepción: nombre de servicio duplicado**

![](images/clipboard-971937387.png)

#### **11.4 — Interfaz de repositorio**

![](images/clipboard-2732653662.png)

#### **11.5 — Modelo Sequelize**

![](images/clipboard-1791473539.png)

#### **11.6 — Repositorio de infraestructura**

![](images/clipboard-520134851.png)

#### **11.7 — Migración**

![](images/clipboard-1966386688.png)

#### **11.8 — Seeder**

![](images/clipboard-3863246267.png)

#### **11.9 — DTO de filtro**

![](images/clipboard-1920730475.png)

#### **11.10 — DTO de respuesta**

![](images/clipboard-251644431.png)

#### **11.11 — DTO de creación**

![](images/clipboard-4090505670.png)

#### **11.12 — DTO de actualización**

![](images/clipboard-1324242416.png)

#### **11.13 — Mapper**

![](images/clipboard-4264217520.png)

#### **11.14 — Use-case: crear servicio**

![](images/clipboard-3817425780.png)

#### **11.15 — Use-case: obtener servicio**

![](images/clipboard-1072766959.png)

#### **11.16 — Use-case: listar servicios**

![](images/clipboard-2408572411.png)

#### **11.17 — Use-case: actualizar servicio**

![](images/clipboard-4042430704.png)

#### **11.18 — Use-case: eliminar servicio**

![](images/clipboard-2670921466.png)

#### **11.19 — Serializer**

![](images/clipboard-46209851.png)

#### **11.20 — Controller**

![](images/clipboard-76533410.png)

#### **11.21 — Barrel `index.ts`**

![](images/clipboard-1964295835.png)

#### **11.22 — Módulo `services.module.ts`**

![](images/clipboard-3815497138.png)

#### **11.23 — Registrar en `sequelize.factory.ts`**

![](images/clipboard-307484914.png)

#### **11.24 — Actualizar `business.module.ts`**

![](images/clipboard-2386314622.png)

#### **11.25 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-3014431907.png)

#### **11.26 — Verificar tabla física `services` y API**

![](images/clipboard-2461838265.png)

![](images/clipboard-3257488065.png)

## **FASE 12 — `11_BUSINESS_AGENDAS`**

### **Objetivo de la fase:** Agenda pertenece a un médico (`Medico 1:N Agenda`). Requiere que `DoctorModel` (Fase 9) ya exista.

#### **12.1 — Entidad de dominio**

![](images/clipboard-1129044384.png)

#### **12.2 — Excepción: agenda no encontrada**

![](images/clipboard-1479283641.png)

#### **12.3 — Interfaz de repositorio**

![](images/clipboard-291919451.png)

#### **12.4 — Modelo Sequelize (con FK a Doctor)**

![](images/clipboard-2344709770.png)

#### **12.5 — Repositorio de infraestructura**

![](images/clipboard-3993194374.png)

#### **12.6 — Migración (con FK a `doctors`)**

![](images/clipboard-3963155581.png)

#### **12.7 — Seeder (usa ids sembrados de Doctors)**

![](images/clipboard-3155268584.png)

#### **12.8 — DTO de filtro**

![](images/clipboard-3603531602.png)

#### **12.9 — DTO de respuesta**

![](images/clipboard-3741761345.png)

#### **12.10 — DTO de creación**

![](images/clipboard-1809118509.png)

#### **12.11 — DTO de actualización**

![](images/clipboard-748315995.png)

#### **12.12 — Mapper**

![](images/clipboard-1423238478.png)

#### **12.13 — Use-case: crear agenda**

![](images/clipboard-3418384137.png)

#### **12.14 — Use-case: eliminar agenda**

![](images/clipboard-2542704223.png)

#### **12.15 — Use-case: obtener agenda**

![](images/clipboard-549562940.png)

#### **12.16 — Use-case: listar agendas**

![](images/clipboard-448049652.png)

#### **12.17 — Use-case: actualizar agenda**

![](images/clipboard-2889558332.png)

#### **12.18 — Serializer**

![](images/clipboard-884873707.png)

#### **12.19 — Controller**

![](images/clipboard-991127381.png)

#### **12.20 — Barrel `index.ts`**

![](images/clipboard-3861803298.png)

#### **12.21 — Módulo `agendas.module.ts`**

![](images/clipboard-3051750504.png)

#### **12.22 — Registrar `AgendaModel` en `sequelize.factory.ts`**

![](images/clipboard-937427398.png)

#### **12.23 — Actualizar `business.module.ts`**

![](images/clipboard-3537679315.png)

#### **12.24 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-2912024320.png)

#### **12.25 — Verificar tabla física `agendas` y API**

![](images/clipboard-791417835.png)

![](images/clipboard-2274054480.png)

## **FASE 13 — `12_BUSINESS_APPOINTMENTS`**

### **Objetivo de la fase:** Cita depende de Patient (Fase 7) y Agenda (Fase 12), ambas ya existentes. Maneja su propio ciclo de vida (`PROGRAMADA` → `ATENDIDA` / `CANCELADA` / `NO_ASISTIO`), distinto del campo `is_active` de catálogo. La transición a `ATENDIDA` la dispara el use-case de Encounters en la Fase 15 — aquí solo se define el método de dominio que lo permite.

#### **13.1 — Enum de estado de cita**

![](images/clipboard-1803979149.png)

#### **13.2 — Entidad de dominio**

![](images/clipboard-1063233348.png)

#### **13.3 — Excepción: cita no encontrada**

![](images/clipboard-1695671849.png)

#### **13.4 — Excepción: transición de estado inválida**

![](images/clipboard-2117785471.png)

#### **13.5 — Interfaz de repositorio**

![](images/clipboard-3644168166.png)

#### **13.6 — Modelo Sequelize (con FK a Patient y Agenda)**

![](images/clipboard-396727349.png)

#### **13.7 — Repositorio de infraestructura**

![](images/clipboard-2111728441.png)

#### **13.8 — Migración (con FKs a `patients` y `agendas`)**

![](images/clipboard-2041812576.png)

#### **13.9 — Seeder (usa ids sembrados de Patients y Agendas)**

![](images/clipboard-1865534403.png)

#### **13.10 — DTO de filtro**

![](images/clipboard-3502530214.png)

#### **13.11 — DTO de respuesta**

![](images/clipboard-2557497856.png)

#### **13.12 — DTO de creación**

![](images/clipboard-1909847763.png)

#### **13.13 — DTO de reprogramación**

![](images/clipboard-617179983.png)

#### **13.14 — Mapper**

![](images/clipboard-169306829.png)

#### **13.15 — Use-case: crear (agendar) cita**

![](images/clipboard-1102745396.png)

#### **13.16 — Use-case: reprogramar cita**

![](images/clipboard-757867419.png)

#### **13.17 — Use-case: cancelar cita**

![](images/clipboard-698576034.png)

#### **13.18 — Use-case: obtener cita**

![](images/clipboard-2772665900.png)

#### **13.19 — Use-case: listar citas**

![](images/clipboard-79024187.png)

#### **13.20 — Use-case: eliminar cita**

![](images/clipboard-53306192.png)

#### **13.21 — Serializer**

![](images/clipboard-496307131.png)

#### **13.22 — Controller**

![](images/clipboard-3027447132.png)

#### **13.23 — Barrel `index.ts`**

![](images/clipboard-26545522.png)

#### **13.24 — Módulo `appointments.module.ts`**

![](images/clipboard-1283885247.png)

#### **13.25 — Registrar `AppointmentModel` en `sequelize.factory.ts`**

![](images/clipboard-4006580122.png)

#### **13.26 — Actualizar `business.module.ts`**

![](images/clipboard-45299035.png)

#### **13.27 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-1401342032.png)

#### **13.28 — Verificar tabla física `appointments` y API**

![![](images/clipboard-2307536974.png)](images/clipboard-1628073598.png)

## **FASE 14 — `13_BUSINESS_AUTHORIZATIONS`**

### **Objetivo de la fase: Autorizacion representa el aval de la EPS/convenio para una cita puntual (`Cita 0..1:1 Autorizacion`). Requiere que `AppointmentModel` (Fase 13) ya exista. La FK `appointment_id` es única para expresar la cardinalidad 1:1 opcional.**

#### **14.1 — Entidad de dominio**

![](images/clipboard-2242990083.png)

#### **14.2 — Excepción: autorización no encontrada**

![](images/clipboard-498080842.png)

#### **14.3 — Excepción: la cita ya tiene autorización**

![](images/clipboard-2179765205.png)

#### **14.4 — Interfaz de repositorio**

![](images/clipboard-367307612.png)

#### **14.5 — Modelo Sequelize (FK única a Appointment)**

![](images/clipboard-1592418618.png)

#### **14.6 — Repositorio de infraestructura**

![](images/clipboard-2203784173.png)

#### **14.7 — Migración (FK única a `appointments`)**

![](images/clipboard-4261791871.png)

#### **14.8 — Seeder (usa una cita ya sembrada)**

![](images/clipboard-2893360910.png)

#### **14.9 — DTO de filtro**

![](images/clipboard-2607878943.png)

#### **14.10 — DTO de respuesta**

![](images/clipboard-2670644105.png)

#### **14.11 — DTO de creación**

![](images/clipboard-889364158.png)

#### **14.12 — DTO de actualización**

![](images/clipboard-783141371.png)

#### **14.13 — Mapper**

![](images/clipboard-3251017268.png)

#### **14.14 — Use-case: crear autorización**

![](images/clipboard-3215831674.png)

#### **14.15 — Use-case: eliminar autorización**

![](images/clipboard-3403584406.png)

#### **14.16 — Use-case: obtener autorización**

![](images/clipboard-4276657474.png)

#### **14.17 — Use-case: listar autorizaciones**

![](images/clipboard-2269218205.png)

#### **14.18 — Use-case: actualizar autorización**

![](images/clipboard-378751333.png)

#### **14.19 — Serializer**

![](images/clipboard-4201856750.png)

#### **14.20 — Controller**

![](images/clipboard-1305832599.png)

#### **14.21 — Barrel `index.ts`**

![](images/clipboard-1639653177.png)

#### **14.22 — Módulo `authorizations.module.ts`**

![](images/clipboard-2832694999.png)

#### **14.23 — Registrar `AuthorizationModel` en `sequelize.factory.ts`**

![](images/clipboard-510746442.png)

#### **14.24 — Actualizar `business.module.ts`**

![](images/clipboard-494838822.png)

#### **14.25 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-930476244.png)

#### **14.26 — Verificar tabla física `authorizations` y API**

![](images/clipboard-3917585667.png)

![](images/clipboard-3346721792.png)

## **FASE 15 — `14_BUSINESS_CLINICAL_RECORDS`**

### **Objetivo de la fase: HistoriaClinica pertenece a un único paciente (`Paciente 1:1 HistoriaClinica`) y será referenciada por Encounters en la Fase 16 (`HistoriaClinica 1:N Atencion`). Por eso se construye antes que Encounters, invirtiendo el orden original de la tabla de mapeo. Requiere que `PatientModel` (Fase 7) ya exista. Incluye el endpoint `GET /historias/:pacienteId` indicado en el RBAC del PDF.**

#### **15.1 — Entidad de dominio**

![](images/clipboard-3567733754.png)

#### **15.2 — Excepción: historia clínica no encontrada**

![](images/clipboard-215507517.png)

#### **15.3 — Excepción: el paciente ya tiene historia clínica**

![](images/clipboard-2948224716.png)

#### **15.4 — Interfaz de repositorio**

![](images/clipboard-2322420088.png)

#### **15.5 — Modelo Sequelize (FK única a Patient)**

![](images/clipboard-568709114.png)

#### **15.6 — Repositorio de infraestructura**

![](images/clipboard-4092854535.png)

#### **15.7 — Migración (FK única a `patients`)**

![](images/clipboard-181935930.png)

#### **15.8 — Seeder (una historia clínica por paciente sembrado)**

![](images/clipboard-2263520867.png)

#### **15.9 — DTO de filtro**

![](images/clipboard-1497573982.png)

#### **15.10 — DTO de respuesta**

![](images/clipboard-1773532588.png)

#### **15.11 — DTO de creación**

![](images/clipboard-1800652970.png)

#### **15.12 — DTO de actualización**

![](images/clipboard-3069313213.png)

#### **15.13 — Mapper**

![](images/clipboard-1847734265.png)

#### **15.14 — Use-case: crear historia clínica**

![](images/clipboard-4061182537.png)

#### **15.15 — Use-case: eliminar historia clínica**

![](images/clipboard-3474834031.png)

#### **15.16 — Use-case: obtener historia clínica por id**

![](images/clipboard-1268696106.png)

#### **15.17 — Use-case: obtener historia clínica por paciente (`GET /historias/:pacienteId`)**

![](images/clipboard-2486518115.png)

#### **15.18 — Use-case: listar historias clínicas**

![](images/clipboard-4103466060.png)

#### **15.19 — Use-case: actualizar historia clínica**

![](images/clipboard-314165738.png)

#### **15.20 — Serializer**

![](images/clipboard-2699611962.png)

#### **15.21 — Controller (incluye `GET /historias/:pacienteId`)**

![](images/clipboard-2921887044.png)

#### **15.22 — Barrel `index.ts`**

![](images/clipboard-361135820.png)

#### **15.23 — Módulo `clinical-records.module.ts`**

![](images/clipboard-2201460179.png)

#### **15.24 — Registrar `ClinicalRecordModel` en `sequelize.factory.ts`**

![](images/clipboard-2294734183.png)

#### **15.25 — Actualizar `business.module.ts`**

![](images/clipboard-3434264203.png)

#### **15.26 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-1235065780.png)

#### **15.27 — Verificar tabla física `clinical_records` y API**

![](images/clipboard-1385265418.png)

![](images/clipboard-3815355896.png)

## **FASE 16 — `15_BUSINESS_ENCOUNTERS`**

### **Objetivo de la fase:** Atencion es el registro clínico de lo ocurrido en una cita (`Cita 0..1:1 Atencion`, `Servicio 1:N Atencion`, `HistoriaClinica 1:N Atencion`). Requiere que `AppointmentModel` (Fase 13), `ServiceModel` (Fase 11) y `ClinicalRecordModel` (Fase 15) ya existan. Al crearse, marca la cita asociada como `ATENDIDA` (regla de negocio del PDF: *"Una cita solo pasa a atendida con profesional, paciente y registro clínico"*).

#### **16.1 — Enum de estado de atención**

![](images/clipboard-2621944187.png)

#### **16.2 — Entidad de dominio**

![](images/clipboard-1471280638.png)

#### **16.3 — Excepción: atención no encontrada**

![](images/clipboard-3277904351.png)

#### **16.4 — Excepción: la cita ya tiene atención registrada**

![](images/clipboard-1725793003.png)

#### **16.5 — Excepción: la historia clínica no corresponde al paciente de la cita**

![](images/clipboard-1420906622.png)

#### **16.6 — Interfaz de repositorio**

![](images/clipboard-4011034879.png)

#### **16.7 — Modelo Sequelize (FKs a Appointment, Service y ClinicalRecord)**

![](images/clipboard-1194731527.png)

#### **16.8 — Repositorio de infraestructura**

![](images/clipboard-1075439925.png)

#### **16.9 — Migración (FKs a `appointments`, `services`, `clinical_records`)**

![](images/clipboard-2240441131.png)

#### **16.10 — Seeder (usa cita, servicio e historia clínica ya sembrados)**

![](images/clipboard-2062415409.png)

#### **16.11 — DTO de filtro**

![](images/clipboard-2214958483.png)

#### **16.12 — DTO de respuesta**

![](images/clipboard-1031323164.png)

#### **16.13 — DTO de creación**

![](images/clipboard-3541715740.png)

#### **16.14 — DTO de actualización**

![](images/clipboard-1557351125.png)

#### **16.15 — Mapper**

![](images/clipboard-157258515.png)

#### **16.16 — Use-case: registrar atención (marca la cita como `ATENDIDA`)**

![](images/clipboard-441570810.png)

#### **16.17 — Use-case: eliminar atención**

![](images/clipboard-1011700628.png)

#### **16.18 — Use-case: obtener atención**

![](images/clipboard-3771344729.png)

#### **16.19 — Use-case: listar atenciones**

![](images/clipboard-4225958360.png)

#### **16.20 — Use-case: actualizar atención**

![](images/clipboard-1520055463.png)

#### **16.21 — Serializer**

![](images/clipboard-2271596766.png)

#### **16.22 — Controller**

![](images/clipboard-2214271970.png)

#### **16.23 — Barrel `index.ts`**

![](images/clipboard-3852977788.png)

#### **16.24 — Módulo `encounters.module.ts`**

![](images/clipboard-3221819288.png)

#### **16.25 — Registrar `EncounterModel` en `sequelize.factory.ts`**

![](images/clipboard-2528519140.png)

#### **16.26 — Actualizar `business.module.ts`**

![](images/clipboard-3200517854.png)

#### **16.27 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-3231877587.png)

#### **16.28 — Verificar tabla física `encounters` y transición de cita**

![](images/clipboard-3512139714.png)

![](images/clipboard-4096869873.png)

## **FASE 17 — `16_BUSINESS_INVOICES`**

### **Objetivo de la fase:** Factura agrupa una o más atenciones facturables (`Factura agrupa atenciones facturables`). Como `EncounterModel` (Fase 16) ya existe pero no puede referenciar a `Invoice` (aún no existía), esta fase primero **extiende** Encounter con una FK opcional `invoice_id` mediante una migración adicional, y luego construye Invoice completo.

#### **17.1 — Migración adicional: agregar `invoice_id` a `encounters`**

![](images/clipboard-458927303.png)

#### **17.2 — Extender `EncounterModel` con `invoiceId` (FK opcional)**

![](images/clipboard-2985500537.png)

#### **17.3 — Extender entidad de dominio `Encounter` con `invoiceId`**

![](images/clipboard-2829425124.png)

#### **17.4 — Extender `EncounterMapper` con `invoiceId`**

![](images/clipboard-92141451.png)

#### **17.5 — Entidad de dominio Invoice**

![](images/clipboard-3751060674.png)

#### **17.6 — Excepción: factura no encontrada**

![](images/clipboard-2439711162.png)

#### **17.7 — Excepción: número de factura duplicado**

![](images/clipboard-3488891800.png)

#### **17.8 — Excepción: atención ya facturada**

![](images/clipboard-1440845183.png)

#### **17.9 — Interfaz de repositorio**

![](images/clipboard-3443321258.png)

#### **17.10 — Modelo Sequelize**

![](images/clipboard-2338715442.png)

#### **17.11 — Repositorio de infraestructura**

![](images/clipboard-280812605.png)

#### **17.12 — Migración `create-invoices-table`**

![](images/clipboard-3253464237.png)

**Nota de orden:** esta migración (crear `invoices`) debe ejecutarse **antes** que la del paso 17.1 (agregar `invoice_id` a `encounters`), porque esa columna referencia a `invoices.id`. Coloca este archivo con un timestamp/prefijo anterior si usas `sequelize-cli db:migrate` con orden por nombre de archivo.

#### **17.13 — Seeder (factura demo, sin atenciones asociadas todavía)**

![](images/clipboard-3430894586.png)

#### **17.14 — DTO de filtro**

![](images/clipboard-547632166.png)

#### **17.15 — DTO de respuesta**

![](images/clipboard-2924871101.png)

#### **17.16 — DTO de creación (a partir de atenciones facturables)**

![](images/clipboard-2755431834.png)

#### **17.17 — Mapper**

![](images/clipboard-2633323116.png)

#### **17.18 — Use-case: generar factura a partir de atenciones (IVA 19%)**

![](images/clipboard-3855444357.png)

#### **17.19 — Use-case: marcar factura como pagada**

![](images/clipboard-2589186305.png)

#### **17.20 — Use-case: anular factura**

![](images/clipboard-2924036656.png)

#### **17.21 — Use-case: obtener factura**

![](images/clipboard-3793944072.png)

#### **17.22 — Use-case: listar facturas**

![](images/clipboard-2700640797.png)

#### **17.23 — Use-case: eliminar factura**

![](images/clipboard-531284708.png)

#### **17.24 — Serializer**

![](images/clipboard-1759957022.png)

#### **17.25 — Controller**

![](images/clipboard-33864342.png)

#### **17.26 — Barrel `index.ts`**

![](images/clipboard-3581477774.png)

#### **17.27 — Módulo `invoices.module.ts`**

![](images/clipboard-4253808965.png)

#### **17.28 — Registrar `InvoiceModel` en `sequelize.factory.ts`**

![](images/clipboard-1237820884.png)

#### **17.29 — Actualizar `business.module.ts`**

![](images/clipboard-2987944455.png)

#### **17.30 — Actualizar `database-seeder.service.ts`**

![](images/clipboard-1068979256.png)

#### **17.31 — Verificar tabla física `invoices` y flujo completo de facturación**

![](images/clipboard-3109777475.png)

![](images/clipboard-3483783539.png)

![](images/clipboard-569642085.png)

![![](images/clipboard-83442766.png)](images/clipboard-2535021115.png)
