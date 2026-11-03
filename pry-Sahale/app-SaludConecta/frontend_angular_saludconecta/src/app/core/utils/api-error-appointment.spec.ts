import { HttpErrorResponse } from '@angular/common/http';
import { toApiMessage } from './api-error';

describe('toApiMessage (appointment)', () => {
  it('should translate the schedule overlap error with the id of the other appointment', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { error: 'Agenda already has an appointment in that time range (id 7)' },
    });

    expect(toApiMessage(error)).toBe(
      'La agenda ya tiene una cita en ese horario (cita #7). Elige otro rango de fechas.',
    );
  });

  it('should leave other 400 errors untouched', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { error: 'Patient must be active' },
    });

    expect(toApiMessage(error)).toBe('Patient must be active');
  });
});
