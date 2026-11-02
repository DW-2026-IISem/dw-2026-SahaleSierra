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
