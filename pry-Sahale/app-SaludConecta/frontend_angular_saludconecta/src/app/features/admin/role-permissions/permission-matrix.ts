import { Resource } from '../../../core/models/resource.model';

/**
 * Agrupación del catálogo RBAC para la matriz «Roles y permisos».
 *
 * Una casilla no es un endpoint: es el conjunto de recursos de una entidad que
 * caen en la misma operación CRUD.
 *
 * | Columna        | Recursos que agrupa                                  |
 * |----------------|------------------------------------------------------|
 * | Crear (C)      | `POST`                                               |
 * | Leer (R)       | `GET` (listado, detalle y búsquedas como `/patient/:patientId`) |
 * | Actualizar (U) | `PUT` y `PATCH` (incluye `/:id/reactivate`)          |
 * | Eliminar (D)   | `DELETE` y `PATCH /:id/deactivate` (baja lógica)     |
 *
 * La entidad es el primer segmento después de `/api`: `/api/clinical-records/:id`
 * → `clinical-records`. Es una función pura: no conoce HTTP ni la sesión.
 */

export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

export interface CrudColumn {
  key: CrudOperation;
  label: string;
  short: string;
}

export const CRUD_COLUMNS: readonly CrudColumn[] = [
  { key: 'create', label: 'Crear', short: 'C' },
  { key: 'read', label: 'Leer', short: 'R' },
  { key: 'update', label: 'Actualizar', short: 'U' },
  { key: 'delete', label: 'Eliminar', short: 'D' },
];

export type MatrixGroup = 'Negocio' | 'Seguridad';

export interface PermissionMatrixRow {
  /** Segmento del path (`patients`, `role-users`…). */
  entity: string;
  /** Nombre que ve el administrador. */
  label: string;
  group: MatrixGroup;
  /** Recursos de la fila por operación (puede haber 0, 1 o varios). */
  operations: Record<CrudOperation, Resource[]>;
}

/** Orden y nombre de las filas. Lo que no esté aquí se agrega al final con su segmento. */
const ENTITY_LABELS: ReadonlyArray<[string, string, MatrixGroup]> = [
  ['patients', 'Pacientes', 'Negocio'],
  ['specialties', 'Especialidades', 'Negocio'],
  ['doctors', 'Médicos', 'Negocio'],
  ['doctor-specialties', 'Médico-especialidad', 'Negocio'],
  ['services', 'Servicios', 'Negocio'],
  ['agendas', 'Agendas', 'Negocio'],
  ['appointments', 'Citas', 'Negocio'],
  ['clinical-records', 'Historias clínicas', 'Negocio'],
  ['authorizations', 'Autorizaciones', 'Negocio'],
  ['encounters', 'Atenciones', 'Negocio'],
  ['invoices', 'Facturas', 'Negocio'],
  ['users', 'Usuarios', 'Seguridad'],
  ['roles', 'Roles', 'Seguridad'],
  ['resources', 'Recursos', 'Seguridad'],
  ['role-users', 'Asignaciones usuario-rol', 'Seguridad'],
  ['resource-roles', 'Concesiones rol-recurso', 'Seguridad'],
];

const KNOWN = new Map(ENTITY_LABELS.map(([entity, label, group], index) => [entity, { label, group, index }]));

/** `/api/clinical-records/patient/:patientId` → `clinical-records`. */
export function entityOf(path: string): string {
  const segments = path.split('/').filter(Boolean);
  return segments[0] === 'api' ? (segments[1] ?? '') : (segments[0] ?? '');
}

/** Columna CRUD de un recurso. La baja lógica cuenta como Eliminar. */
export function operationOf(resource: Pick<Resource, 'method' | 'path'>): CrudOperation {
  if (resource.method === 'DELETE' || resource.path.endsWith('/deactivate')) {
    return 'delete';
  }
  if (resource.method === 'POST') {
    return 'create';
  }
  if (resource.method === 'GET') {
    return 'read';
  }
  return 'update';
}

/** Recursos activos → filas de la matriz (Negocio primero, luego Seguridad). */
export function buildPermissionMatrix(resources: readonly Resource[]): PermissionMatrixRow[] {
  const rows = new Map<string, PermissionMatrixRow>();

  for (const resource of resources) {
    if (resource.status !== 'active') {
      continue;
    }
    const entity = entityOf(resource.path);
    let row = rows.get(entity);
    if (!row) {
      const known = KNOWN.get(entity);
      row = {
        entity,
        label: known?.label ?? entity,
        group: known?.group ?? 'Seguridad',
        operations: { create: [], read: [], update: [], delete: [] },
      };
      rows.set(entity, row);
    }
    row.operations[operationOf(resource)].push(resource);
  }

  const order = (entity: string) => KNOWN.get(entity)?.index ?? Number.MAX_SAFE_INTEGER;
  return [...rows.values()]
    .map((row) => ({
      ...row,
      operations: {
        create: sortById(row.operations.create),
        read: sortById(row.operations.read),
        update: sortById(row.operations.update),
        delete: sortById(row.operations.delete),
      },
    }))
    .sort((a, b) => order(a.entity) - order(b.entity) || a.entity.localeCompare(b.entity));
}

/** IDs de una casilla. */
export function idsOf(row: PermissionMatrixRow, operation: CrudOperation): number[] {
  return row.operations[operation].map((resource) => resource.id);
}

function sortById(resources: Resource[]): Resource[] {
  return [...resources].sort((a, b) => a.id - b.id);
}
