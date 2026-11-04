/**
 * Catálogo de rutas del menú lateral, con el permiso que las habilita.
 *
 * Formato del permiso: `'METHOD /api/path'`, igual que `GET /api/permissions`.
 * Si una hoja no declara `permission`, se muestra a cualquier usuario autenticado.
 * Los grupos con `authOnly` se ocultan cuando `requireAuth=false`.
 *
 * En ISS-16 el grupo **Seguridad** está declarado pero sin hojas: las rutas
 * `/admin/*` se añaden en ISS-17.
 */
export interface NavLeaf {
  label: string;
  icon: string;
  routerLink: string;
  permission?: string;
}

export interface NavGroup {
  label: string;
  icon: string;
  /** Si es `true`, el grupo solo aparece con sesión real (`authEnabled`). */
  authOnly?: boolean;
  items: NavLeaf[];
}

export const NAV: NavGroup[] = [
  {
    label: 'Panel',
    icon: 'pi pi-home',
    items: [{ label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' }],
  },
  {
    label: 'Admisiones',
    icon: 'pi pi-id-card',
    items: [
      {
        label: 'Pacientes',
        icon: 'pi pi-users',
        routerLink: '/patients',
        permission: 'GET /api/patients',
      },
      {
        label: 'Citas',
        icon: 'pi pi-calendar',
        routerLink: '/appointments',
        permission: 'GET /api/appointments',
      },
      {
        label: 'Autorizaciones',
        icon: 'pi pi-check-circle',
        routerLink: '/authorizations',
        permission: 'GET /api/authorizations',
      },
    ],
  },
  {
    label: 'Atención clínica',
    icon: 'pi pi-heart',
    items: [
      {
        label: 'Historias clínicas',
        icon: 'pi pi-file-edit',
        routerLink: '/clinical-records',
        permission: 'GET /api/clinical-records',
      },
      {
        label: 'Atenciones',
        icon: 'pi pi-clipboard',
        routerLink: '/encounters',
        permission: 'GET /api/encounters',
      },
    ],
  },
  {
    label: 'Facturación',
    icon: 'pi pi-wallet',
    items: [
      {
        label: 'Facturas',
        icon: 'pi pi-receipt',
        routerLink: '/invoices',
        permission: 'GET /api/invoices',
      },
    ],
  },
  {
    label: 'Catálogos',
    icon: 'pi pi-book',
    items: [
      {
        label: 'Especialidades',
        icon: 'pi pi-heart',
        routerLink: '/specialties',
        permission: 'GET /api/specialties',
      },
      {
        label: 'Servicios',
        icon: 'pi pi-briefcase',
        routerLink: '/services',
        permission: 'GET /api/services',
      },
      {
        label: 'Médicos',
        icon: 'pi pi-user',
        routerLink: '/doctors',
        permission: 'GET /api/doctors',
      },
      {
        label: 'Médicos y especialidades',
        icon: 'pi pi-link',
        routerLink: '/doctor-specialties',
        permission: 'GET /api/doctor-specialties',
      },
      {
        label: 'Agendas',
        icon: 'pi pi-calendar',
        routerLink: '/agendas',
        permission: 'GET /api/agendas',
      },
    ],
  },
  {
    label: 'Seguridad',
    icon: 'pi pi-shield',
    authOnly: true,
       items: [
      {
        label: 'Usuarios',
        icon: 'pi pi-user-edit',
        routerLink: '/admin/users',
        permission: 'GET /api/users',
      },
      {
        label: 'Roles',
        icon: 'pi pi-shield',
        routerLink: '/admin/roles',
        permission: 'GET /api/roles',
      },
      {
        label: 'Recursos',
        icon: 'pi pi-list',
        routerLink: '/admin/resources',
        permission: 'GET /api/resources',
      },
      {
        label: 'Asignaciones',
        icon: 'pi pi-link',
        routerLink: '/admin/role-users',
        permission: 'GET /api/role-users',
      },
      {
        label: 'Concesiones',
        icon: 'pi pi-lock',
        routerLink: '/admin/resource-roles',
        permission: 'GET /api/resource-roles',
      },
    ],
  },
  {
    label: 'Prototipo',
    icon: 'pi pi-desktop',
    items: [{ label: 'Prototipo', icon: 'pi pi-desktop', routerLink: '/prototype' }],
  },
];
