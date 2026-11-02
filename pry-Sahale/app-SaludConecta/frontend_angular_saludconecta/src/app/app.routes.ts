import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 *
 * ISS-01B presenta el router con una pantalla real. `loadComponent` descarga
 * `Prototype` solo cuando se visita su URL: el bundle inicial no lo incluye.
 */
export const routes: Routes = [
  {
    path: 'prototype',
    loadComponent: () =>
      import('./features/prototype/prototype').then((m) => m.Prototype),
  },
  { path: '', pathMatch: 'full', redirectTo: 'prototype' },
  { path: '**', redirectTo: 'prototype' },
];
