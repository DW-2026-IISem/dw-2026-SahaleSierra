import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';
import { toApiMessage } from '../utils/api-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const status = error.status;
        if (status === 403 || status === 500 || status === 0) {
          const summary =
            status === 403
              ? 'Acción no permitida'
              : status === 500
                ? 'Error del servidor'
                : 'Backend no disponible';
          notify.error(summary, toApiMessage(error));
        }
      }
      return throwError(() => error);
    }),
  );
};