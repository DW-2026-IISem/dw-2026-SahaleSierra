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
      // ISS-03 cambia esta redirección por `patients`; ISS-14 por el dashboard.
      { path: '', pathMatch: 'full', redirectTo: '/prototype' },
    ],
  },
  { path: '**', redirectTo: 'prototype' },
];
