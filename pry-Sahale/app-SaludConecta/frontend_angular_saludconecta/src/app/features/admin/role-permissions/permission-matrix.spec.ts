import { Resource } from '../../../core/models/resource.model';
import { buildPermissionMatrix, entityOf, idsOf, operationOf } from './permission-matrix';

const resource = (id: number, method: Resource['method'], path: string, status: Resource['status'] = 'active'): Resource => ({
  id,
  method,
  path,
  description: null,
  status,
});

describe('permission-matrix', () => {
  it('should take the entity from the first segment after /api', () => {
    expect(entityOf('/api/patients')).toBe('patients');
    expect(entityOf('/api/clinical-records/patient/:patientId')).toBe('clinical-records');
    expect(entityOf('/api/resource-roles/:id/reactivate')).toBe('resource-roles');
  });

  it('should map methods to C/R/U/D and treat /deactivate as Eliminar', () => {
    expect(operationOf({ method: 'POST', path: '/api/invoices' })).toBe('create');
    expect(operationOf({ method: 'GET', path: '/api/invoices/:id' })).toBe('read');
    expect(operationOf({ method: 'PUT', path: '/api/invoices/:id' })).toBe('update');
    expect(operationOf({ method: 'PATCH', path: '/api/invoices/:id' })).toBe('update');
    expect(operationOf({ method: 'PATCH', path: '/api/role-users/:id/reactivate' })).toBe('update');
    expect(operationOf({ method: 'DELETE', path: '/api/invoices/:id' })).toBe('delete');
    expect(operationOf({ method: 'PATCH', path: '/api/invoices/:id/deactivate' })).toBe('delete');
  });

  it('should group several endpoints in one cell and keep business rows first', () => {
    const rows = buildPermissionMatrix([
      resource(40, 'GET', '/api/users'),
      resource(1, 'GET', '/api/patients'),
      resource(2, 'GET', '/api/patients/:id'),
      resource(4, 'PUT', '/api/patients/:id'),
      resource(5, 'PATCH', '/api/patients/:id'),
      resource(6, 'DELETE', '/api/patients/:id'),
      resource(7, 'PATCH', '/api/patients/:id/deactivate'),
      resource(50, 'GET', '/api/clinical-records/patient/:patientId'),
      resource(49, 'GET', '/api/clinical-records'),
    ]);

    expect(rows.map((row) => row.entity)).toEqual(['patients', 'clinical-records', 'users']);
    const patients = rows[0];
    expect(patients.label).toBe('Pacientes');
    expect(patients.group).toBe('Negocio');
    expect(idsOf(patients, 'read')).toEqual([1, 2]);
    expect(idsOf(patients, 'create')).toEqual([]);
    expect(idsOf(patients, 'update')).toEqual([4, 5]);
    expect(idsOf(patients, 'delete')).toEqual([6, 7]);
    expect(idsOf(rows[1], 'read')).toEqual([49, 50]);
    expect(rows[2].group).toBe('Seguridad');
  });

  it('should skip inactive resources and append unknown entities at the end', () => {
    const rows = buildPermissionMatrix([
      resource(90, 'GET', '/api/reports'),
      resource(1, 'GET', '/api/patients'),
      resource(3, 'POST', '/api/patients', 'inactive'),
    ]);

    expect(rows.map((row) => row.entity)).toEqual(['patients', 'reports']);
    expect(idsOf(rows[0], 'create')).toEqual([]);
    expect(rows[1].label).toBe('reports');
  });
});
