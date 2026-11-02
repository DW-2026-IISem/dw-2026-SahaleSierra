import { HttpErrorResponse } from '@angular/common/http';
import { toApiMessage } from './api-error';

describe('toApiMessage', () => {
  it('should explain a network error (status 0) as a backend that is down', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(toApiMessage(error)).toContain('No se pudo conectar con el backend');
  });

  it('should join error and detail when the backend sends both', () => {
    const error = new HttpErrorResponse({
      status: 500,
      error: { error: 'Internal server error', detail: 'SequelizeUniqueConstraintError' },
    });
    expect(toApiMessage(error)).toBe('Internal server error — SequelizeUniqueConstraintError');
  });

  it('should return the plain text body as is', () => {
    const error = new HttpErrorResponse({ status: 400, error: 'Bad request' });
    expect(toApiMessage(error)).toBe('Bad request');
  });

  it('should fall back to the Error message or a generic text', () => {
    expect(toApiMessage(new Error('Falló'))).toBe('Falló');
    expect(toApiMessage('algo')).toBe('Error inesperado');
  });
});
