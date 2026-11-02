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
