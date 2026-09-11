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

## **FASE 7 — `06_BUSINESS_CLIENTS`**

### **Objetivo de la fase:** Primera entidad de negocio. Orden lógico: dominio → infraestructura → aplicación → presentación → módulo → cableado → verificación.

#### **7.1 — features/business/clients/domain/entities/client.entity.ts**

![](images/clipboard-2220485878.png)

#### **7.2 — features/business/clients/domain/exceptions/client-email-already-exists.exception.ts**

![](images/clipboard-3537001736.png)

#### **7.3 — features/business/clients/domain/exceptions/client-not-found.exception.ts**

![](images/clipboard-302008372.png)

#### **7.4 — features/business/clients/domain/interfaces/client-repository.interface.ts**

![](images/clipboard-3363818273.png)

#### **7.5 — features/business/clients/domain/validators/client-email.validator.ts**

![](images/clipboard-880237422.png)

#### **7.6 — features/business/clients/domain/validators/client-phone.validator.ts**

![](images/clipboard-3911739625.png)

#### **7.7 — features/business/clients/infrastructure/persistence/models/client.model.ts**

![](images/clipboard-3102815710.png)

#### **7.8 — features/business/clients/infrastructure/persistence/repositories/client.repository.ts**

![](images/clipboard-2861019356.png)

#### **7.9 — features/business/clients/infrastructure/persistence/migrations/create-clients-table.migration.ts**

![](images/clipboard-3056823341.png)

#### **7.10 — features/business/clients/infrastructure/persistence/seeders/clients.seeder.ts**

![](images/clipboard-2174992888.png)

#### **7.11 — features/business/clients/application/dto/client-filter.dto.ts**

![](images/clipboard-2582914929.png)

#### **7.12 — features/business/clients/application/dto/client-response.dto.ts**

![](images/clipboard-4205555839.png)

#### **7.13 — features/business/clients/application/dto/create-client.dto.ts**

![](images/clipboard-3484330468.png)

#### **7.14 — features/business/clients/application/dto/update-client.dto.ts**

![](images/clipboard-1055424161.png)

#### **7.15 — features/business/clients/application/mappers/client.mapper.ts**

![](images/clipboard-2157641425.png)

#### **7.16 — features/business/clients/application/use-cases/create-client.use-case.ts**

![](images/clipboard-2577045680.png)

#### **7.17 — features/business/clients/application/use-cases/delete-client.use-case.ts**

![](images/clipboard-2457229257.png)

#### **7.18 — features/business/clients/application/use-cases/get-client.use-case.ts**

![](images/clipboard-1410425242.png)

#### **7.19 — features/business/clients/application/use-cases/list-clients.use-case.ts**

![](images/clipboard-3460897563.png)

#### **7.20 — features/business/clients/application/use-cases/update-client.use-case.ts**

![](images/clipboard-2454918945.png)

#### **7.21 — features/business/clients/presentation/http/serializers/client.serializer.ts**

![](images/clipboard-3250501001.png)

#### **7.22 — features/business/clients/presentation/http/controllers/clients.controller.ts**

![](images/clipboard-2731932738.png)

#### **7.23 — features/business/clients/index.ts**

![](images/clipboard-2506912647.png)

#### **7.24 — features/business/clients/clients.module.ts**

![](images/clipboard-2910412662.png)

#### **7.25 — Actualizar sequelize.factory.ts (registrar modelos)**

![](images/clipboard-1778324790.png)

#### **7.26 — Actualizar business.module.ts**

![](images/clipboard-390877843.png)

#### **7.27 — Actualizar database-seeder.service.ts**

![](images/clipboard-2533578620.png)

#### **7.28 — Actualizar app.module.ts**

![](images/clipboard-2708200200.png)

#### **7.29 — Verificar tabla física `clients` y API**

![![](images/clipboard-3331245167.png)](images/clipboard-2874231102.png)

## **FASE 8 — `07_BUSINESS_PRODUCT_TYPES`**

### **Objetivo de la fase:** Catálogo de tipos de producto. Misma plantilla CA que Clients.

#### **8.1 — features/business/product-types/domain/entities/product-type.entity.ts**

![](images/clipboard-421001306.png)

#### **8.2 — features/business/product-types/domain/exceptions/product-type-not-found.exception.ts**

![](images/clipboard-80307120.png)

#### **8.3 — features/business/product-types/domain/interfaces/product-type-repository.interface.ts**

![](images/clipboard-4176874929.png)

#### **8.4 — features/business/product-types/infrastructure/persistence/models/product-type.model.ts**

![](images/clipboard-969803041.png)

#### **8.5 — features/business/product-types/infrastructure/persistence/repositories/product-type.repository.ts**

![](images/clipboard-861933875.png)

#### **8.6 — features/business/product-types/infrastructure/persistence/migrations/create-product-types-table.migration.ts**

![](images/clipboard-1719846007.png)

#### **8.7 — features/business/product-types/infrastructure/persistence/seeders/product-types.seeder.ts**

![](images/clipboard-1790769421.png)

#### **8.8 — features/business/product-types/application/dto/create-product-type.dto.ts**

![](images/clipboard-1745722523.png)

#### **8.9 — features/business/product-types/application/dto/product-type-filter.dto.ts**

![](images/clipboard-3362021108.png)

#### **8.10 — features/business/product-types/application/dto/product-type-response.dto.ts**

![](images/clipboard-624969661.png)

#### **8.11 — features/business/product-types/application/dto/update-product-type.dto.ts**

![](images/clipboard-1755429228.png)

#### **8.12 — features/business/product-types/application/mappers/product-type.mapper.ts**

![](images/clipboard-467627559.png)

#### **8.13 — features/business/product-types/application/use-cases/create-product-type.use-case.ts**

![](images/clipboard-3598397083.png)

#### **8.14 — features/business/product-types/application/use-cases/delete-product-type.use-case.ts**

![](images/clipboard-3979999255.png)

#### **8.15 — features/business/product-types/application/use-cases/get-product-type.use-case.ts**

![](images/clipboard-3089108288.png)

#### **8.16 — features/business/product-types/application/use-cases/list-product-types.use-case.ts**

![](images/clipboard-3024324777.png)

#### **8.17 — features/business/product-types/application/use-cases/update-product-type.use-case.ts**

![](images/clipboard-2414304991.png)

#### **8.18 — features/business/product-types/presentation/http/serializers/product-type.serializer.ts**

![](images/clipboard-219672590.png)

#### **8.19 — features/business/product-types/presentation/http/controllers/product-types.controller.ts**

![](images/clipboard-3374218548.png)

#### **8.20 — features/business/product-types/index.ts**

![](images/clipboard-119428718.png)

#### **8.21 — features/business/product-types/product-types.module.ts**

![](images/clipboard-2636580962.png)

#### **8.22 — Actualizar sequelize.factory.ts (registrar modelos)**

![](images/clipboard-3906800964.png)

#### **8.23 — Actualizar business.module.ts**

![](images/clipboard-728811100.png)

#### **8.24 — Actualizar database-seeder.service.ts**

![](images/clipboard-2736698246.png)

#### **8.25 — Actualizar app.module.ts**

![](images/clipboard-3055447753.png)

#### **8.26 — Verificar tabla `product_types`**

![](images/clipboard-2141019718.png)

![](images/clipboard-212724280.png)

## **FASE 9 — `08_BUSINESS_PRODUCTS`**

### **Objetivo de la fase:** Productos dependen de ProductTypes (FK). El modelo usa `require()` lazy para evitar ciclos.

#### **9.1 — features/business/products/domain/entities/product.entity.ts**

![](images/clipboard-288992593.png)

#### **9.2 — features/business/products/domain/exceptions/invalid-product-price.exception.ts**

![](images/clipboard-1759195053.png)

#### **9.3 — features/business/products/domain/exceptions/invalid-product-stock.exception.ts**

![](images/clipboard-2934140948.png)

#### **9.4 — features/business/products/domain/exceptions/product-not-found.exception.ts**

![](images/clipboard-1684728337.png)

#### **9.5 — features/business/products/domain/interfaces/product-repository.interface.ts**

![](images/clipboard-4027414773.png)

#### **9.6 — features/business/products/domain/validators/product-price.validator.ts**

![](images/clipboard-3557323066.png)

#### **9.7 — features/business/products/domain/validators/product-stock.validator.ts**

![](images/clipboard-4040912568.png)

#### **9.8 — features/business/products/infrastructure/persistence/models/product.model.ts**

![](images/clipboard-4148807266.png)

#### **9.9 — features/business/products/infrastructure/persistence/repositories/product.repository.ts**

![](images/clipboard-2832297757.png)

#### **9.10 — features/business/products/infrastructure/persistence/migrations/create-products-table.migration.ts**

![](images/clipboard-3990111203.png)

#### **9.11 — features/business/products/infrastructure/persistence/seeders/products.seeder.ts**
