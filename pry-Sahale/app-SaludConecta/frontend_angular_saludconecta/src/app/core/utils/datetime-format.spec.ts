import { formatLocal } from './datetime';

describe('formatLocal', () => {
  it('should format an instant as dd/MM/yyyy HH:mm in local time', () => {
    const iso = new Date(2026, 10, 10, 9, 5).toISOString();

    expect(formatLocal(iso)).toBe('10/11/2026 09:05');
  });

  it('should return an empty text for empty or invalid values', () => {
    expect(formatLocal(null)).toBe('');
    expect(formatLocal('')).toBe('');
    expect(formatLocal('no es una fecha')).toBe('');
  });
});
