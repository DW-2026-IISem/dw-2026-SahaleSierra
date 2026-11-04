import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionStore } from '../services/session-store';

/**
 * ¿Qué puedes hacer? Se declara en la ruta:
 *   data: { permission: 'GET /api/patients' }
 * El formato es el mismo que devuelve `GET /api/permissions`: MÉTODO + path
 * patrón. `SessionStore.canPermission` hace la comparación con regex anclada.
 *
 * Es una ayuda visual: Express vuelve a validar con `authenticate` + `authorize`.
 * Aunque se fuerce la URL, el backend responde 401/403.
 *
 * En modo laboratorio (`requireAuth=false`) deja pasar siempre.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (!environment.requireAuth) {
    return true;
  }

  const permission = route.data?.['permission'] as string | undefined;

  // Sin `data.permission` la ruta no protege nada: es defensivo para rutas
  // de infraestructura (`/profile`, `/forbidden`) o redirects vacíos.
  if (!permission) {
    return true;
  }

  if (session.canPermission(permission)) {
    return true;
  }

  return router.createUrlTree(['/forbidden'], { queryParams: { permission } });
};
