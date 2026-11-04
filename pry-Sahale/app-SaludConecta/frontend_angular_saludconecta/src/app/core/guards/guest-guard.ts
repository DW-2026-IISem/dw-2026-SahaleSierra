import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionStore } from '../services/session-store';

/** Un usuario ya autenticado no necesita volver a /login. */
export const guestGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (!environment.requireAuth || !session.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
