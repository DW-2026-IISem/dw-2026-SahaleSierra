import { toIsoUtc, toLocalInput } from './datetime';

describe('datetime utils', () => {
  it('should convert local text to the same instant in UTC', () => {
    const expected = new Date(2026, 10, 10, 9, 30).toISOString();

    expect(toIsoUtc('2026-11-10T09:30')).toBe(expected);
  });

  it('should format an ISO date as the text expected by datetime-local', () => {
    expect(toLocalInput('2026-11-10T14:30:00.000Z')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('should round trip an ISO date at whole minutes', () => {
    const iso = '2026-11-10T14:30:00.000Z';

    expect(toIsoUtc(toLocalInput(iso))).toBe(iso);
  });

  it('should return an empty text for empty or invalid values', () => {
    expect(toIsoUtc('')).toBe('');
    expect(toIsoUtc('no es una fecha')).toBe('');
    expect(toLocalInput(null)).toBe('');
    expect(toLocalInput('no es una fecha')).toBe('');
  });
});
