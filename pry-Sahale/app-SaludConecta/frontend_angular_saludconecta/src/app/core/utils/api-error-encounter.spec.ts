import { HttpErrorResponse } from '@angular/common/http';
import { toApiMessage } from './api-error';

describe('toApiMessage (encounter)', () => {
  it('should explain that the patient needs an active clinical record', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { error: 'Patient must have an active clinical record' },
    });

    const message = toApiMessage(error);

    expect(message).toContain('historia clínica activa');
    expect(message).toContain('sigue programada');
  });

  it('should explain that only a scheduled appointment can be attended and show its current state', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { error: "Appointment must be 'scheduled' (current: 'attended')" },
    });

    expect(toApiMessage(error)).toBe(
      'Solo se puede atender una cita programada (estado actual: attended).',
    );
  });
});
