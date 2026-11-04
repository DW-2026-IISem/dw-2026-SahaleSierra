import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

/**
 * Pantallas que solo tienen sentido con sesión iniciada (`/profile` y, en ISS-17,
 * `/admin/*`). En modo laboratorio (`requireAuth=false`) no hay login y estas
 * rutas redirigen a `/dashboard`.
 */
export const authOnlyGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (session.authEnabled) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
