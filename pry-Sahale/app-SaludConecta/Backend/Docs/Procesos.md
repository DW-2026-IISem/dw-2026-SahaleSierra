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
