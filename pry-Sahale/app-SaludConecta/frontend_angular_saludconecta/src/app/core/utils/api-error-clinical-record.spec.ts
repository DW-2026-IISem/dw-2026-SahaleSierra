import { HttpErrorResponse } from '@angular/common/http';
import { toApiMessage } from './api-error';

describe('toApiMessage (clinical record)', () => {
  it('should translate the one clinical record per patient error with its id and status', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { error: 'Patient already has a clinical record (id 5, status inactive)' },
    });

    expect(toApiMessage(error)).toBe(
      'Este paciente ya tiene una historia clínica (id 5, estado inactive).',
    );
  });
});
