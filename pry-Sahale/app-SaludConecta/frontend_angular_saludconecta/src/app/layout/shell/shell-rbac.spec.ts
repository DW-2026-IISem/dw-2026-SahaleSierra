import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { SessionStore } from '../../core/services/session-store';
import { Shell } from './shell';

const TOKENS = {
  access_token: 'A',
  token_type: 'Bearer' as const,
  expires_in: 900,
  refresh_token: 'R',
  refresh_expires_in: 604800,
};

const ADMIN_PERMISSIONS = [
  { resource_id: 1, method: 'GET' as const, path: '/api/patients', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 2, method: 'GET' as const, path: '/api/appointments', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 3, method: 'GET' as const, path: '/api/clinical-records', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 4, method: 'GET' as const, path: '/api/encounters', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 5, method: 'GET' as const, path: '/api/invoices', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 6, method: 'GET' as const, path: '/api/specialties', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 7, method: 'GET' as const, path: '/api/services', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 8, method: 'GET' as const, path: '/api/doctors', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 9, method: 'GET' as const, path: '/api/doctor-specialties', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 10, method: 'GET' as const, path: '/api/agendas', description: null, role_id: 1, role_name: 'ADMIN' },
  { resource_id: 11, method: 'GET' as const, path: '/api/authorizations', description: null, role_id: 1, role_name: 'ADMIN' },
];

// Matriz real de medico según Prompt_Contexto_Frontend_SaludConecta.md §5.4:
// 21 permisos — escribe en historias/atenciones; lee pacientes, agendas, citas,
// servicios, autorizaciones y los tres catálogos relacionados. NO tiene facturas.
const MEDICO_PERMISSIONS = ADMIN_PERMISSIONS.filter((p) =>
  [
    '/api/patients',
    '/api/appointments',
    '/api/clinical-records',
    '/api/encounters',
    '/api/services',
    '/api/agendas',
    '/api/authorizations',
    '/api/specialties',
    '/api/doctors',
    '/api/doctor-specialties',
  ].includes(p.path),
);

function configurar(): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [Shell],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      MessageService,
      ConfirmationService,
    ],
  });
}

describe('Shell · RBAC', () => {
  beforeEach(() => {
    localStorage.clear();
    configurar();
  });

  afterEach(() => localStorage.clear());

  async function render(permissions: typeof ADMIN_PERMISSIONS) {
    const fixture = TestBed.createComponent(Shell);
    const store = TestBed.inject(SessionStore);
    store.setTokens(TOKENS);
    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions,
    });
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('renders the full nav for admin', async () => {
    const fixture = await render(ADMIN_PERMISSIONS);
    const labels = (fixture.componentInstance.navGroups() as { label: string }[]).map((g) => g.label);

    expect(labels).toEqual([
      'Panel',
      'Admisiones',
      'Atención clínica',
      'Facturación',
      'Catálogos',
      'Prototipo',
    ]);
  });

  it('hides Facturación for medico but keeps Catálogos (it has GET on the three related catalogs)', async () => {
    const fixture = await render(MEDICO_PERMISSIONS);
    const labels = (fixture.componentInstance.navGroups() as { label: string }[]).map((g) => g.label);

    expect(labels).toEqual(['Panel', 'Admisiones', 'Atención clínica', 'Catálogos', 'Prototipo']);
  });

  it('exposes the session to Header and Aside', async () => {
    const fixture = await render(ADMIN_PERMISSIONS);
    const root = fixture.nativeElement as HTMLElement;
    const header = root.querySelector('app-header') as HTMLElement;
    const aside = root.querySelector('aside app-aside') as HTMLElement;

    expect(header.textContent).toContain('admin');
    expect(header.textContent).toContain('AD');

    expect(aside.textContent).toContain('admin');
    expect(aside.textContent).toContain(`${ADMIN_PERMISSIONS.length} permisos`);
  });

  it('logout navigates to /login after calling the backend', async () => {
    const fixture = await render(ADMIN_PERMISSIONS);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const http = TestBed.inject(HttpTestingController);

    (fixture.componentInstance as unknown as { onLogout: () => void }).onLogout();

    const logout = http.expectOne(`${environment.apiUrl}/session/logout`);
    expect(logout.request.method).toBe('POST');
    logout.flush({ message: 'Session closed' });

    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('hides empty groups (facturacion keeps Facturación + Catálogos · Servicios only)', async () => {
    // facturacion: escribe en facturas; lee atenciones, citas, servicios y pacientes.
    const FACTURACION_PERMISSIONS = ADMIN_PERMISSIONS.filter((p) =>
      ['/api/patients', '/api/appointments', '/api/encounters', '/api/services', '/api/invoices'].includes(p.path),
    );

    const fixture = await render(FACTURACION_PERMISSIONS);
    const labels = (fixture.componentInstance.navGroups() as { label: string }[]).map((g) => g.label);

    // Sin GET /api/clinical-records, "Atención clínica" conserva solo "Atenciones"
    // y no se descarta. Sin GET de otros catálogos, "Catálogos" conserva solo
    // "Servicios". Admisiones conserva "Pacientes" y "Citas" (no "Autorizaciones").
    expect(labels).toEqual([
      'Panel',
      'Admisiones',
      'Atención clínica',
      'Facturación',
      'Catálogos',
      'Prototipo',
    ]);

    const grupos = fixture.componentInstance.navGroups() as {
      label: string;
      items?: { label: string }[];
    }[];
    const admisiones = grupos.find((g) => g.label === 'Admisiones');
    const catalogos = grupos.find((g) => g.label === 'Catálogos');
    expect(admisiones?.items?.map((i) => i.label)).toEqual(['Pacientes', 'Citas']);
    expect(catalogos?.items?.map((i) => i.label)).toEqual(['Servicios']);
  });
});
