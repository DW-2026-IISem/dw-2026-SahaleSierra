# SDD — Especificación de dominio y diseño
## Proyecto: SaludConecta — Centro médico ambulatorio

**Semana 04 · Unidad 01 · Desarrollo Web y Base de Datos II · 2026-II**
**Autor:** SahaleSierra

---

## 1. Problema

SaludConecta es una plataforma de gestión integral para un centro médico ambulatorio que presta servicios por especialidad y convenio. El sistema administra el ciclo completo de la atención médica ambulatoria, incluyendo la publicación de agendas, la validación de autorizaciones de aseguradoras, el registro de la atención asistencial e historia clínica, y la generación de cargos para facturación.

La plataforma debe:
- Garantizar que una cita solo cambie a estado **atendida** cuando existan asociados un profesional de la salud, un paciente validado y el registro clínico correspondiente.
- Implementar controles de acceso estrictos, asegurando que los datos asistenciales e historia clínica tengan permisos significativamente más restrictivos que la gestión de agenda, admisión y facturación.
- Mover y validar el flujo financiero garantizando la trazabilidad entre servicios prestados, autorizaciones vigentes y facturas emitidas.
- Restringir y auditar cualquier modificación sobre registros clínicos finalizados o autorizaciones aplicadas.

---

## 2. Actores

| Actor | Descripción | Rol de seguridad asociado |
|---|---|---|
| Paciente | Persona que solicita, agenda y recibe la atención médica ambulatoria. | `PACIENTE` |
| Médico / Profesional | Profesional de la salud encargado de atender las citas y registrar la historia clínica. | `MEDICO` |
| Admisiones / Recepción | Personal administrativo encargados de agendar, validar autorizaciones y recibir al paciente. | `ADMISIONES` |
| Facturación | Encargados de procesar la liquidación de atenciones, generar facturas y conciliar cobros. | `FACTURACION` |
| Auditor Clínico | Personal médico/legal encargado de verificar el cumplimiento asistencial y la confidencialidad. | `AUDITOR_CLINICO` |
| Administrador | Gestiona cuentas, roles, catálogos de especialidades, médicos y configuración general del sistema. | `ADMIN` |

> **Importante:** Estos roles son conceptos del **subsistema de seguridad** (autorizan qué endpoints o recursos puede consumir una cuenta). Un Médico o un Paciente, como entidades de **dominio**, existen independientemente de si poseen o no un usuario/cuenta de acceso al sistema.

---

## 3. Alcance de la semana 04

**Incluye:** modelado del dominio asistencial y administrativo, arquitectura por capas (Clean Architecture / NestJS), contratos iniciales (DTO/API), base técnica del backend NestJS (configuración, common, base de datos, logging, health, Swagger).

**No incluye (semanas siguientes):** CRUD completo con reglas de negocio, autenticación JWT/MFA productiva, autorización RBAC/ABAC completa con Guards, interfaz de usuario (Frontend React/Next.js), despliegue en producción, pruebas de carga y estrés.

---

## 4. Requisitos del dominio

| ID | Requisito |
|---|---|
| RF-01 | El sistema debe registrar y gestionar el perfil del `Paciente`, incluyendo datos de identificación y contacto. |
| RF-02 | El sistema debe gestionar perfiles de `Medico` y relacionarlos con una o más `Especialidad` médica. |
| RF-03 | El sistema debe permitir la creación de `Agenda` médica por profesional y la programación de `Cita` asociadas a un paciente. |
| RF-04 | El sistema debe permitir registrar y validar `Autorizacion` emitidas por convenios/aseguradoras para los servicios requeridos. |
| RF-05 | El sistema debe registrar la `Atencion` médica y actualizar la `HistoriaClinica` del paciente. |
| RF-06 | Una `Cita` solo podrá ser marcada como `atendida` si tiene un médico asignado, paciente confirmado y un registro de `Atencion` creado. |
| RF-07 | El sistema debe liquidar los `Servicio` prestados durante la atención y generar la `Factura` correspondiente agrupando cargos. |
| RF-08 | El sistema debe auditar la lectura y modificación de los datos sensibles en `HistoriaClinica` y `Atencion`. |
| RNF-01 | El subsistema de seguridad (autenticación y RBAC) debe permanecer desacoplado de las entidades de dominio médico. |
| RNF-02 | Los valores de facturación, subtotales e impuestos deben manejarse con precisión decimal (`numeric/decimal`), nunca punto flotante. |
| RNF-03 | Todas las entidades de dominio utilizan UUID v4 como clave primaria y marcas de tiempo (`timestamp with time zone`). |

---

## 5. Principio de separación: dominio vs. seguridad

- **Persona** (dato de negocio compartido): representa la identidad real de un individuo en el mundo físico — nombres, documento de identidad, género, teléfono.
- **Paciente** / **Medico**: roles de negocio que extienden o referencian a una `Persona`.
- **Cuenta** (seguridad): credenciales de autenticación, hash de contraseña y estados de acceso, con una referencia **opcional** `persona_id` (0..1) hacia `Persona`.
- **Consecuencia:** Un paciente puede registrarse sin necesidad de crear una cuenta interactiva para el portal web. Un médico o un administrativo tendrán cuentas ligadas a su persona. La capa asistencial consulta entidades de dominio, mientras que el módulo de seguridad solo valida el token y pasa el `account_id` al controlador.

---

## 6. Modelo de dominio

### 6.1 Identidad y Perfiles de Negocio

**Persona**
- `id` (UUID, PK)
- `tipo_documento`, `numero_documento` (únicos)
- `nombres`, `apellidos`
- `email_contacto`, `telefono`
- `created_at`, `updated_at`

**Paciente**
- `id` (PK), `persona_id` (FK → Persona, único)
- `fecha_nacimiento`, `genero`, `grupo_sanguineo`
- `is_active` (bool)
- `created_at`, `updated_at`

**Medico**
- `id` (PK), `persona_id` (FK → Persona, único)
- `registro_medico` (UQ), `descripcion`
- `is_active` (bool)
- `created_at`, `updated_at`

**Especialidad**
- `id` (PK)
- `nombre` (UQ), `descripcion`
- `is_active` (bool)
- `created_at`, `updated_at`

**MedicoEspecialidad** (Tabla intermedia / Entidad de relación)
- `id` (PK)
- `medico_id` (FK → Medico)
- `especialidad_id` (FK → Especialidad)
- `datos_relacion` (jsonb / texto)
- `is_active` (bool)

---

### 6.2 Programación y Admisión (Scheduling)

**Agenda**
- `id` (PK), `medico_id` (FK → Medico)
- `nombre`, `descripcion`
- `is_active` (bool)
- `created_at`, `updated_at`

**Cita**
- `id` (PK), `agenda_id` (FK → Agenda), `paciente_id` (FK → Paciente)
- `fecha_inicio`, `fecha_fin`
- `motivo`
- `estado` (enum: `programada`, `confirmada`, `en_atencion`, `atendida`, `cancelada`, `no_asistio`)
- `created_at`, `updated_at`

**Autorizacion**
- `id` (PK), `cita_id` (FK → Cita, 0..1:1)
- `codigo_autorizacion` (UQ), `convenio_aseguradora`
- `descripcion`, `vigente_hasta`
- `is_active` (bool)
- `created_at`, `updated_at`

---

### 6.3 Asistencial e Historia Clínica (Clinical)

**HistoriaClinica**
- `id` (PK), `paciente_id` (FK → Paciente, 1:1 único)
- `numero_historia` (UQ), `antecedentes_alergicos`, `antecedentes_familiares`
- `is_active` (bool)
- `created_at`, `updated_at`

**Servicio**
- `id` (PK)
- `codigo_cups` (UQ), `nombre`, `descripcion`
- `tarifa_base` (numeric 12,2)
- `is_active` (bool)
- `created_at`, `updated_at`

**Atencion**
- `id` (PK), `cita_id` (FK → Cita, 1:1), `historia_clinica_id` (FK → HistoriaClinica), `servicio_id` (FK → Servicio)
- `referencia_id` (FK opcional)
- `fecha_inicio`, `fecha_fin`
- `diagnostico_principal`, `prescripcion`, `observaciones`
- `total` (numeric 12,2), `estado` (enum: `en_proceso`, `completada`, `anulada`)
- `atendido_por_account_id` (UUID plano)

---

### 6.4 Facturación y Finanzas (Billing)

**Factura**
- `id` (PK)
- `numero` (UQ), `fecha`
- `paciente_id` (FK → Paciente)
- `subtotal` (numeric 12,2), `impuestos` (numeric 12,2), `total` (numeric 12,2)
- `estado` (enum: `borrador`, `emitida`, `pagada`, `anulada`)
- `created_at`, `updated_at`

---

### 6.5 Subsistema de Seguridad (Independiente)

- **Cuenta**: `id`, `email`, `password_hash`, `is_active`, `mfa_enabled`, `last_login_at`, `persona_id` (FK opcional 0..1)
- **Rol**: `id`, `nombre` (`ADMIN`, `ADMISIONES`, `MEDICO`, `FACTURACION`, `AUDITOR_CLINICO`, `PACIENTE`)
- **Permiso**: `id`, `recurso`, `accion`
- **RolPermiso** (N:M)
- **CuentaRol** (N:M)
- **RefreshToken**: `id`, `cuenta_id`, `token_hash`, `expira_en`, `revocado`

---

## 7. Relaciones de negocio

- Persona 1:0..1 Paciente; Persona 1:0..1 Medico
- Medico N:M Especialidad mediante MedicoEspecialidad
- Medico 1:N Agenda; Agenda 1:N Cita
- Paciente 1:N Cita
- Cita 0..1:1 Autorizacion
- Cita 0..1:1 Atencion
- Paciente 1:1 HistoriaClinica
- HistoriaClinica 1:N Atencion
- Servicio 1:N Atencion
- Factura agrupa atenciones facturables de un Paciente
- Cuenta 0..1 Persona (única relación cruzada entre esquemas)

---

## 8. Arquitectura por capas

```text
src/
  core/                     # Config, guards, interceptores, filtros globales
  identity/                 # SUBSISTEMA DE SEGURIDAD
    auth/                   # Login, refresh, mfa
    accounts/               # Cuenta
    roles/                  # Rol, Permiso, RolPermiso, CuentaRol
  domain/                   # SUBSISTEMA DE DOMINIO
    people/                 # Persona
    patients/               # Paciente
    providers/              # Medico, Especialidad, MedicoEspecialidad
    scheduling/             # Agenda, Cita
    authorizations/         # Autorizacion
    clinical-records/       # HistoriaClinica, Atencion, Servicio
    billing/                # Factura
  shared/                   # DTOs, value objects, decoradores comunes
```

**Responsabilidad por capa (dentro de cada módulo de dominio):**
- **Presentation**: DTOs, controladores, Swagger, contratos de la API.
- **Application**: Casos de uso y orquestación (ej. `ProgramarCita`, `RegistrarAtencion`, `EmitirFactura`).
- **Domain**: Entidades, enumeraciones, eventos de dominio y reglas del negocio asistencial.
- **Infrastructure**: Repositorios de datos, adaptadores ORM (TypeORM / Sequelize), mapeadores.

---

## 9. Contratos iniciales (DTO/API)

### POST /citas
**Request**
```json
{
  "agendaId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "pacienteId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "fechaInicio": "2026-09-15T08:00:00Z",
  "fechaFin": "2026-09-15T08:30:00Z",
  "motivo": "Consulta prioritaria por dolor abdominal"
}
```
**Response 201**
```json
{
  "id": "c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f",
  "estado": "programada",
  "createdAt": "2026-09-07T10:00:00Z"
}
```

### POST /autorizaciones
**Request**
```json
{
  "citaId": "c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f",
  "codigoAutorizacion": "AUT-2026-987654",
  "convenioAseguradora": "EPS Sura",
  "descripcion": "Autorización consulta medicina especializada",
  "vigenteHasta": "2026-10-15"
}
```
**Response 201**
```json
{
  "id": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
  "codigoAutorizacion": "AUT-2026-987654",
  "isActive": true
}
```

### POST /atenciones
**Request**
```json
{
  "citaId": "c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f",
  "historiaClinicaId": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
  "servicioId": "f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
  "fechaInicio": "2026-09-15T08:05:00Z",
  "fechaFin": "2026-09-15T08:35:00Z",
  "diagnosticoPrincipal": "K297 - Gastritis no especificada",
  "prescripcion": "Omeprazol 20mg cada 24 horas por 14 días",
  "observaciones": "Paciente tolera examen físico sin signos de alarma"
}
```
**Response 201**
```json
{
  "id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
  "estado": "completada",
  "total": 85000.00
}
```

### GET /historias/:pacienteId
**Response 200**
```json
{
  "historiaClinicaId": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
  "pacienteId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "numeroHistoria": "HC-109238475",
  "antecedentesAlergicos": "Penicilina",
  "atenciones": [
    {
      "atencionId": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
      "fecha": "2026-09-15T08:05:00Z",
      "diagnostico": "K297 - Gastritis no especificada",
      "servicio": "Consulta Medicina Especializada"
    }
  ]
}
```

---

## 10. RBAC aplicado

| Recurso : Acción | Rol Autorizado |
|---|---|
| `citas:create/update` | `ADMISIONES`, `PACIENTE`, `ADMIN` |
| `autorizaciones:create/validate` | `ADMISIONES`, `FACTURACION`, `ADMIN` |
| `atenciones:create/complete` | `MEDICO` |
| `historias:read` | `MEDICO`, `AUDITOR_CLINICO` |
| `facturas:create/emit` | `FACTURACION`, `ADMIN` |

La validación de acceso combina dos capas:
1. **Guard de RBAC (Seguridad):** Verifica que el token JWT tenga el rol o permiso adecuado (ej. solo `MEDICO` puede hacer `POST /atenciones`).
2. **Validación de Dominio (Asistencial):** El servicio valida que la cita pertenezca a la agenda del médico que está ejecutando la acción o que exista una relación activa con el paciente.

---

## 11. Base técnica del backend (Semana 04)

- `core/config`: Gestión de variables de entorno mediante `@nestjs/config` (`DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, `JWT_SECRET`).
- `core/common`: Filtros globales de excepciones, interceptores de respuesta estándar DTO y decoradores customizados.
- `core/database`: Configuración del ORM (TypeORM / Sequelize) con conexión a PostgreSQL/MySQL.
- `core/logging`: Logger estructurado para auditoría técnica.
- `core/health`: Endpoint `/health` para chequeo de disponibilidad del sistema y la base de datos.
- `core/swagger`: Documentación interactiva OpenAPI expuesta en `/docs`.

---

## 12. Historial de decisiones

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-09-07 | Desacoplamiento de `Persona` / `Paciente` / `Medico` de `Cuenta` / `Rol`. | Garantizar que los registros clínicos pertenezcan a la entidad de dominio y no dependan del ciclo de vida de un usuario o cuenta de acceso. |
| 2026-09-07 | Regla estricta para el cambio de estado en `Cita` a `atendida`. | Cumplimiento del requisito de negocio donde la cita solo finaliza si existe registro asistencial del profesional de la salud. |
| 2026-09-07 | Aislamiento del módulo `clinical-records` con permisos restrictivos. | Proteger datos de salud sensibles conforme a regulaciones de privacidad médica. |
