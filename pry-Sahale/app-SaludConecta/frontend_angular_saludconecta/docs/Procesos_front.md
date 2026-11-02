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
