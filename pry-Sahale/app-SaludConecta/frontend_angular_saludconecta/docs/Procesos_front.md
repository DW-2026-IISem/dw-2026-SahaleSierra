# **Fase I: Frontend — ISS-01 — Bootstrap Angular 22 con CLI, Tailwind y PrimeNG**

### **1.1 Crear el proyecto en la carpeta actual**

![](images/clipboard-2848465694.png)

**PARCHE — `README.md` de la raíz.** El CLI deja un README de plantilla con los comandos de Angular. Lo reemplacé por la presentación breve del proyecto:

![](images/clipboard-76712955.png)

![](images/clipboard-330037328.png)

## **1.2 Instalar PrimeNG compatible con Angular**

![](images/clipboard-4065698206.png)

![](images/clipboard-2228328080.png)

## **1.3 Estilos globales**

![](images/clipboard-1746054152.png)

## **1.4 Entornos (`environment`)**

`app.config.ts` (paso 1.5) importa `environment`, así que lo generé ahora:

![](images/clipboard-1528619713.png)

El comando crea los dos archivos y registra el reemplazo en `angular.json`. Escribí el contenido de cada uno.

`src/environments/environment.ts` — lo usa `ng build`:

![](images/clipboard-2595810193.png)

`src/environments/environment.development.ts` — lo usa `ng serve` y `npm test`:

![](images/clipboard-1862181534.png)

## **1.5 Configurar PrimeNG en `app.config.ts`**

**PARCHE.** El `app.config.ts` que genera el CLI declara solo `provideBrowserGlobalErrorListeners()` y `provideRouter(routes)`. Lo reemplacé casi completo (el cambio abarca todo el archivo), sin perder `provideBrowserGlobalErrorListeners()` y sin agregar todavía `provideHttpClient()`: su lugar es ISS-02.

![](images/clipboard-3301265367.png)

## **1.6 Licencia de PrimeNG 22**

![](images/clipboard-2983577861.png)

![](images/clipboard-4011419908.png)

## **1.7 Componente `demo/example` (clase)**

src/app/demo/example/example.ts

![](images/clipboard-3659390402.png)

## **1.8 Componente `demo/example` (plantilla, estilos y prueba)**

#### src/app/demo/example/example.html

![](images/clipboard-4222916348.png)

#### **`src/app/demo/example/example.css`** — la única excepción de CSS propio del proyecto:

![](images/clipboard-4126636324.png)

#### src/app/demo/example/example.spec.ts

![](images/clipboard-2656645064.png)

## **1.9 `App` compone `demo/example`**

src/app/app.ts

![](images/clipboard-2893928339.png)

src/app/app.html

![](images/clipboard-365105822.png)

src/app/app.css

![](images/clipboard-3064961065.png)

## **1.10 Rutas vacías**

- [ ] `app.routes.ts` exporta `routes` vacío

  ![](images/clipboard-1806184330.png)

## **1.11 Pruebas de `App`**

**PARCHE — prueba del componente.** La prueba generada por el CLI busca el `<h1>` de la plantilla por defecto y **falla** después de reemplazar `app.html`. La sustituí por pruebas de la composición:

![](images/clipboard-3952920202.png)

## **1.12 Personalizar `index.html`**

![](images/clipboard-2487218293.png)

## **1.13 Ajustar el presupuesto de build**

El bundle inicial con PrimeNG supera los 500 kB por defecto. En `angular.json`, dentro de `projects → … → architect → build → configurations → production → budgets`, **cambié** el primer presupuesto por:

![](images/clipboard-2574530018.png)

## **1.14 Primera ejecución**

![](images/clipboard-1504575803.png)

![](images/clipboard-139598772.png)

## **Verificación del ISS**

``` bash
# 1. El proyecto debe compilar
ng build

# 2. Debe imprimir la configuración de Tailwind/PrimeNG
grep -R "providePrimeNG\|@import 'tailwindcss'" src | head

# 3. Versiones compatibles
npm ls primeng @primeuix/themes primeicons @angular/cdk --depth=0

# 4. Presupuesto y estilos
node -e "const a=require('./angular.json');const p=a.projects[Object.keys(a.projects)[0]];console.log(p.architect.build.configurations.production.budgets[0])"
cat src/styles.css

# 5. Entornos y marca
grep -n "appName\|apiUrl" src/environments/environment.ts src/environments/environment.development.ts
grep -n "<title>" src/index.html

# 6. La composición y el componente de ejemplo declaran signals
grep -n "imports: \[Example\]" src/app/app.ts
grep -n "app-example" src/app/app.html
grep -n "signal(\|computed(\|effect(" src/app/demo/example/example.ts

# 7. Pruebas de App y del componente de ejemplo
npm test -- --watch=false
```

![](images/clipboard-2072006756.png)

## **Cierre del ISS**

![](images/clipboard-3145299549.png)

# **Fase I: Frontend — ISS-01A — Esqueleto Header / Aside / contenido / Footer**

## **1A.2 Generar las tres piezas de `layout/`**

![](images/clipboard-776202066.png)

![](images/clipboard-1609897611.png)

## **1A.3 `header.ts` y `header.html`**

#### src/app/layout/header/header.ts

![](images/clipboard-2687779289.png)

#### src/app/layout/header/header.html

![](images/clipboard-3488264675.png)

## **1A.4 `aside.ts` y `aside.html`**

#### src/app/layout/aside/aside.ts

![](images/clipboard-385362805.png)

#### src/app/layout/aside/aside.html

![](images/clipboard-1143189373.png)

## **1A.5 `footer.ts` y `footer.html`**

#### src/app/layout/footer/footer.ts

![](images/clipboard-287813612.png)

#### src/app/layout/footer/footer.html

![](images/clipboard-1589135423.png)

## **1A.6 Los tres `.css`**

- [ ] Cada archivo contiene **solo un comentario**; no hay reglas

![](images/clipboard-1263283946.png)

## **1A.7 Componer las cuatro regiones en `App`**

#### src/app/app.ts

![](images/clipboard-3816422296.png)

#### src/app/app.html

![](images/clipboard-480863017.png)

## **1A.8 Prueba de la composición**

![](images/clipboard-2923339046.png)

## **1A.9 Comprobar antes de avanzar**

![](images/clipboard-794619493.png)

![](images/clipboard-1413049673.png)

## **Verificación del ISS**

``` bash
# 1. Compila
ng build

# 2. Existen las tres piezas con sus tres archivos
ls src/app/layout/header src/app/layout/aside src/app/layout/footer

# 3. App declara los tres imports y compone las regiones
grep -n "imports: \[Header, Aside, Footer\]" src/app/app.ts
grep -n "app-header\|app-aside\|app-footer" src/app/app.html

# 4. demo/example ya no se compone
grep -c "app-example" src/app/app.html || echo "no aparece: correcto"

# 5. Los CSS de layout no tienen reglas (ninguno contiene llaves)
for f in src/app/layout/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 6. Pruebas
npm test -- --watch=false
```

![](images/clipboard-1711404736.png)

## **Cierre del ISS**

![](images/clipboard-383638332.png)

# **Fase I: Frontend — ISS-01B — Menú PrimeNG y primera interacción**

### **1B.2 `aside.ts`**

**PARCHE — reemplazo completo.** El archivo cambia casi todo (imports, entradas y salidas), así que lo reemplacé entero:

![](images/clipboard-968803027.png)

### **1B.3 `aside.html`**

![](images/clipboard-2284809007.png)

### **1B.4 Logotipo de SaludConecta**

![](images/clipboard-1593961390.png)

### **1B.5 `header.ts`**

**PARCHE — reemplazo completo:**

![](images/clipboard-3154832081.png)

### **1B.6 `header.html`**

![](images/clipboard-329240083.png)

### **1B.7 `media-query.ts`**

![](images/clipboard-1860383914.png)

### **1B.8 Generar la pantalla `prototype`**

![](images/clipboard-587019105.png)

### **1B.9 `prototype.ts`**

![](images/clipboard-2459599418.png)

### **1B.10 `prototype.html`**

![](images/clipboard-2079188026.png)

### **1B.11 `prototype.css`**

![](images/clipboard-1669523887.png)

### **1B.12 `prototype.spec.ts`**

![](images/clipboard-2548625396.png)

### **1B.13 `App` como punto de entrada con `router-outlet`**

#### **`src/app/app.ts`** — reemplazo completo:

![](images/clipboard-4032388890.png)

#### **`src/app/app.html`** — reemplazo completo:

![](images/clipboard-3635866771.png)

#### **`src/app/app.routes.ts`** — reemplazo completo:

![](images/clipboard-679252519.png)

### **1B.14 Prueba del punto de entrada**

![](images/clipboard-1138929675.png)

### **1B.15 Comprobar antes de avanzar**

![](images/clipboard-3848496146.png)

![](images/clipboard-4231206222.png)

### **Verificación del ISS**

``` bash
# 1. Compila y separa el chunk diferido
ng build

# 2. El Aside recibe el menú y el Header emite el aviso
grep -n "input<MenuItem\[\]>" src/app/layout/aside/aside.ts
grep -n "menuRequested" src/app/layout/header/header.ts

# 2b. El botón no se esconde en escritorio
grep -rn "lg:hidden" src/app/layout/header/header.html || echo "sin lg:hidden: correcto"

# 3. La pantalla tiene el estado y compone el layout
grep -n "signal(" src/app/features/prototype/prototype.ts
grep -n "app-header\|app-aside\|app-footer\|p-drawer" src/app/features/prototype/prototype.html

# 4. App es solo el outlet y las rutas cargan diferido
grep -n "RouterOutlet" src/app/app.ts
grep -n "loadComponent" src/app/app.routes.ts

# 5. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/layout/*/*.css src/app/features/prototype/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 6. Pruebas
npm test -- --watch=false
```

![](images/clipboard-4268713944.png)

### **Cierre del ISS**

![![](images/clipboard-1733241352.png)](images/clipboard-1428170146.png)

# **Fase I: Frontend — ISS-02 — Núcleo: environment, modelos, servicios y layout**

## **2.1 `environment`: una sola URL para todo el frente**

![](images/clipboard-1467147546.png)

## **2.2 Modelos: reflejar el backend, no inventarlo**

![](images/clipboard-2521636047.png)

### **2.2.1 `api.model.ts` — los tipos que comparten todos**

![](images/clipboard-3389377191.png)

### **2.2.2 Patient, Specialty, Doctor y Service**

![](images/clipboard-848250278.png)

![](images/clipboard-3661645430.png)

![](images/clipboard-2231536051.png)

![](images/clipboard-4224414171.png)

### **2.2.3 DoctorSpecialty, Agenda y Appointment**

![](images/clipboard-1681033399.png)

![](images/clipboard-1751260393.png)

![](images/clipboard-3126130295.png)

### **2.2.4 ClinicalRecord y Authorization**

![](images/clipboard-3899564955.png)

![](images/clipboard-2193399598.png)

### **2.2.5 Encounter e Invoice**

![](images/clipboard-1922581682.png)

![](images/clipboard-2883984774.png)

### **2.2.6 Seguridad: User, Role, Resource y los dos pivotes**

![](images/clipboard-2595704794.png)

![](images/clipboard-103389000.png)

![](images/clipboard-1781251242.png)

![](images/clipboard-3917928951.png)

![](images/clipboard-3408536922.png)

### **2.2.7 `auth.model.ts` y `dashboard.model.ts`**

![](images/clipboard-3000833972.png)

![](images/clipboard-3425836199.png)

## **2.3 Confirmar las envolturas con `curl`**

``` bash
B=http://localhost:4000/api
for r in patients specialties doctors doctor-specialties services agendas appointments clinical-records authorizations encounters invoices; do
  echo -n "$r -> "
  curl -s $B/$r | node -pe "Object.keys(JSON.parse(require('fs').readFileSync(0))).join(',')"
done
```

![](images/clipboard-806297768.png)

``` bash
curl -s http://localhost:4000/api/encounters | grep -o '"id":[0-9]*,"appointment_id"[^}]*"state":"completed"[^}]*"invoice_id":null' | grep -o '^"id":[0-9]*'
curl -s -X POST $B/invoices -H 'Content-Type: application/json' \
  -d '{"number":"FV-ISS02","tax":0,"encounter_ids":[ID_ATENCION]}' \
  | node -pe "Object.keys(JSON.parse(require('fs').readFileSync(0))).join(',')"
```

![](images/clipboard-696005545.png)

## **2.4 Servicios HTTP de negocio**

![](images/clipboard-936651556.png)

### **2.4.1 `patient-api.ts` — el patrón completo**

![](images/clipboard-1453304816.png)

### **2.4.2 Los catálogos simples: Specialty, Doctor y Service**

![](images/clipboard-1278279455.png)

![](images/clipboard-3797400000.png)

![](images/clipboard-941340398.png)

### **2.4.3 El pivote DoctorSpecialty y la FK Agenda**

![](images/clipboard-2395658841.png)

![](images/clipboard-81792778.png)

### **2.4.4 Appointment, ClinicalRecord y Authorization**

![](images/clipboard-2116007580.png)

![](images/clipboard-2763197881.png)

![](images/clipboard-967186082.png)

### **2.4.5 Encounter e Invoice (los dos transaccionales)**

![](images/clipboard-3324575793.png)

![](images/clipboard-3394599760.png)

## **2.5 Servicios HTTP de administración de seguridad**

![](images/clipboard-357653334.png)

![](images/clipboard-3624205797.png)

![](images/clipboard-3862447892.png)

![](images/clipboard-1422359690.png)

![](images/clipboard-3011995482.png)

![](images/clipboard-282139347.png)

## **2.6 Pruebas de los servicios con `HttpTestingController`**

#### **`src/app/features/patients/patient-api.spec.ts`** (3 pruebas)

![](images/clipboard-3479265317.png)

#### **`src/app/features/admin/role-users/role-user-api.spec.ts`** (1 prueba)

![](images/clipboard-708866503.png)

#### **`src/app/features/admin/resource-roles/resource-role-api.spec.ts`** (2 pruebas)

![](images/clipboard-1750453580.png)

#### **`src/app/features/encounters/encounter-api.spec.ts`** (1 prueba)

![](images/clipboard-124918560.png)

#### **`src/app/features/invoices/invoice-api.spec.ts`** (2 pruebas: las dos formas del `201`)

![](images/clipboard-2089366940.png)

## **2.7 Utilidades transversales: `toApiMessage` y `NotificationService`**

![](images/clipboard-2514656070.png)

#### src/app/core/utils/api-error.ts

![](images/clipboard-334248065.png)

#### **`src/app/core/utils/api-error.spec.ts`** (4 pruebas)

![](images/clipboard-4276208939.png)

#### src/app/core/services/notification.ts

![](images/clipboard-2082636084.png)

## **2.8 Componentes compartidos: `PageHeader`, `EmptyState`, `StatusTag`**

![](images/clipboard-1893058807.png)

#### page-header

![](images/clipboard-3992493320.png)

#### empty-state

![](images/clipboard-3662839490.png)

#### status-tag

![](images/clipboard-4228291580.png)

#### **`status-tag.spec.ts`** (3 pruebas)

![](images/clipboard-3071014098.png)

## **2.9 `Shell`: conservar el esqueleto al navegar**

![](images/clipboard-1421429810.png)

#### src/app/layout/shell/shell.ts

![](images/clipboard-275368567.png)

#### src/app/layout/shell/shell.html

![](images/clipboard-2296300152.png)

#### **`src/app/layout/shell/shell.spec.ts`** (2 pruebas)

![](images/clipboard-2363670368.png)

## **2.10 Rutas**

#### **`src/app/app.routes.ts`** — reemplazo completo:

![](images/clipboard-3809882104.png)

## **2.11 Registrar `HttpClient` sin interceptores de sesión**

#### **PARCHE — `src/app/app.config.ts`**

**1.** **Debajo de** `import { providePrimeNG } from 'primeng/config';`, **añadí:**

``` typescript
import { provideHttpClient } from '@angular/common/http'; 
```

![](images/clipboard-823848629.png)

**2.** **Encima de** `MessageService,` (después del bloque `providePrimeNG({ ... }),`), **añadí:**

``` typescript
    // Habilita la inyección de HttpClient en los servicios `*Api`.
    // Sin interceptores de sesión: el authInterceptor llega en ISS-15.
    provideHttpClient(),
```

![](images/clipboard-247161791.png)

## **2.12 Comprobar antes de avanzar**

![](images/clipboard-228694975.png)

## **Verificación del ISS**

``` bash
# 1. Compila y separa los chunks diferidos
ng build

# 2. La URL del backend existe una sola vez por entorno
grep -n "apiUrl" src/environments/environment.ts src/environments/environment.development.ts

# 3. Los 19 modelos existen
ls src/app/core/models/*.model.ts | wc -l

# 4. Los servicios desenvuelven con map (11 de negocio + 5 de administración)
grep -rn "\.pipe(" src/app/features --include=*-api.ts | wc -l

# 5. HttpClient registrado, sin interceptores
grep -n "provideHttpClient" src/app/app.config.ts
grep -rn "withInterceptors" src/app/app.config.ts || echo "sin interceptores: correcto"

# 6. Las envolturas especiales están bien escritas
grep -n "assignments\|grants" src/app/features/admin/*/*-api.ts

# 7. Los CSS compartidos no tienen reglas
for f in src/app/shared/ui/*/*.css src/app/layout/shell/shell.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 8. Pruebas
npm test -- --watch=false
```

![](images/clipboard-857771544.png)

## **Cierre del ISS**

![](images/clipboard-2816014543.png)

![](images/clipboard-3216086028.png)

# **Fase I: Frontend — ISS-03 — CRUD de pacientes con Signals**

## **3.1 Generar componentes con el CLI**

![](images/clipboard-3628557828.png)

## **3.2 Utilidad de filtro local**

#### src/app/core/utils/filter-rows.ts

![](images/clipboard-570244398.png)

#### **`src/app/core/utils/filter-rows.spec.ts`** (5 pruebas)

![](images/clipboard-4085984323.png)

## **3.3 Mensajes claros para duplicados y claves foráneas (`api-error`)**

**PARCHE — reemplazo completo** de `src/app/core/utils/api-error.ts` (el cambio está en la rama del cuerpo con `error`):

![](images/clipboard-4244884502.png)

**PARCHE — reemplazo completo** de `src/app/core/utils/api-error.spec.ts` (ahora 6 pruebas; la de «detalle» cambia su texto para no chocar con la traducción):

![](images/clipboard-860885995.png)

## **3.4 `patient-form.ts`**

![](images/clipboard-1565852352.png)

## **3.5 `patient-form.html` y `patient-form.css`**

![](images/clipboard-2005691468.png)

## **3.6 `patient-form.spec.ts`**

![](images/clipboard-2108021552.png)

## **3.7 `patient-list.ts`**

![](images/clipboard-740087849.png)

![](images/clipboard-2090511483.png)

## **3.8 `patient-list.html`**

![](images/clipboard-1094147378.png)

![](images/clipboard-3286496839.png)

## **3.9 `patient-list.spec.ts`**

![](images/clipboard-2207694972.png)

![](images/clipboard-2090352146.png)

## **3.10 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** Dentro de `children` del `Shell` **reemplacé** la línea `{ path: '', pathMatch: 'full', redirectTo: '/prototype' },` (y su comentario) por:

![](images/clipboard-3537876438.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **encima de** la entrada `Prototipo`, **añadí:**

![](images/clipboard-310831559.png)

## **3.11 Comprobar antes de avanzar**

![](images/clipboard-3416823218.png)

![](images/clipboard-698753831.png)

## **Verificación del ISS**

``` bash
# 1. La utilidad de filtro es pura y está probada
grep -n "export function filterRows" src/app/core/utils/filter-rows.ts
ls src/app/core/utils/filter-rows.spec.ts

# 2. El formulario no llama a la API: solo emite
grep -n "output<PatientPayload>\|output<void>" src/app/features/patients/patient-form/patient-form.ts
grep -n "inject(PatientApi)\|HttpClient" src/app/features/patients/patient-form/patient-form.ts || echo "sin API en el formulario: correcto"

# 3. La lista usa computed y no tiene métodos de filtrado imperativos
grep -n "computed(" src/app/features/patients/patient-list/patient-list.ts
grep -n "applyFilter" src/app/features/patients/patient-list/patient-list.ts || echo "sin applyFilter: correcto"

# 4. Las plantillas de la tabla usan la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/patients/patient-list/patient-list.html
grep -n "pTemplate=" src/app/features/patients/patient-list/patient-list.html || echo "sin pTemplate: correcto"

# 5. La ruta existe y el menú apunta a ella
grep -n "patients" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 6. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/patients/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 7. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-4215886583.png)

## **Cierre del ISS**

![![](images/clipboard-4103104547.png)](images/clipboard-1159934236.png)

# **Fase I: Frontend — ISS-04 — CRUD de especialidades**

## **4.2 Generar con el CLI**

![](images/clipboard-784984021.png)

## **4.3 Servicio y su prueba**

**`src/app/features/specialties/specialty-api.spec.ts`** (6 pruebas)

![](images/clipboard-1248312512.png)

## **4.4 `specialty-form.ts`**

![](images/clipboard-2523066084.png)

## **4.5 `specialty-form.html` y `specialty-form.css`**

![](images/clipboard-580942931.png)

## **4.6 `specialty-form.spec.ts`**

![](images/clipboard-1871694266.png)

## **4.7 `specialty-list.ts`**

![](images/clipboard-2698416569.png)

![](images/clipboard-800313899.png)

## **4.8 `specialty-list.html` y `specialty-list.css`**

![](images/clipboard-1709565834.png)

![](images/clipboard-2921502063.png)

## **4.9 `specialty-list.spec.ts`**

![](images/clipboard-2320142798.png)

![](images/clipboard-557577562.png)

## **4.10 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Debajo de** la ruta `patients` (dentro de `children` del `Shell`, antes del `],` que cierra `children`), **añadí:**

![](images/clipboard-3395428357.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **debajo de** la entrada `Pacientes`, **añadí:**

![](images/clipboard-2263019406.png)

## **4.11 Comprobar antes de avanzar**

![](images/clipboard-3533602343.png)

![](images/clipboard-1499659408.png)

## **Verificación del ISS**

``` bash
# 1. El servicio ya existía y ahora tiene prueba
ls src/app/features/specialties/specialty-api.ts src/app/features/specialties/specialty-api.spec.ts

# 2. El formulario no llama a la API: solo emite
grep -n "output<SpecialtyPayload>\|output<void>" src/app/features/specialties/specialty-form/specialty-form.ts
grep -n "inject(SpecialtyApi)\|HttpClient" src/app/features/specialties/specialty-form/specialty-form.ts || echo "sin API en el formulario: correcto"

# 3. La lista usa computed y filterRows
grep -n "computed(\|filterRows" src/app/features/specialties/specialty-list/specialty-list.ts
grep -n "applyFilter" src/app/features/specialties/specialty-list/specialty-list.ts || echo "sin applyFilter: correcto"

# 4. Las plantillas de la tabla usan la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/specialties/specialty-list/specialty-list.html
grep -n "pTemplate=" src/app/features/specialties/specialty-list/specialty-list.html || echo "sin pTemplate: correcto"

# 5. La ruta existe y el menú apunta a ella
grep -n "specialties" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 6. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/specialties/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 7. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-1580537825.png)

## **Cierre del ISS**

![![](images/clipboard-3439726944.png)](images/clipboard-1792319964.png)

# **Fase I: Frontend — ISS-05 — CRUD de servicios**

## **5.2 Generar con el CLI**

![](images/clipboard-3841385860.png)

## **5.3 Servicio y su prueba**

**`src/app/features/services/service-api.spec.ts`** (6 pruebas)

![](images/clipboard-404053220.png)

## **5.4 `service-form.ts`**

![](images/clipboard-2108976918.png)

## **5.5 `service-form.html` y `service-form.css`**

![](images/clipboard-445029128.png)

## **5.6 `service-form.spec.ts`**

![](images/clipboard-4050598459.png)

## **5.7 `service-list.ts`**

![](images/clipboard-438851839.png)

![](images/clipboard-1355957198.png)

## **5.8 `service-list.html` y `service-list.css`**

![](images/clipboard-3217065620.png)

![](images/clipboard-969784286.png)

## **5.9 `service-list.spec.ts`**

![](images/clipboard-715764729.png)

![](images/clipboard-3303277548.png)

## **5.10 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Debajo de** la ruta `services` (dentro de `children` del `Shell`, antes del `],` que cierra `children`), **añadí:**

![](images/clipboard-1284603646.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **debajo de** la entrada `Servicios`, **añadí:**

![](images/clipboard-1429351387.png)

## **5.11 Comprobar antes de avanzar**

![](images/clipboard-3243401750.png)

![](images/clipboard-3785570645.png)

## **Verificación del ISS**

``` bash
# 1. El servicio ya existía y ahora tiene prueba
ls src/app/features/services/service-api.ts src/app/features/services/service-api.spec.ts

# 2. El formulario no llama a la API: solo emite
grep -n "output<ServicePayload>\|output<void>" src/app/features/services/service-form/service-form.ts
grep -n "inject(ServiceApi)\|HttpClient" src/app/features/services/service-form/service-form.ts || echo "sin API en el formulario: correcto"

# 3. La lista usa computed y filterRows
grep -n "computed(\|filterRows" src/app/features/services/service-list/service-list.ts
grep -n "applyFilter" src/app/features/services/service-list/service-list.ts || echo "sin applyFilter: correcto"

# 4. Las plantillas de la tabla usan la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/services/service-list/service-list.html
grep -n "pTemplate=" src/app/features/services/service-list/service-list.html || echo "sin pTemplate: correcto"

# 5. La ruta existe y el menú apunta a ella
grep -n "services" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 6. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/services/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 7. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-2150156941.png)

## **Cierre del ISS**

![](images/clipboard-2533986007.png)

# **Fase I: Frontend — ISS-06 — CRUD de médicos**

## **6.2 Generar con el CLI**

![](images/clipboard-2104318963.png)

## **6.3 Servicio y su prueba**

**`src/app/features/doctors/doctor-api.spec.ts`** (6 pruebas)

![](images/clipboard-3155998576.png)

## **6.4 `doctor-form.ts`**

![](images/clipboard-2640129278.png)

## **6.5 `doctor-form.html` y `doctor-form.css`**

![](images/clipboard-2513531302.png)

## **6.6 `doctor-form.spec.ts`**

![](images/clipboard-2692616626.png)

## **6.7 `doctor-list.ts`**

![](images/clipboard-1815582006.png)

![](images/clipboard-1002406759.png)

## **6.8 `doctor-list.html` y `doctor-list.css`**

![](images/clipboard-355460484.png)

## **6.9 `doctor-list.spec.ts`**

![](images/clipboard-3472377700.png)

![](images/clipboard-2480336981.png)

## **6.10 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Debajo de** la ruta `services` (dentro de `children` del `Shell`, antes del `],` que cierra `children`), **añadí:**

![](images/clipboard-3549060674.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **debajo de** la entrada `Servicios`, **añadí:**

![](images/clipboard-2607717937.png)

## **6.11 Comprobar antes de avanzar**

![](images/clipboard-1055792989.png)

![](images/clipboard-1487759108.png)

## **Verificación del ISS**

``` bash
# 1. El servicio ya existía y ahora tiene prueba
ls src/app/features/doctors/doctor-api.ts src/app/features/doctors/doctor-api.spec.ts

# 2. El formulario no llama a la API: solo emite
grep -n "output<DoctorPayload>\|output<void>" src/app/features/doctors/doctor-form/doctor-form.ts
grep -n "inject(DoctorApi)\|HttpClient" src/app/features/doctors/doctor-form/doctor-form.ts || echo "sin API en el formulario: correcto"

# 3. La lista usa computed y filterRows
grep -n "computed(\|filterRows" src/app/features/doctors/doctor-list/doctor-list.ts
grep -n "applyFilter" src/app/features/doctors/doctor-list/doctor-list.ts || echo "sin applyFilter: correcto"

# 4. Las plantillas de la tabla usan la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/doctors/doctor-list/doctor-list.html
grep -n "pTemplate=" src/app/features/doctors/doctor-list/doctor-list.html || echo "sin pTemplate: correcto"

# 5. La ruta existe y el menú apunta a ella
grep -n "doctors" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 6. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/doctors/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 7. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-1143056972.png)

## **Cierre del ISS**

![](images/clipboard-2293167707.png)

![](images/clipboard-3303088606.png)

# **Fase I: Frontend — ISS-07 — Médicos ↔ especialidades (pivote)**

## **7.2 Generar con el CLI**

![](images/clipboard-677922491.png)

## **7.3 Servicio y su prueba**

**`src/app/features/doctor-specialties/doctor-specialty-api.spec.ts`** (6 pruebas)

![](images/clipboard-3490299496.png)

## **7.4 `doctor-specialty-form.ts`**

![](images/clipboard-743315740.png)

## **7.5 `doctor-specialty-form.html` y `doctor-specialty-form.css`**

![](images/clipboard-3172827051.png)

## **7.6 `doctor-specialty-form.spec.ts`**

![](images/clipboard-2417672908.png)

## **7.7 `doctor-specialty-list.ts`**

![](images/clipboard-1501476428.png)

![](images/clipboard-190989579.png)

## **7.8 `doctor-specialty-list.html` y `doctor-specialty-list.css`**

![](images/clipboard-3724391540.png)

![](images/clipboard-2878395470.png)

## **7.9 `doctor-specialty-list.spec.ts`**

![](images/clipboard-4195499342.png)

![](images/clipboard-101931782.png)

## **7.10 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Debajo de** la ruta `doctors` (dentro de `children` del `Shell`, antes del `],` que cierra `children`), **añadí:**

![](images/clipboard-1993348701.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **debajo de** la entrada `Médicos`, **añadí:**

![](images/clipboard-120850018.png)

## **7.11 Comprobar antes de avanzar**

![](images/clipboard-4149196284.png)

![](images/clipboard-2681126370.png)

## **Verificación del ISS**

``` bash
# 1. El servicio ya existía y ahora tiene prueba
ls src/app/features/doctor-specialties/doctor-specialty-api.ts src/app/features/doctor-specialties/doctor-specialty-api.spec.ts

# 2. El formulario no llama a la API: solo emite
grep -n "output<DoctorSpecialtyPayload>\|output<void>" src/app/features/doctor-specialties/doctor-specialty-form/doctor-specialty-form.ts
grep -n "inject(.*Api)\|HttpClient" src/app/features/doctor-specialties/doctor-specialty-form/doctor-specialty-form.ts || echo "sin API en el formulario: correcto"

# 3. La lista carga en paralelo y usa computed
grep -n "forkJoin" src/app/features/doctor-specialties/doctor-specialty-list/doctor-specialty-list.ts
grep -n "computed(" src/app/features/doctor-specialties/doctor-specialty-list/doctor-specialty-list.ts
grep -n "applyFilter" src/app/features/doctor-specialties/doctor-specialty-list/doctor-specialty-list.ts || echo "sin applyFilter: correcto"

# 4. Los selects guardan el id, no el objeto
grep -n "optionValue=\"id\"" src/app/features/doctor-specialties/doctor-specialty-form/doctor-specialty-form.html

# 5. Las plantillas de la tabla usan la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/doctor-specialties/doctor-specialty-list/doctor-specialty-list.html
grep -n "pTemplate=" src/app/features/doctor-specialties/doctor-specialty-list/doctor-specialty-list.html || echo "sin pTemplate: correcto"

# 6. La ruta existe y el menú apunta a ella
grep -n "doctor-specialties" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 7. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/doctor-specialties/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 8. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-3250343767.png)

## **Cierre del ISS**

![](images/clipboard-2474284390.png)

![](images/clipboard-3321283456.png)

# **Fase I: Frontend — ISS-08 — Agendas de médicos**

## **8.1 Endpoint y contrato**

![](images/clipboard-3249282452.png)

## **8.2 Generar con el CLI**

![](images/clipboard-1642746257.png)

## **8.3 Servicio y su prueba**

**`src/app/features/agendas/agenda-api.spec.ts`** (6 pruebas)

![](images/clipboard-1482388570.png)

## **8.4 `agenda-form.ts`**

![](images/clipboard-477914118.png)

## **8.5 `agenda-form.html` y `agenda-form.css`**

![](images/clipboard-2718007677.png)

## **8.6 `agenda-form.spec.ts`**

![](images/clipboard-3567188526.png)

## **8.7 `agenda-list.ts`**

![](images/clipboard-1678999280.png)

![](images/clipboard-2722041885.png)

## **8.8 `agenda-list.html` y `agenda-list.css`**

![](images/clipboard-229031431.png)

![](images/clipboard-3261828255.png)

## **8.9 `agenda-list.spec.ts`**

![](images/clipboard-4074149635.png)

![](images/clipboard-3736693336.png)

## **8.10 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Debajo de** la ruta `doctor-specialties` (dentro de `children` del `Shell`, antes del `],` que cierra `children`), **añadí:**

![](images/clipboard-2790531446.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **debajo de** la entrada `Médicos y especialidades`, **añadí:**

![](images/clipboard-3675696414.png)

## **8.11 Comprobar antes de avanzar**

![](images/clipboard-173501861.png)

![](images/clipboard-4059417581.png)

## **Verificación del ISS**

``` bash
# 1. El servicio ya existía y ahora tiene prueba
ls src/app/features/agendas/agenda-api.ts src/app/features/agendas/agenda-api.spec.ts

# 2. El formulario no llama a la API: solo emite
grep -n "output<AgendaPayload>\|output<void>" src/app/features/agendas/agenda-form/agenda-form.ts
grep -n "inject(.*Api)\|HttpClient" src/app/features/agendas/agenda-form/agenda-form.ts || echo "sin API en el formulario: correcto"

# 3. La lista carga en paralelo y usa computed y filterRows
grep -n "forkJoin" src/app/features/agendas/agenda-list/agenda-list.ts
grep -n "computed(\|filterRows" src/app/features/agendas/agenda-list/agenda-list.ts
grep -n "applyFilter" src/app/features/agendas/agenda-list/agenda-list.ts || echo "sin applyFilter: correcto"

# 4. El select guarda el id, no el objeto
grep -n "optionValue=\"id\"" src/app/features/agendas/agenda-form/agenda-form.html

# 5. Las plantillas de la tabla usan la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/agendas/agenda-list/agenda-list.html
grep -n "pTemplate=" src/app/features/agendas/agenda-list/agenda-list.html || echo "sin pTemplate: correcto"

# 6. La ruta existe y el menú apunta a ella
grep -n "agendas" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 7. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/agendas/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 8. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-2316146276.png)

## **Cierre del ISS**

![](images/clipboard-3538518132.png)

![](images/clipboard-4182252981.png)

# **Fase I: Frontend — ISS-09 — Historias clínicas (relación 1:1 con paciente)**

## **9.1 Modelo y reglas del backend**

![](images/clipboard-906670882.png)

## **9.2 Generar con el CLI**

![](images/clipboard-1579678304.png)

## **9.3 Traducir el error de «paciente ya tiene historia» (`api-error`)**

**PARCHE — `src/app/core/utils/api-error.ts`.** **Dentro de** la rama `if (body && typeof body === 'object' && body.error) {`, **encima de** la línea `const detail = body.detail ?? '';`, **añadí:**

![](images/clipboard-4041922592.png)

**`src/app/core/utils/api-error-clinical-record.spec.ts`** (1 prueba, en archivo aparte para no tocar la prueba existente)

![](images/clipboard-109841509.png)

## **9.4 `clinical-record-form.ts`**

![](images/clipboard-2584530279.png)

![](images/clipboard-218743645.png)

## **9.5 `clinical-record-form.html` y `clinical-record-form.css`**

![](images/clipboard-1103534337.png)

## **9.6 `clinical-record-form.spec.ts`**

![](images/clipboard-1231533593.png)

![](images/clipboard-4278235612.png)

## **9.7 `clinical-record-list.ts`**

![](images/clipboard-165698551.png)

![](images/clipboard-1815946764.png)

## **9.8 `clinical-record-list.html` y `clinical-record-list.css`**

![](images/clipboard-1383137325.png)

![](images/clipboard-1084110557.png)

![](images/clipboard-3771958558.png)

## **9.9 `clinical-record-list.spec.ts`**

![](images/clipboard-2266266448.png)

![](images/clipboard-3270944421.png)

## **9.10 Prueba del servicio**

**`src/app/features/clinical-records/clinical-record-api.spec.ts`** (8 pruebas)

![](images/clipboard-386133935.png)

## **9.11 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Dentro de** `children` del `Shell`, **encima del** `],` que cierra esa lista (debajo de la última ruta hija que tengas), **añadí:**

![](images/clipboard-3866899320.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **encima de** la entrada `Prototipo`, **añadí:**

![](images/clipboard-2549376978.png)

## **9.12 Comprobar antes de avanzar**

![](images/clipboard-3266227645.png)

![](images/clipboard-3502970226.png)

## **Verificación del ISS**

``` bash
# 1. El formulario no llama a la API: solo emite
grep -n "output<ClinicalRecordPayload>\|output<ClinicalRecordUpdatePayload>\|output<void>" \
  src/app/features/clinical-records/clinical-record-form/clinical-record-form.ts
grep -n "inject(ClinicalRecordApi)\|inject(PatientApi)\|HttpClient" \
  src/app/features/clinical-records/clinical-record-form/clinical-record-form.ts || echo "sin API en el formulario: correcto"

# 2. La lista carga en paralelo y usa computed
grep -n "forkJoin" src/app/features/clinical-records/clinical-record-list/clinical-record-list.ts
grep -n "computed(" src/app/features/clinical-records/clinical-record-list/clinical-record-list.ts
grep -n "applyFilter" src/app/features/clinical-records/clinical-record-list/clinical-record-list.ts || echo "sin applyFilter: correcto"

# 3. La tabla usa la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/clinical-records/clinical-record-list/clinical-record-list.html
grep -n "pTemplate=" src/app/features/clinical-records/clinical-record-list/clinical-record-list.html || echo "sin pTemplate: correcto"

# 4. optionValue="id" en el select de pacientes
grep -n 'optionValue="id"' src/app/features/clinical-records/clinical-record-form/clinical-record-form.html

# 5. La traducción del error existe
grep -n "Patient already has a clinical record" src/app/core/utils/api-error.ts

# 6. La ruta existe y el menú apunta a ella
grep -n "clinical-records" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 7. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/clinical-records/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 8. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-3078484446.png)

## **Cierre del ISS**

![](images/clipboard-1140179845.png)

![](images/clipboard-3784602600.png)

# **Fase I: Frontend — ISS-10 — Citas (transaccional)**

## **10.1 Modelo y reglas del backend**

![](images/clipboard-2636684938.png)

## **10.2 Generar con el CLI**

![](images/clipboard-2638290933.png)

## **10.3 Utilidad de fechas: de `datetime-local` a UTC**

**`src/app/core/utils/datetime.ts`**

![](images/clipboard-1786736814.png)

**`src/app/core/utils/datetime.spec.ts`** (4 pruebas; no dependen de la zona horaria del equipo)

![](images/clipboard-631638537.png)

## **10.4 Traducir el cruce de horario (`api-error`)**

**PARCHE — `src/app/core/utils/api-error.ts`.** **Dentro de** la rama `if (body && typeof body === 'object' && body.error) {`, **encima de** la línea `const detail = body.detail ?? '';`, **añadí:**

![](images/clipboard-2267698015.png)

**`src/app/core/utils/api-error-appointment.spec.ts`** (2 pruebas)

![](images/clipboard-32694714.png)

## **10.5 `StateTag`: el estado de negocio**

![](images/clipboard-1682537356.png)

**`src/app/shared/ui/state-tag/state-tag.spec.ts`** (4 pruebas)

![](images/clipboard-217851459.png)

## **10.6 Prueba del servicio**

**`src/app/features/appointments/appointment-api.spec.ts`** (7 pruebas)

![](images/clipboard-2108006345.png)

## **10.7 `appointment-form.ts`**

![](images/clipboard-2565014598.png)

![](images/clipboard-4285286416.png)

## **10.8 `appointment-form.html` y `appointment-form.css`**

![](images/clipboard-3254558490.png)

## **10.9 `appointment-form.spec.ts`**

![](images/clipboard-540242104.png)

![](images/clipboard-3209373509.png)

## **10.10 `appointment-list.ts`**

![](images/clipboard-3515228822.png)

![](images/clipboard-79916929.png)

![](images/clipboard-1202940905.png)

## **10.11 `appointment-list.html` y `appointment-list.css`**

![](images/clipboard-2291547768.png)

![](images/clipboard-2784300330.png)

![](images/clipboard-2723243764.png)

## **10.12 `appointment-list.spec.ts`**

![](images/clipboard-1161843347.png)

![](images/clipboard-1786675759.png)

![](images/clipboard-1442932340.png)

## **10.13 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Dentro de** `children` del `Shell`, **encima del** `],` que cierra esa lista (debajo de la última ruta hija que tengas), **añadí:**

![](images/clipboard-3499872311.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **encima de** la entrada `Prototipo`, **añadí:**

![](images/clipboard-781222272.png)

## **10.14 Comprobar antes de avanzar**

![](images/clipboard-1465551133.png)

![](images/clipboard-2383180424.png)

## **Verificación del ISS**

``` bash
# 1. El formulario no llama a la API: solo emite
grep -n "output<AppointmentPayload>\|output<AppointmentUpdatePayload>\|output<void>" \
  src/app/features/appointments/appointment-form/appointment-form.ts
grep -n "inject(AppointmentApi)\|inject(AgendaApi)\|inject(PatientApi)\|HttpClient" \
  src/app/features/appointments/appointment-form/appointment-form.ts || echo "sin API en el formulario: correcto"

# 2. La lista carga en paralelo y usa computed
grep -n "forkJoin" src/app/features/appointments/appointment-list/appointment-list.ts
grep -n "computed(" src/app/features/appointments/appointment-list/appointment-list.ts
grep -n "applyFilter" src/app/features/appointments/appointment-list/appointment-list.ts || echo "sin applyFilter: correcto"

# 3. Cancelar es un PATCH de state, no una baja
grep -n "state: 'cancelled'" src/app/features/appointments/appointment-list/appointment-list.ts

# 4. La UI nunca ofrece 'attended'
grep -rn "'attended'" src/app/features/appointments/appointment-form/ src/app/features/appointments/appointment-list/appointment-list.html || echo "sin attended en formulario ni plantilla: correcto"

# 5. La tabla usa la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/appointments/appointment-list/appointment-list.html
grep -n "pTemplate=" src/app/features/appointments/appointment-list/appointment-list.html || echo "sin pTemplate: correcto"

# 6. Las traducciones de error y las utilidades existen
grep -n "Agenda already has an appointment" src/app/core/utils/api-error.ts
ls src/app/core/utils/datetime.ts src/app/shared/ui/state-tag/state-tag.ts

# 7. La ruta existe y el menú apunta a ella
grep -n "appointments" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 8. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/appointments/*/*.css src/app/shared/ui/state-tag/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 9. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-2419993133.png)

## **Cierre del ISS**

![](images/clipboard-1306761709.png)

![](images/clipboard-2703469172.png)

# **Fase I: Frontend — ISS-11 — Autorizaciones de citas (0..1:1)**

## **11.1 Modelo y reglas del backend**

![](images/clipboard-2502725451.png)

## **11.2 Generar con el CLI**

![](images/clipboard-116875607.png)

## **11.3 Formato de fecha para etiquetas (`formatLocal`)**

**PARCHE — `src/app/core/utils/datetime.ts`** (se **añade al final** del archivo; `pad` ya está definido arriba):

![](images/clipboard-713796424.png)

**`src/app/core/utils/datetime-format.spec.ts`** (2 pruebas; no dependen de la zona horaria)

![](images/clipboard-1797779686.png)

## **11.4 Traducir «la cita ya tiene autorización» (`api-error`)**

**PARCHE — `src/app/core/utils/api-error.ts`.** **Dentro de** la rama `if (body && typeof body === 'object' && body.error) {`, **encima de** la línea `const detail = body.detail ?? '';`, **añadí:**

![](images/clipboard-1660833339.png)

**`src/app/core/utils/api-error-authorization.spec.ts`** (1 prueba)

![](images/clipboard-2293294484.png)

## **11.5 Prueba del servicio**

**`src/app/features/authorizations/authorization-api.spec.ts`** (6 pruebas)

![](images/clipboard-1624287304.png)

## **11.6 `authorization-form.ts`** 

![](images/clipboard-948785219.png)

## **11.7 `authorization-form.html` y `authorization-form.css`**

![](images/clipboard-4206279220.png)

## **11.8 `authorization-form.spec.ts`**

![](images/clipboard-2442781625.png)

## **11.9 `authorization-list.ts`**

![](images/clipboard-3066317321.png)

![](images/clipboard-2463049358.png)

## **11.10 `authorization-list.html` y `authorization-list.css`**

![](images/clipboard-2496835211.png)

![](images/clipboard-542335867.png)

## **11.11 `authorization-list.spec.ts`**

![](images/clipboard-2819681354.png)

![](images/clipboard-2083719635.png)

## **11.12 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Dentro de** `children` del `Shell`, **encima del** `],` que cierra esa lista (debajo de la última ruta hija que tengas), **añadí:**

![](images/clipboard-3599760806.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **encima de** la entrada `Prototipo`, **añadí:**

![](images/clipboard-2559786826.png)

## **11.13 Comprobar antes de avanzar**

![](images/clipboard-617474964.png)

![](images/clipboard-1539494202.png)

## **Verificación del ISS**

``` bash
# 1. El formulario no llama a la API: solo emite
grep -n "output<AuthorizationPayload>\|output<AuthorizationUpdatePayload>\|output<void>" \
  src/app/features/authorizations/authorization-form/authorization-form.ts
grep -n "inject(AuthorizationApi)\|inject(AppointmentApi)\|HttpClient" \
  src/app/features/authorizations/authorization-form/authorization-form.ts || echo "sin API en el formulario: correcto"

# 2. La lista carga en paralelo y usa computed
grep -n "forkJoin" src/app/features/authorizations/authorization-list/authorization-list.ts
grep -n "availableAppointments" src/app/features/authorizations/authorization-list/authorization-list.ts

# 3. La tabla usa la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/authorizations/authorization-list/authorization-list.html
grep -n "pTemplate=" src/app/features/authorizations/authorization-list/authorization-list.html || echo "sin pTemplate: correcto"

# 4. formatLocal y la traducción existen
grep -n "export function formatLocal" src/app/core/utils/datetime.ts
grep -n "Appointment already has an authorization" src/app/core/utils/api-error.ts

# 5. La ruta existe y el menú apunta a ella
grep -n "authorizations" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 6. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/authorizations/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 7. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-1056280656.png)

## **Cierre del ISS**

![](images/clipboard-4189673395.png)

![](images/clipboard-1239989633.png)

# **Fase I: Frontend — ISS-12 — Atenciones (regla del PDF: «Atender cita»)**

## **12.1 Modelo y reglas del backend**

![](images/clipboard-1416825168.png)

## **12.2 Generar con el CLI**

![](images/clipboard-380497637.png)

## **12.3 Traducir los errores de la regla (`api-error`)**

**PARCHE — `src/app/core/utils/api-error.ts`.** **Dentro de** la rama `if (body && typeof body === 'object' && body.error) {`, **encima de** la línea `const detail = body.detail ?? '';`, **añadí:**

![](images/clipboard-314779953.png)

**`src/app/core/utils/api-error-encounter.spec.ts`** (2 pruebas)

![](images/clipboard-3979697150.png)

## **12.4 Prueba del servicio**

**`src/app/features/encounters/encounter-api-crud.spec.ts`** (5 pruebas)

![](images/clipboard-3796816542.png)

## **12.5 `encounter-form.ts`**

![](images/clipboard-1082387346.png)

![](images/clipboard-237101860.png)

## **12.6 `encounter-form.html` y `encounter-form.css`**

![](images/clipboard-114762893.png)

![](images/clipboard-3333799204.png)

![](images/clipboard-1214228726.png)

## **12.7 `encounter-form.spec.ts`**

![](images/clipboard-3985666224.png)

![](images/clipboard-3855551760.png)

## **12.8 `encounter-list.ts`**

![](images/clipboard-3693480405.png)

![](images/clipboard-3049108860.png)

![](images/clipboard-3662442933.png)

## **12.9 `encounter-list.html` y `encounter-list.css`**

![](images/clipboard-3002589059.png)

![](images/clipboard-3367462710.png)

![](images/clipboard-1461714247.png)

## **12.10 `encounter-list.spec.ts`**

![](images/clipboard-2430144786.png)

![](images/clipboard-1322130494.png)

![](images/clipboard-194037569.png)

## **12.11 Ruta y menú**

**PARCHE — `src/app/app.routes.ts`.** **Dentro de** `children` del `Shell`, **encima del** `],` que cierra esa lista (debajo de la última ruta hija que tengas), **añadí:**

![](images/clipboard-2197329910.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **encima de** la entrada `Prototipo`, **añadí:**

![](images/clipboard-3091248611.png)

## **12.12 Comprobar antes de avanzar**

![](images/clipboard-3471285766.png)

![](images/clipboard-572148932.png)

## **Verificación del ISS**

``` bash
# 1. El formulario no llama a la API: solo emite
grep -n "output<EncounterPayload>\|output<EncounterUpdatePayload>\|output<void>" \
  src/app/features/encounters/encounter-form/encounter-form.ts
grep -n "inject(EncounterApi)\|inject(AppointmentApi)\|inject(ClinicalRecordApi)\|HttpClient" \
  src/app/features/encounters/encounter-form/encounter-form.ts || echo "sin API en el formulario: correcto"

# 2. La lista carga en paralelo y usa la respuesta del POST
grep -n "forkJoin" src/app/features/encounters/encounter-list/encounter-list.ts
grep -n "next: ({ appointment })" src/app/features/encounters/encounter-list/encounter-list.ts

# 3. «Completar» es un PATCH de state y no se ofrece 'cancelled' al crear
grep -n "state: 'completed'" src/app/features/encounters/encounter-list/encounter-list.ts
grep -n "state: value.state === 'in_progress'" src/app/features/encounters/encounter-form/encounter-form.ts

# 4. La tabla usa la API de PrimeNG 22
grep -n "#caption\|#header\|#body\|#emptymessage" src/app/features/encounters/encounter-list/encounter-list.html
grep -n "pTemplate=" src/app/features/encounters/encounter-list/encounter-list.html || echo "sin pTemplate: correcto"

# 5. Las traducciones existen
grep -n "Patient must have an active clinical record\|Appointment must be" src/app/core/utils/api-error.ts

# 6. La ruta existe y el menú apunta a ella
grep -n "encounters" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 7. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/encounters/*/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 8. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-1423748447.png)

## **Cierre del ISS**

![](images/clipboard-977795653.png)

![](images/clipboard-1108778567.png)

# **Fase I: Frontend — ISS-13 — Facturas (borrador en memoria)**

## **13.1 Endpoint y contrato**

![](images/clipboard-1903060998.png)

## **13.2 Generar con el CLI**

![](images/clipboard-4291241132.png)

## **13.4 `StateTag` (solo si no existe)**

## **13.5 `invoice-list.ts`**

![](images/clipboard-4079180787.png)

## **13.6 `invoice-list.html` y `invoice-list.css`**

![](images/clipboard-2166381627.png)

![](images/clipboard-1822200064.png)

## **13.7 `invoice-list.spec.ts`**

![](images/clipboard-2767443963.png)

![](images/clipboard-3237066301.png)

## **13.8 `invoice-form.ts`**

![](images/clipboard-3151069048.png)

![](images/clipboard-3697822696.png)

![](images/clipboard-3254287547.png)

## **13.9 `invoice-form.html` y `invoice-form.css`**

![](images/clipboard-2001606487.png)

![](images/clipboard-3601469994.png)

![](images/clipboard-1800073928.png)

## **13.10 `invoice-form.spec.ts`**

![](images/clipboard-1324976342.png)

![](images/clipboard-2856737572.png)

![](images/clipboard-2166911960.png)

## **13.11 Rutas y menú**

**PARCHE — `src/app/app.routes.ts`.** **Debajo de** la última ruta de negocio (`encounters`, de ISS-12; dentro de `children` del `Shell`, antes del `],` que cierra `children`), **añadí:**

![](images/clipboard-2075978984.png)

**PARCHE — `src/app/layout/shell/shell.ts`.** En `readonly items: MenuItem[] = [ ... ]`, **debajo de** la entrada `Atenciones`, **añadí:**

![](images/clipboard-1696614861.png)

## **13.12 Comprobar antes de avanzar**

![](images/clipboard-1541270238.png)

![](images/clipboard-4272954322.png)

## **Verificación del ISS**

``` bash
# 1. El servicio y su prueba ya existían; StateTag existe (creado aquí o en ISS-10)
ls src/app/features/invoices/invoice-api.ts src/app/features/invoices/invoice-api.spec.ts
ls src/app/shared/ui/state-tag/state-tag.ts

# 2. El borrador son signals: sin FormGroup
grep -n "FormGroup\|FormBuilder" src/app/features/invoices/invoice-form/invoice-form.ts || echo "sin FormGroup: correcto"

# 3. Carga en paralelo, totales derivados y DECIMAL convertido
grep -n "forkJoin" src/app/features/invoices/invoice-form/invoice-form.ts
grep -n "readonly subtotal\|readonly taxAmount\|readonly total" src/app/features/invoices/invoice-form/invoice-form.ts
grep -n "toNumber" src/app/features/invoices/invoice-form/invoice-form.ts

# 4. El POST no lleva subtotal ni total
grep -n "encounter_ids" src/app/features/invoices/invoice-form/invoice-form.ts
grep -n "subtotal:\|total:" src/app/features/invoices/invoice-form/invoice-form.ts | grep -n "create" || echo "sin subtotal ni total en el POST: correcto"

# 5. Las plantillas de las tablas usan la API de PrimeNG 22
grep -n "#header\|#body\|#emptymessage" src/app/features/invoices/invoice-list/invoice-list.html src/app/features/invoices/invoice-form/invoice-form.html
grep -n "pTemplate=" src/app/features/invoices/*/*.html || echo "sin pTemplate: correcto"

# 6. Las rutas existen y el menú apunta a ellas
grep -n "invoices" src/app/app.routes.ts src/app/layout/shell/shell.ts

# 7. Los CSS no tienen reglas (ninguno contiene llaves)
for f in src/app/features/invoices/*/*.css src/app/shared/ui/state-tag/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 8. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-2744197677.png)

## **Cierre del ISS**

![](images/clipboard-723700261.png)

![](images/clipboard-3187182245.png)

# **Fase I: Frontend — ISS-14 — Detalle de factura, dashboard y cierre de la Fase I**

## **14.1 Contrato, reglas y confirmación con `curl`**

![](images/clipboard-498080220.png)

## **14.2 Confirmar lo que ya existe**

![](images/clipboard-437594458.png)

## **14.3 Generar con CLI**

![](images/clipboard-2850222138.png)

## **14.4 Estados de negocio: reutilizo `StateTag`**

![](images/clipboard-1548056448.png)

## **14.6 `invoice-detail.ts`**

![](images/clipboard-3003870213.png)

## **14.7 `invoice-detail.html`**

![](images/clipboard-3731289969.png)

## **14.8 `invoice-detail.css`**

![](images/clipboard-3141448373.png)

## **14.9 `invoice-detail.spec.ts`**

![](images/clipboard-3379951154.png)

![](images/clipboard-3158674476.png)

## **14.10 `dashboard.ts`**

![](images/clipboard-1132998822.png)

![](images/clipboard-3159611557.png)

## **14.11 `dashboard.html`**

![](images/clipboard-1019528223.png)

![](images/clipboard-3118570854.png)

## **14.12 `dashboard.css`**

![](images/clipboard-1071197727.png)

## **14.13 `dashboard.spec.ts`**

![](images/clipboard-132268502.png)

![](images/clipboard-1685938747.png)

## **14.14 Rutas: `dashboard` e `invoices/:id`**

**PARCHE en `src/app/app.routes.ts`**, en tres pasos. Todos van **dentro de `children` de la ruta `''` que monta `Shell`**.

1.  **Ruta `dashboard`.** Si el `grep` ya mostró `path: 'dashboard'`, no la dupliques: comprueba que su `import(...)` apunte a `./features/dashboard/dashboard` y `m.Dashboard`. Si no existe, añade como **última entrada de `children`** (justo antes del `],` que cierra `children`):

``` typescript
      {
        path: 'dashboard',
        title: 'Panel · SaludConecta',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
```

2.  **Ruta `invoices/:id`.** Añádela **debajo de la ruta `dashboard`** (y, si el ISS-13 ya definió rutas como `invoices` o `invoices/new`, **debajo de ellas**: una ruta literal debe ir antes que `invoices/:id` para que `new` no se lea como un `id`):

``` typescript
      {
        path: 'invoices/:id',
        title: 'Detalle de factura · SaludConecta',
        loadComponent: () =>
          import('./features/invoices/invoice-detail/invoice-detail').then(
            (m) => m.InvoiceDetail,
          ),
      },
```

3.  **Redirección inicial.** Reemplacé el destino de la hija vacía para que `/` abra el panel (el ISS-03 la había apuntado a la primera pantalla de negocio):

``` typescript
// Antes (la hija con pathMatch: 'full'):
{ path: '', pathMatch: 'full', redirectTo: 'patients' },
// Después:
{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
```

![](images/clipboard-3517461218.png)

![](images/clipboard-3412708922.png)

## **14.15 Menú agrupado por proceso (y Dashboard arriba)**

**1. Veo qué entradas tengo hoy**, para conservar los textos e iconos de las que ya existen:

``` bash
cd ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/frontend_angular_saludconecta

grep -n "label:" src/app/layout/shell/shell.ts
```

**2. PARCHE — `src/app/layout/shell/shell.ts`.** **Reemplacé** el arreglo `readonly items: MenuItem[] = [ ... ];` completo (desde `readonly items` hasta su `];`) por este. Los grupos van abiertos (`expanded: true`) y solo las hojas llevan `routerLink`:

``` typescript
  readonly items: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    {
      label: 'Admisiones',
      icon: 'pi pi-id-card',
      expanded: true,
      items: [
        { label: 'Pacientes', icon: 'pi pi-users', routerLink: '/patients' },
        { label: 'Citas', icon: 'pi pi-calendar', routerLink: '/appointments' },
        { label: 'Autorizaciones', icon: 'pi pi-check-circle', routerLink: '/authorizations' },
      ],
    },
    {
      label: 'Atención clínica',
      icon: 'pi pi-heart',
      expanded: true,
      items: [
        { label: 'Historias clínicas', icon: 'pi pi-file-edit', routerLink: '/clinical-records' },
        { label: 'Atenciones', icon: 'pi pi-clipboard', routerLink: '/encounters' },
      ],
    },
    {
      label: 'Facturación',
      icon: 'pi pi-wallet',
      expanded: true,
      items: [{ label: 'Facturas', icon: 'pi pi-receipt', routerLink: '/invoices' }],
    },
    {
      label: 'Catálogos',
      icon: 'pi pi-book',
      expanded: true,
      items: [
        { label: 'Especialidades', icon: 'pi pi-heart', routerLink: '/specialties' },
        { label: 'Servicios', icon: 'pi pi-briefcase', routerLink: '/services' },
        { label: 'Médicos', icon: 'pi pi-user', routerLink: '/doctors' },
        { label: 'Médicos y especialidades', icon: 'pi pi-link', routerLink: '/doctor-specialties' },
        { label: 'Agendas', icon: 'pi pi-calendar-plus', routerLink: '/agendas' },
      ],
    },
    { label: 'Prototipo', icon: 'pi pi-desktop', routerLink: '/prototype' },
  ];
```

> Si en el `grep` del paso 1 tus entradas de *Médicos y especialidades* o *Agendas* usan otro texto o icono, conserva los tuyos dentro del grupo **Catálogos**. Si todavía no tienes esas dos pantallas (ISS-07 e ISS-08), quita sus dos líneas: un `routerLink` a una ruta inexistente te llevaría a `/prototype` por el comodín `**`.

![](images/clipboard-3611621046.png)

**3. PARCHE — `src/app/layout/aside/aside.ts`.** El `Aside` cierra el Drawer en móvil con cualquier clic dentro del `<nav>`. Con un menú plano eso bastaba; con grupos, tocar el **encabezado de un grupo** (que solo abre o cierra su sección) también cerraría el Drawer. **Reemplacé** el método `onNavigationClick` completo por:

``` typescript
  /**
   * Solo un enlace real (`<a href>`) es navegación. El encabezado de un grupo del
   * PanelMenu no tiene `href`: abre y cierra su sección y no debe cerrar el Drawer.
   */
  onNavigationClick(event: Event): void {
    if ((event.target as HTMLElement).closest('a[href]')) {
      this.navigated.emit();
    }
  }
```

![](images/clipboard-1725714770.png)

## **14.16 Enlace «Ver detalle» desde la lista de facturas**

La lista de facturas es la del ISS-13. Allí ya quedaron importados `RouterLink` y `TooltipModule` (paso 13.5), así que **no** se toca `invoice-list.ts`: volver a importar `RouterLink` provocaría un error de identificador duplicado. Compruebo el punto de anclaje:

``` bash
cd ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/frontend_angular_saludconecta

grep -n "RouterLink\|TooltipModule" src/app/features/invoices/invoice-list/invoice-list.ts
grep -n "let-invoice\|flex justify-end" src/app/features/invoices/invoice-list/invoice-list.html
```

![](images/clipboard-2004545676.png)

Deben aparecer `RouterLink` y `TooltipModule` (import y `imports: [...]`), `let-invoice` y la celda de acciones.

**PARCHE — `src/app/features/invoices/invoice-list/invoice-list.html`.** Dentro de la celda de acciones (`<div class="flex justify-end gap-1">`), **como primer botón**, **añadí** este enlace:

``` html
<a
  pButton
  text
  rounded
  severity="secondary"
  icon="pi pi-eye"
  aria-label="Ver detalle de la factura"
  pTooltip="Ver detalle"
  [routerLink]="['/invoices', invoice.id]"
></a>
```

![](images/clipboard-1919676999.png)

## **14.17 Comprobar antes de avanzar (manual)**

![](images/clipboard-3397222716.png)

## **Verificación del ISS**

``` bash
cd ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/frontend_angular_saludconecta

# 1. Los estados usan StateTag y no quedó una utilidad duplicada
grep -n "issued\|paid\|in_progress\|completed\|cancelled" src/app/shared/ui/state-tag/state-tag.ts
ls src/app/features/invoices/invoice-state.ts 2>/dev/null && echo "SOBRA invoice-state.ts: bórralo" || echo "sin invoice-state.ts: correcto"
grep -rn "p-tag" src/app/features/dashboard src/app/features/invoices/invoice-detail --include=*.html \
  || echo "estados con app-state-tag: correcto"

# 2. El detalle valida el id de la ruta y encadena con switchMap + forkJoin
grep -n "paramMap.get('id')\|Number.isInteger\|switchMap\|forkJoin" src/app/features/invoices/invoice-detail/invoice-detail.ts

# 3. El dashboard pide cuatro listas en paralelo y deriva con computed
grep -n "forkJoin\|computed(" src/app/features/dashboard/dashboard.ts
grep -c "Api.list()" src/app/features/dashboard/dashboard.ts   # debe imprimir 4

# 4. Plantillas de tabla con la sintaxis de PrimeNG 22
grep -n "#header\|#body\|#emptymessage" src/app/features/dashboard/dashboard.html src/app/features/invoices/invoice-detail/invoice-detail.html
grep -n "pTemplate=" src/app/features/dashboard/dashboard.html src/app/features/invoices/invoice-detail/invoice-detail.html || echo "sin pTemplate: correcto"

# 5. Las rutas y el menú existen, y el menú está agrupado
grep -n "dashboard\|invoices/:id" src/app/app.routes.ts src/app/layout/shell/shell.ts
grep -c "label: 'Admisiones'\|label: 'Atención clínica'\|label: 'Facturación'\|label: 'Catálogos'" src/app/layout/shell/shell.ts   # debe imprimir 4
grep -n "closest('a\[href\]')" src/app/layout/aside/aside.ts
grep -n "Ver detalle de la factura" src/app/features/invoices/invoice-list/invoice-list.html

# 6. Los CSS siguen sin reglas (ninguno contiene llaves)
for f in src/app/features/dashboard/*.css src/app/features/invoices/invoice-detail/*.css; do
  grep -q '[{}]' "$f" && echo "REGLAS EN $f"
done

# 7. Solo lecturas: ni el detalle ni el panel escriben en el backend
grep -n "\.create(\|\.update(\|\.deactivate(\|\.remove(" \
  src/app/features/dashboard/dashboard.ts src/app/features/invoices/invoice-detail/invoice-detail.ts \
  || echo "solo lecturas: correcto"

# 8. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-4205912921.png)

## **Cierre de la Fase I**

``` bash
cd ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/frontend_angular_saludconecta

# A. Las once entidades de negocio responden 200 sin token (AUTH_ENABLED=false)
for path in patients specialties doctors doctor-specialties services agendas appointments clinical-records authorizations encounters invoices; do
  printf "%-20s" "$path"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4000/api/$path"
done

# B. Cada pantalla tiene su ruta en el frontend
for r in patients specialties doctors doctor-specialties services agendas appointments clinical-records authorizations encounters invoices dashboard; do
  grep -q "path: '$r'" src/app/app.routes.ts && echo "ok     $r" || echo "FALTA  $r"
done

# C. No hay piezas de Fase II en el código
grep -rn "withInterceptors\|canActivate\|appHasPermission\|SessionStore\|AuthService\|Bearer" src/app --include=*.ts --exclude=*.spec.ts \
  || echo "sin piezas de Fase II en el código: correcto"
find src/app/core/guards src/app/core/interceptors -type f ! -name '.gitkeep' 2>/dev/null \
  | grep . || echo "guards e interceptors vacíos: correcto"
```

![](images/clipboard-1690772912.png)

## **Cierre del ISS**

![![](images/clipboard-3808723137.png)](images/clipboard-2448941472.png)

# **Fase II: Frontend — ISS-15 — Autenticación JWT, perfil y permisos efectivos**

## 15.2 Confirmar el punto de partida del frontend

![](images/clipboard-3689715038.png)

## 15.3 Activar la mitad frontal del interruptor (`requireAuth`)

**PARCHE — `src/environments/environment.ts`.** El archivo ya tiene `requireAuth: true` desde ISS-01; aquí solo lo verifico y lo dejo con el comentario definitivo.

![](images/clipboard-2766823693.png)

Ambos deben imprimir `requireAuth: true,`. Si alguno quedó en `false` (alguien lo cambió para probar la Fase I), se vuelve a poner en `true` con:

![](images/clipboard-3959428701.png)

## 15.4 `SessionStore`

![![](images/clipboard-1400124587.png)](images/clipboard-3739188118.png)

## 15.5 `AuthService`

![](images/clipboard-2655367756.png)

## 15.6 `authInterceptor` con refresh single-flight

![](images/clipboard-1527350529.png)

## 15.7 Registro en `app.config.ts`

**PARCHE — `src/app/app.config.ts`.**

**1.** **Debajo de** `import { provideHttpClient } from '@angular/common/http';`, **añadí**:

![](images/clipboard-3083438175.png)

**2.** **Reemplacé** la línea `provideHttpClient(),` por:

![](images/clipboard-3329940504.png)

## 15.8 `authGuard` y `guestGuard`

![](images/clipboard-2124516804.png)

## 15.9 Componente `Login`

![](images/clipboard-1645176348.png)

![![](images/clipboard-1198388240.png)](images/clipboard-3129915411.png)

## 15.10 Componentes `Profile` y `Forbidden`

![](images/clipboard-977055458.png)

![![](images/clipboard-1643901488.png)](images/clipboard-1004625780.png)

![![](images/clipboard-1569996930.png)](images/clipboard-1358948100.png)

![](images/clipboard-699239871.png)

## 15.11 Logout desde el `Shell`

**PARCHE — `src/app/layout/shell/shell.ts`.**

**1.** **Debajo de** los `import` de Angular y PrimeNG (arriba de la clase), **añadí**:

![](images/clipboard-883832019.png)

**2.** **Dentro de** la clase `Shell`, **debajo de** `private readonly isDesktop = watchMediaQuery(...)`, **añadí**:

![](images/clipboard-1897003284.png)

**3.** **Dentro de** la clase, **debajo de** `onMenuToggle()`, **añadí**:

![](images/clipboard-2806888577.png)

**PARCHE — `src/app/layout/shell/shell.html`.**

Dentro del bloque `@if (!sidebarCollapsed())`, **reemplacé** la línea:

![](images/clipboard-4078494473.png)

Y dentro del bloque `<p-drawer …>`, **reemplacé** la línea:

![](images/clipboard-1330171844.png)

## 15.12 Rutas

**PARCHE — `src/app/app.routes.ts`.** Reemplazo completo del archivo (el cambio abarca casi todo: nueva ruta `/login`, nuevos guards en `Shell`, `/profile` y `/forbidden`):

![](images/clipboard-3281318996.png)

## 15.13 Pruebas

**`src/app/core/services/session-store.spec.ts`** (8 pruebas)

![](images/clipboard-4155915492.png)

**`src/app/core/services/auth.spec.ts`** (6 pruebas)

![](images/clipboard-3415160326.png)

**`src/app/core/interceptors/auth-interceptor.spec.ts`** (6 pruebas)

![](images/clipboard-2073911025.png)

**`src/app/features/auth/login/login.spec.ts`** (4 pruebas)

![](images/clipboard-3190261138.png)

**`src/app/core/guards/rbac-guards.spec.ts`** (4 pruebas)

![](images/clipboard-30904411.png)

## 15.14 Comprobar antes de avanzar

![](images/clipboard-3941046487.png)

![](images/clipboard-3310884753.png)

![](images/clipboard-1042737672.png)

![](images/clipboard-3566924767.png)

## Verificación del ISS

``` bash
cd ~/ia-lab/projects/dw/pry-Sahale/app-SaludConecta/frontend_angular_saludconecta

# 1. Los cinco guards/servicios/interceptor existen
ls src/app/core/services/session-store.ts \
   src/app/core/services/auth.ts \
   src/app/core/interceptors/auth-interceptor.ts \
   src/app/core/guards/auth-guard.ts \
   src/app/core/guards/guest-guard.ts

# 2. Los tres componentes nuevos existen con sus cuatro archivos
ls src/app/features/auth/login src/app/features/auth/profile src/app/features/auth/forbidden

# 3. provideHttpClient con withInterceptors([authInterceptor]) y SIN errorInterceptor
grep -n "provideHttpClient" src/app/app.config.ts
grep -n "withInterceptors(\[authInterceptor\])" src/app/app.config.ts
grep -n "errorInterceptor" src/app/app.config.ts || echo "sin errorInterceptor todavía (ISS-16): correcto"

# 4. Rutas: /login y /forbidden existen, Shell protegido por authGuard, rutas hijas SIN permissionGuard
grep -n "path: 'login'\|path: 'forbidden'\|authGuard\|guestGuard" src/app/app.routes.ts
grep -n "permissionGuard" src/app/app.routes.ts || echo "sin permissionGuard todavía (ISS-16): correcto"

# 5. Shell conecta logoutRequested con onLogout
grep -n "onLogout\|logoutRequested" src/app/layout/shell/shell.ts src/app/layout/shell/shell.html

# 6. requireAuth está en true en ambos entornos
grep -n "requireAuth" src/environments/environment.ts src/environments/environment.development.ts

# 7. No hay todavía las piezas de ISS-16
grep -rn "appHasPermission\|errorInterceptor\|authOnlyGuard" src/app --include=*.ts --exclude=*.spec.ts \
  || echo "sin piezas de ISS-16: correcto"

# 8. Pruebas y build
npm test -- --watch=false
ng build
```

![](images/clipboard-2864732364.png)

## Cierre del ISS
