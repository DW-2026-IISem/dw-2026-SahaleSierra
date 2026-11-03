import { HttpErrorResponse } from '@angular/common/http';
import { toApiMessage } from './api-error';

describe('toApiMessage (authorization)', () => {
  it('should translate the one authorization per appointment error', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { error: 'Appointment already has an authorization' },
    });

    expect(toApiMessage(error)).toBe('Esta cita ya tiene una autorización.');
  });
});
