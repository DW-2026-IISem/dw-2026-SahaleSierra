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
