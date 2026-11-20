import { TestBed } from '@angular/core/testing';
import { EffectivePermission } from '../core/models/auth.model';
import { HttpMethod } from '../core/models/resource.model';
import { SessionStore } from '../core/services/session-store';

/**
 * Sesiones de prueba para las pantallas que adaptan su contenido a los permisos.
 *
 * Las pantallas consultan `SessionStore.canPermission()` antes de pedir cada lista
 * relacionada y antes de pintar cada columna derivada. Estas funciones cargan
 * permisos efectivos con la misma forma que devuelve `GET /api/permissions`,
 * sin tocar el backend.
 */

const BUSINESS = [
  'patients',
  'specialties',
  'doctors',
  'doctor-specialties',
  'services',
  'agendas',
  'appointments',
  'clinical-records',
  'authorizations',
  'encounters',
  'invoices',
];

/** Las 78 rutas de negocio: lo que tiene ADMIN sobre las 11 entidades. */
export const ADMIN_PERMISSIONS: string[] = [
  ...BUSINESS.flatMap((resource) => [
    `GET /api/${resource}`,
    `GET /api/${resource}/:id`,
    `POST /api/${resource}`,
    `PUT /api/${resource}/:id`,
    `PATCH /api/${resource}/:id`,
    `DELETE /api/${resource}/:id`,
    `PATCH /api/${resource}/:id/deactivate`,
  ]),
  'GET /api/clinical-records/patient/:patientId',
];

const reads = (...resources: string[]): string[] =>
  resources.flatMap((resource) => [`GET /api/${resource}`, `GET /api/${resource}/:id`]);

const PATIENT_LOOKUP = 'GET /api/clinical-records/patient/:patientId';

/** Lecturas reales de cada rol: salida de `GET /api/permissions` filtrada a `GET`. */
export const ROLE_READS: Record<'ADMISIONES' | 'MEDICO' | 'FACTURACION' | 'AUDITOR_CLINICO', string[]> = {
  ADMISIONES: reads(
    'agendas',
    'appointments',
    'authorizations',
    'doctor-specialties',
    'doctors',
    'patients',
    'services',
    'specialties',
  ),
  MEDICO: [
    ...reads('agendas', 'appointments', 'authorizations', 'clinical-records', 'encounters', 'patients', 'services'),
    PATIENT_LOOKUP,
  ],
  FACTURACION: reads('appointments', 'authorizations', 'encounters', 'invoices', 'patients', 'services'),
  AUDITOR_CLINICO: [
    ...reads('appointments', 'authorizations', 'clinical-records', 'doctors', 'encounters', 'patients', 'services'),
    PATIENT_LOOKUP,
  ],
};

export type TestRole = keyof typeof ROLE_READS;

/** Inicia una sesión de prueba con los permisos dados (formato `'METHOD /api/path'`). */
export function loginWith(permissions: readonly string[], roleName = 'TEST'): SessionStore {
  const session = TestBed.inject(SessionStore);

  // Las pruebas de visibilidad necesitan la Fase II activa, sin depender del environment.
  (session as { authEnabled: boolean }).authEnabled = true;

  session.setTokens({
    access_token: 'A',
    token_type: 'Bearer',
    expires_in: 900,
    refresh_token: 'R',
    refresh_expires_in: 604800,
  });
  session.setAccess({
    user: {
      id: 1,
      username: roleName.toLowerCase(),
      email: 'test@saludconecta.local',
      avatar: null,
      status: 'active',
    },
    permissions: permissions.map((permission, index): EffectivePermission => {
      const [method, path] = permission.split(' ');
      return {
        resource_id: index + 1,
        method: method as HttpMethod,
        path,
        description: null,
        role_id: 1,
        role_name: roleName,
      };
    }),
  });

  // `setAccess` persiste en localStorage: se borra para no contaminar otra prueba.
  localStorage.removeItem('storelab.session.v1');
  return session;
}

/** ADMIN: todas las rutas de negocio. */
export function loginAsAdmin(): SessionStore {
  return loginWith(ADMIN_PERMISSIONS, 'ADMIN');
}

/** Un rol del seeder con sus lecturas reales. */
export function loginAsRole(role: TestRole): SessionStore {
  return loginWith(ROLE_READS[role], role);
}
