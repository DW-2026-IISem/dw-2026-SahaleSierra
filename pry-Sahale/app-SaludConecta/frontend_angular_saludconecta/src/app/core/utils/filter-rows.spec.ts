import { filterRows } from './filter-rows';

interface Row {
  name: string;
  document: string | null;
  age?: number;
}

const ROWS: Row[] = [
  { name: 'Laura Gómez', document: '1032456789', age: 36 },
  { name: 'Carlos Ruiz', document: null, age: 47 },
  { name: 'María Pérez', document: '52123456' },
];

const pick = (row: Row) => [row.name, row.document, row.age];

describe('filterRows', () => {
  it('should return a copy of all the rows when there is no term', () => {
    const result = filterRows(ROWS, '   ', pick);

    expect(result).toEqual(ROWS);
    expect(result).not.toBe(ROWS);
  });

  it('should match ignoring case', () => {
    expect(filterRows(ROWS, 'LAURA', pick).map((r) => r.name)).toEqual(['Laura Gómez']);
  });

  it('should not fail with null or undefined values', () => {
    expect(filterRows(ROWS, '52123', pick).map((r) => r.name)).toEqual(['María Pérez']);
  });

  it('should match numbers converted to text', () => {
    expect(filterRows(ROWS, '47', pick).map((r) => r.name)).toEqual(['Carlos Ruiz']);
  });

  it('should return an empty array when nothing matches', () => {
    expect(filterRows(ROWS, 'zzz', pick)).toEqual([]);
  });
});
