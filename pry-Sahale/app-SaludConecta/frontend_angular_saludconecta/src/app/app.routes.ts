import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'prototype',
    loadComponent: () =>
      import('./features/prototype/prototype').then((m) => m.Prototype),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
          // La primera pantalla de negocio es la redirección por defecto.
      // ISS-14 la cambiará por el dashboard.
      { path: '', pathMatch: 'full', redirectTo: 'patients' },
      {
        path: 'patients',
        title: 'Pacientes · SaludConecta',
        loadComponent: () =>
          import('./features/patients/patient-list/patient-list').then((m) => m.PatientList),
      },

      {
        path: 'specialties',
        title: 'Especialidades · SaludConecta',
        loadComponent: () =>
          import('./features/specialties/specialty-list/specialty-list').then(
            (m) => m.SpecialtyList,
          ),
      },
      {
        path: 'services',
        title: 'Servicios · SaludConecta',
        loadComponent: () =>
          import('./features/services/service-list/service-list').then(
            (m) => m.ServiceList,
          ),
      },
      {
        path: 'doctors',
        title: 'Médicos · SaludConecta',
        loadComponent: () =>
          import('./features/doctors/doctor-list/doctor-list').then(
            (m) => m.DoctorList,
          ),
      },
      {
        path: 'doctor-specialties',
        title: 'Médicos y especialidades · SaludConecta',
        loadComponent: () =>
          import('./features/doctor-specialties/doctor-specialty-list/doctor-specialty-list').then(
            (m) => m.DoctorSpecialtyList,
          ),
      },
      {
        path: 'agendas',
        title: 'Agendas · SaludConecta',
        loadComponent: () =>
          import('./features/agendas/agenda-list/agenda-list').then(
            (m) => m.AgendaList,
          ),
      },

    ],
  },
  { path: '**', redirectTo: 'prototype' },
];
