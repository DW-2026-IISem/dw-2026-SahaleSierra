import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { authOnlyGuard } from './core/guards/auth-only-guard';
import { guestGuard } from './core/guards/guest-guard';
import { permissionGuard } from './core/guards/permission-guard';

/**
 * Rutas de la aplicación.
 *
 * - `/login`: pública (fuera del Shell) con `guestGuard`.
 * - `/forbidden`: fuera del Shell, con `authGuard` (todo usuario autenticado
 *   debe poder ver por qué se le deniega una ruta).
 * - `/` (Shell): protegido por `authGuard`. Cada ruta hija de negocio lleva
 *   `permissionGuard` y `data.permission` con el mismo string que devuelve
 *   `GET /api/permissions` (`'METHOD /api/path'`).
 * - `/profile`: `authOnlyGuard` (no existe sin sesión).
 * - `/admin/*`: no se declara aquí; se crea en ISS-17.
 */
export const routes: Routes = [
  {
    path: 'prototype',
    loadComponent: () =>
      import('./features/prototype/prototype').then((m) => m.Prototype),
  },
  {
    path: 'login',
    title: 'Iniciar sesión · SaludConecta',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'forbidden',
    title: 'Acceso denegado · SaludConecta',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/forbidden/forbidden').then((m) => m.Forbidden),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      // Redirección vacía: no lleva `data` (no hay componente que autorizar).
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Panel · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/patients' },
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'profile',
        title: 'Mi sesión · SaludConecta',
        canActivate: [authOnlyGuard],
        loadComponent: () => import('./features/auth/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'patients',
        title: 'Pacientes · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/patients' },
        loadComponent: () =>
          import('./features/patients/patient-list/patient-list').then((m) => m.PatientList),
      },
      {
        path: 'specialties',
        title: 'Especialidades · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/specialties' },
        loadComponent: () =>
          import('./features/specialties/specialty-list/specialty-list').then(
            (m) => m.SpecialtyList,
          ),
      },
      {
        path: 'services',
        title: 'Servicios · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/services' },
        loadComponent: () =>
          import('./features/services/service-list/service-list').then((m) => m.ServiceList),
      },
      {
        path: 'doctors',
        title: 'Médicos · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/doctors' },
        loadComponent: () =>
          import('./features/doctors/doctor-list/doctor-list').then((m) => m.DoctorList),
      },
      {
        path: 'doctor-specialties',
        title: 'Médicos y especialidades · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/doctor-specialties' },
        loadComponent: () =>
          import('./features/doctor-specialties/doctor-specialty-list/doctor-specialty-list').then(
            (m) => m.DoctorSpecialtyList,
          ),
      },
      {
        path: 'agendas',
        title: 'Agendas · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/agendas' },
        loadComponent: () =>
          import('./features/agendas/agenda-list/agenda-list').then((m) => m.AgendaList),
      },
      {
        path: 'clinical-records',
        title: 'Historias clínicas · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/clinical-records' },
        loadComponent: () =>
          import('./features/clinical-records/clinical-record-list/clinical-record-list').then(
            (m) => m.ClinicalRecordList,
          ),
      },
      {
        path: 'appointments',
        title: 'Citas · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/appointments' },
        loadComponent: () =>
          import('./features/appointments/appointment-list/appointment-list').then(
            (m) => m.AppointmentList,
          ),
      },
      {
        path: 'authorizations',
        title: 'Autorizaciones · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/authorizations' },
        loadComponent: () =>
          import('./features/authorizations/authorization-list/authorization-list').then(
            (m) => m.AuthorizationList,
          ),
      },
      {
        path: 'encounters',
        title: 'Atenciones · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/encounters' },
        loadComponent: () =>
          import('./features/encounters/encounter-list/encounter-list').then(
            (m) => m.EncounterList,
          ),
      },
      {
        path: 'invoices',
        title: 'Facturas · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/invoices' },
        loadComponent: () =>
          import('./features/invoices/invoice-list/invoice-list').then((m) => m.InvoiceList),
      },
      {
        path: 'invoices/new',
        title: 'Nueva factura · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'POST /api/invoices' },
        loadComponent: () =>
          import('./features/invoices/invoice-form/invoice-form').then((m) => m.InvoiceForm),
      },
      {
        path: 'invoices/:id',
        title: 'Detalle de factura · SaludConecta',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/invoices/:id' },
        loadComponent: () =>
          import('./features/invoices/invoice-detail/invoice-detail').then(
            (m) => m.InvoiceDetail,
          ),
      },
      // Rutas de administración RBAC (ISS-17). Sus componentes llegan en
      // ISS-17A (CRUD de usuarios, roles y recursos) e ISS-17B (pivotes).
      // Los `loadComponent` resuelven el import dinámico al navegar; mientras
      // el archivo no exista, el error aparece al abrir la URL, no al compilar.
      {
        path: 'admin/users',
        title: 'Usuarios · SaludConecta',
        canActivate: [authOnlyGuard, permissionGuard],
        data: { permission: 'GET /api/users' },
        loadComponent: () =>
          import('./features/admin/users/user-list/user-list').then(
            (m) => m.UserList,
          ),
      },
      {
        path: 'admin/roles',
        title: 'Roles · SaludConecta',
        canActivate: [authOnlyGuard, permissionGuard],
        data: { permission: 'GET /api/roles' },
        loadComponent: () =>
          import('./features/admin/roles/role-list/role-list').then(
            (m) => m.RoleList,
          ),
      },
      {
        path: 'admin/resources',
        title: 'Recursos · SaludConecta',
        canActivate: [authOnlyGuard, permissionGuard],
        data: { permission: 'GET /api/resources' },
        loadComponent: () =>
          import('./features/admin/resources/resource-list/resource-list').then(
            (m) => m.ResourceList,
         ),
      },
      {
        path: 'admin/role-users',
        title: 'Asignaciones de rol · SaludConecta',
        canActivate: [authOnlyGuard, permissionGuard],
        data: { permission: 'GET /api/role-users' },
        loadComponent: () =>
          import('./features/admin/role-users/role-user-list/role-user-list').then(
            (m) => m.RoleUserList,
          ),
      },
      {
        path: 'admin/resource-roles',
        title: 'Concesiones de rol · SaludConecta',
        canActivate: [authOnlyGuard, permissionGuard],
        data: { permission: 'GET /api/resource-roles' },
        loadComponent: () =>
          import('./features/admin/resource-roles/resource-role-list/resource-role-list').then(
            (m) => m.ResourceRoleList,
          ),
      },      
    ],
  },
  { path: '**', redirectTo: 'login' },
];
