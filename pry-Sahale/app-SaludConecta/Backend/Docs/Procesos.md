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

#### **9.9 — Mapper**

![](images/clipboard-4206607647.png)

#### **9.10 — Use-case: crear médico**

![](images/clipboard-737367008.png)

#### **9.11 — Use-case: eliminar médico**

![](images/clipboard-3879785435.png)

#### **9.12 — Use-case: obtener médico**

![](images/clipboard-1361212684.png)

#### **9.13 — Use-case: listar médicos**

![](images/clipboard-502330834.png)

#### **9.14 — Use-case: actualizar médico**

![](images/clipboard-1791063202.png)

#### **9.15 — Serializer**

![](images/clipboard-3472537514.png)

#### **9.16 — Controller**

![](images/clipboard-2764228925.png)
