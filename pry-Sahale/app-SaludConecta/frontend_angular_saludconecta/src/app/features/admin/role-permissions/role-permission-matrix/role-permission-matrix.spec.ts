import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Resource } from '../../../../core/models/resource.model';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role } from '../../../../core/models/role.model';
import { loginWith } from '../../../../testing/session-fixture';
import { RolePermissionMatrix } from './role-permission-matrix';

const GRANTS_URL = `${environment.apiUrl}/resource-roles`;
const ROLES_URL = `${environment.apiUrl}/roles`;
const RESOURCES_URL = `${environment.apiUrl}/resources`;

const ROLES: Role[] = [
  { id: 1, name: 'ADMIN', description: null, status: 'active' },
  { id: 3, name: 'MEDICO', description: null, status: 'active' },
  { id: 4, name: 'FACTURACION', description: null, status: 'active' },
];

const res = (id: number, method: Resource['method'], path: string): Resource => ({
  id,
  method,
  path,
  description: null,
  status: 'active',
});

/** Pacientes con Leer de 2 endpoints y Eliminar de 2; facturas sin DELETE. */
const RESOURCES: Resource[] = [
  res(1, 'GET', '/api/patients'),
  res(2, 'GET', '/api/patients/:id'),
  res(3, 'POST', '/api/patients'),
  res(5, 'PATCH', '/api/patients/:id'),
  res(6, 'DELETE', '/api/patients/:id'),
  res(7, 'PATCH', '/api/patients/:id/deactivate'),
  res(71, 'GET', '/api/invoices'),
  res(73, 'POST', '/api/invoices'),
];

const grant = (id: number, role_id: number, resource_id: number): ResourceRole => ({
  id,
  role_id,
  resource_id,
  status: 'active',
});

/** MEDICO: solo `GET /api/patients` (Leer queda parcial). */
const MEDICO_GRANTS = [grant(10, 3, 1)];

const ADMIN_PANEL = [
  'GET /api/roles',
  'GET /api/resources',
  'GET /api/resource-roles',
  'POST /api/resource-roles',
];

describe('RolePermissionMatrix', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [RolePermissionMatrix],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  function grantsRequest(roleId: number) {
    return http.expectOne(
      (r) => r.method === 'GET' && r.url === GRANTS_URL && r.params.get('role_id') === String(roleId),
    );
  }

  async function create(permissions = ADMIN_PANEL, grants = MEDICO_GRANTS) {
    loginWith(permissions, 'ADMIN');
    const fixture = TestBed.createComponent(RolePermissionMatrix);
    http.expectOne(ROLES_URL).flush({ roles: ROLES });
    http.expectOne(RESOURCES_URL).flush({ resources: RESOURCES });
    grantsRequest(3).flush({ grants });
    await fixture.whenStable();
    fixture.detectChanges();
    const page = fixture.componentInstance;
    const patients = page.rows().find((row) => row.entity === 'patients')!;
    const invoices = page.rows().find((row) => row.entity === 'invoices')!;
    return { fixture, page, patients, invoices };
  }

  const cell = (root: HTMLElement, key: string) =>
    root.querySelector<HTMLInputElement>(`[data-cell="${key}"]`)!;

  it('should load roles and resources, pick the first editable role and ask for its grants', async () => {
    const { page, fixture } = await create();

    expect(page.selectedRoleId()).toBe(3);
    expect(page.rows().map((row) => row.entity)).toEqual(['patients', 'invoices']);
    expect([...page.selectedResourceIds()]).toEqual([1]);
    expect(page.dirty()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Pacientes');
  });

  it('should show checked, partial and unchecked states', async () => {
    const { page, patients, fixture } = await create(ADMIN_PANEL, [grant(10, 3, 1), grant(11, 3, 3)]);
    const root = fixture.nativeElement as HTMLElement;

    expect(page.isGranted(patients, 'create')).toBe(true);
    expect(page.isPartial(patients, 'read')).toBe(true);
    expect(page.isGranted(patients, 'read')).toBe(false);
    expect(page.isGranted(patients, 'delete')).toBe(false);
    expect(page.isPartial(patients, 'delete')).toBe(false);

    expect(cell(root, 'patients:create').checked).toBe(true);
    expect(cell(root, 'patients:read').indeterminate).toBe(true);
    expect(cell(root, 'patients:delete').checked).toBe(false);
    expect(cell(root, 'patients:read').getAttribute('aria-label')).toBe('Leer Pacientes');
  });

  it('should show "No disponible" when an entity has no endpoint for an operation', async () => {
    const { fixture } = await create();
    const root = fixture.nativeElement as HTMLElement;

    expect(cell(root, 'invoices:delete').tagName).toBe('SPAN');
    expect(cell(root, 'invoices:delete').textContent).toContain('No disponible');
    expect(cell(root, 'invoices:read').tagName).toBe('INPUT');
  });

  it('should move every resource of a cell when it is toggled', async () => {
    const { page, patients } = await create();

    page.setOperation(patients, 'read', true);
    page.setOperation(patients, 'delete', true);
    expect([...page.selectedResourceIds()].sort((a, b) => a - b)).toEqual([1, 2, 6, 7]);
    expect(page.dirty()).toBe(true);

    page.setOperation(patients, 'delete', false);
    expect(page.selectedResourceIds().has(6)).toBe(false);
    expect(page.selectedResourceIds().has(7)).toBe(false);

    page.discard();
    expect([...page.selectedResourceIds()]).toEqual([1]);
  });

  it('should POST { role_id, resource_ids } and reload the grants of the role', async () => {
    const { page, patients } = await create();
    page.setOperation(patients, 'read', true);
    page.setOperation(patients, 'create', true);

    page.save();
    expect(page.busy()).toBe(true);
    page.save(); // doble clic: no sale una segunda petición

    const request = http.expectOne((r) => r.method === 'POST' && r.url === GRANTS_URL);
    expect(request.request.body).toEqual({ role_id: 3, resource_ids: [1, 2, 3] });
    request.flush({
      message: 'Role permissions updated',
      result: { role_id: 3, activated: 2, deactivated: 0, total_active: 3 },
    });

    grantsRequest(3).flush({ grants: [grant(10, 3, 1), grant(12, 3, 2), grant(13, 3, 3)] });

    expect(page.saveMessage()).toContain('2 concedidos, 0 retirados, 3 permisos activos');
    expect(page.dirty()).toBe(false);
    expect(page.saving()).toBe(false);
  });

  it('should send an empty list when everything is unchecked', async () => {
    const { page } = await create();
    page.clearAll();

    page.save();

    const request = http.expectOne((r) => r.method === 'POST' && r.url === GRANTS_URL);
    expect(request.request.body).toEqual({ role_id: 3, resource_ids: [] });
    request.flush({
      message: 'Role permissions updated',
      result: { role_id: 3, activated: 0, deactivated: 1, total_active: 0 },
    });
    grantsRequest(3).flush({ grants: [] });

    expect(page.selectedCount()).toBe(0);
  });

  it('should show the API error and keep the unsaved selection', async () => {
    const { page, patients } = await create();
    page.setOperation(patients, 'create', true);

    page.save();
    http
      .expectOne((r) => r.method === 'POST' && r.url === GRANTS_URL)
      .flush({ error: 'Unknown or inactive resource ids: 3' }, { status: 400, statusText: 'Bad Request' });

    expect(page.error()).toContain('3');
    expect(page.saveMessage()).toBeNull();
    expect(page.selectedResourceIds().has(3)).toBe(true);
    expect(page.dirty()).toBe(true);
  });

  it('should load the grants of the new role when the role changes', async () => {
    const { page } = await create();

    page.selectRole(4);
    expect(page.selectedResourceIds().size).toBe(0);
    grantsRequest(4).flush({ grants: [grant(20, 4, 71), grant(21, 4, 73)] });

    expect([...page.selectedResourceIds()].sort((a, b) => a - b)).toEqual([71, 73]);
    expect(page.saveMessage()).toBeNull();
  });

  it('should keep ADMIN read-only and never send it', async () => {
    const { page, patients, fixture } = await create();

    page.selectRole(1);
    grantsRequest(1).flush({ grants: RESOURCES.map((r, i) => grant(100 + i, 1, r.id)) });
    fixture.detectChanges();

    expect(page.readOnly()).toBe(true);
    page.setOperation(patients, 'read', false);
    page.save();
    http.expectNone((r) => r.method === 'POST');
    expect(fixture.nativeElement.querySelector('[data-testid="save-matrix"]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('ADMIN tiene siempre el catálogo completo');
  });

  it('should be read-only without POST /api/resource-roles', async () => {
    const { page, fixture } = await create(['GET /api/roles', 'GET /api/resources', 'GET /api/resource-roles']);

    expect(page.canSave()).toBe(false);
    expect(page.readOnly()).toBe(true);
    expect(fixture.nativeElement.querySelector('[data-testid="save-matrix"]')).toBeNull();
    expect(cell(fixture.nativeElement, 'patients:read').disabled).toBe(true);
  });
});
