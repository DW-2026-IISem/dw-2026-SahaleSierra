# SaludConecta — Frontend

Aplicación web de un centro médico ambulatorio: pacientes, citas, atenciones y facturación.

**Stack:** Angular 22 (standalone, zoneless, signals) · PrimeNG 22 (tema Aura) · Tailwind CSS 4

## Requisitos

- Node.js y npm compatibles con Angular CLI 22
- Backend `backend_express_saludconecta` corriendo en `http://localhost:4000`

## Inicio rápido

```bash
npm install
npm start
```

Abrir `http://localhost:4200`.

| Comando | Para qué |
|:---|:---|
| `npm start` | Servidor de desarrollo |
| `npm test -- --watch=false` | Pruebas |
| `ng build` | Build de producción |

## Configuración

La URL de la API está en `src/environments/environment.development.ts` (`apiUrl`, sin `/` final) y en `environment.ts` para el build. Con `requireAuth: true` el backend debe tener `AUTH_ENABLED=true`: los dos valores van juntos.

Si PrimeNG muestra el aviso *Invalid PrimeUI License*, pega tu clave Community en `primeUiLicense` de ambos archivos.

## Qué incluye

- Dashboard con indicadores
- Pacientes, historias clínicas, citas, autorizaciones y atenciones
- Facturas (borrador en memoria y detalle)
- Catálogos: especialidades, servicios, médicos, agendas y médico ↔ especialidad
- Inicio de sesión con JWT, perfil y permisos efectivos

## Estructura

```text
src/app/
├── core/      modelos, utilidades, sesión e interceptor
├── features/  una carpeta por pantalla (lista, formulario y servicio HTTP)
├── layout/    Shell, Header, Aside y Footer
└── shared/ui/ componentes compartidos
```

## Usuarios de prueba

Los crea el seeder del backend (`npm run db:seed`).

| Usuario | Contraseña | Rol | Permisos |
|:---|:---|:---|---:|
| `admin` | `Admin123!` | ADMIN | 111 |
| `admisiones` | `Admisiones123!` | ADMISIONES | 25 |
| `medico` | `Medico123!` | MEDICO | 21 |
| `facturacion` | `Facturacion123!` | FACTURACION | 15 |
| `auditor` | `Auditor123!` | AUDITOR_CLINICO | 15 |