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

    ],
  },
  { path: '**', redirectTo: 'prototype' },
];
