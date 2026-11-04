import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { EffectivePermission } from '../core/models/auth.model';
import { SessionStore } from '../core/services/session-store';
import { PatientList } from './patients/patient-list/patient-list';
import { SpecialtyList } from './specialties/specialty-list/specialty-list';
import { ServiceList } from './services/service-list/service-list';
import { DoctorList } from './doctors/doctor-list/doctor-list';
import { DoctorSpecialtyList } from './doctor-specialties/doctor-specialty-list/doctor-specialty-list';
import { AgendaList } from './agendas/agenda-list/agenda-list';
import { AppointmentList } from './appointments/appointment-list/appointment-list';
import { ClinicalRecordList } from './clinical-records/clinical-record-list/clinical-record-list';
import { AuthorizationList } from './authorizations/authorization-list/authorization-list';
import { EncounterList } from './encounters/encounter-list/encounter-list';
import { InvoiceList } from './invoices/invoice-list/invoice-list';

const API = environment.apiUrl;

const TOKENS = {
  access_token: 'A',
  token_type: 'Bearer' as const,
  expires_in: 900,
  refresh_token: 'R',
  refresh_expires_in: 604800,
};

function perm(method: EffectivePermission['method'], path: string): EffectivePermission {
  return { resource_id: 0, method, path, description: null, role_id: 2, role_name: 'TEST' };
}

interface ScreenFixture {
  component: Type<unknown>;
  initial: { url: string; body: object }[];
  postPath: string;
  deletePath: string;
  deactivatePath: string;
  createLabel: string;
  deactivateAria: string;
  deleteAria: string;
}

const SCREENS: ScreenFixture[] = [
  {
    component: PatientList,
    initial: [{ url: `${API}/patients`, body: { patients: [] } }],
    postPath: '/api/patients',
    deletePath: '/api/patients/:id',
    deactivatePath: '/api/patients/:id/deactivate',
    createLabel: 'Nuevo paciente',
    deactivateAria: 'Dar de baja al paciente',
    deleteAria: 'Eliminar paciente',
  },
  {
    component: SpecialtyList,
    initial: [{ url: `${API}/specialties`, body: { specialties: [] } }],
    postPath: '/api/specialties',
    deletePath: '/api/specialties/:id',
    deactivatePath: '/api/specialties/:id/deactivate',
    createLabel: 'Nueva especialidad',
    deactivateAria: 'Dar de baja la especialidad',
    deleteAria: 'Eliminar especialidad',
  },
  {
    component: ServiceList,
    initial: [{ url: `${API}/services`, body: { services: [] } }],
    postPath: '/api/services',
    deletePath: '/api/services/:id',
    deactivatePath: '/api/services/:id/deactivate',
    createLabel: 'Nuevo servicio',
    deactivateAria: 'Dar de baja el servicio',
    deleteAria: 'Eliminar servicio',
  },
  {
    component: DoctorList,
    initial: [{ url: `${API}/doctors`, body: { doctors: [] } }],
    postPath: '/api/doctors',
    deletePath: '/api/doctors/:id',
    deactivatePath: '/api/doctors/:id/deactivate',
    createLabel: 'Nuevo médico',
    deactivateAria: 'Dar de baja el médico',
    deleteAria: 'Eliminar médico',
  },
  {
    component: DoctorSpecialtyList,
    initial: [
      { url: `${API}/doctor-specialties`, body: { doctor_specialties: [] } },
      { url: `${API}/doctors`, body: { doctors: [] } },
      { url: `${API}/specialties`, body: { specialties: [] } },
    ],
    postPath: '/api/doctor-specialties',
    deletePath: '/api/doctor-specialties/:id',
    deactivatePath: '/api/doctor-specialties/:id/deactivate',
    createLabel: 'Nueva asignación',
    deactivateAria: 'Dar de baja la asignación',
    deleteAria: 'Eliminar la asignación',
  },
  {
    component: AgendaList,
    initial: [
      { url: `${API}/agendas`, body: { agendas: [] } },
      { url: `${API}/doctors`, body: { doctors: [] } },
    ],
    postPath: '/api/agendas',
    deletePath: '/api/agendas/:id',
    deactivatePath: '/api/agendas/:id/deactivate',
    createLabel: 'Nueva agenda',
    deactivateAria: 'Dar de baja la agenda',
    deleteAria: 'Eliminar agenda',
  },
  {
    component: AppointmentList,
    initial: [
      { url: `${API}/appointments`, body: { appointments: [] } },
      { url: `${API}/agendas`, body: { agendas: [] } },
      { url: `${API}/doctors`, body: { doctors: [] } },
      { url: `${API}/patients`, body: { patients: [] } },
    ],
    postPath: '/api/appointments',
    deletePath: '/api/appointments/:id',
    deactivatePath: '/api/appointments/:id/deactivate',
    createLabel: 'Programar cita',
    deactivateAria: 'Dar de baja la cita',
    deleteAria: 'Eliminar cita',
  },
  {
    component: ClinicalRecordList,
    initial: [
      { url: `${API}/clinical-records`, body: { clinical_records: [] } },
      { url: `${API}/patients`, body: { patients: [] } },
    ],
    postPath: '/api/clinical-records',
    deletePath: '/api/clinical-records/:id',
    deactivatePath: '/api/clinical-records/:id/deactivate',
    createLabel: 'Nueva historia',
    deactivateAria: 'Dar de baja la historia clínica',
    deleteAria: 'Eliminar historia clínica',
  },
  {
    component: AuthorizationList,
    initial: [
      { url: `${API}/authorizations`, body: { authorizations: [] } },
      { url: `${API}/appointments`, body: { appointments: [] } },
      { url: `${API}/patients`, body: { patients: [] } },
      { url: `${API}/agendas`, body: { agendas: [] } },
    ],
    postPath: '/api/authorizations',
    deletePath: '/api/authorizations/:id',
    deactivatePath: '/api/authorizations/:id/deactivate',
    createLabel: 'Nueva autorización',
    deactivateAria: 'Dar de baja la autorización',
    deleteAria: 'Eliminar autorización',
  },
  {
    component: EncounterList,
    initial: [
      { url: `${API}/encounters`, body: { encounters: [] } },
      { url: `${API}/appointments`, body: { appointments: [] } },
      { url: `${API}/patients`, body: { patients: [] } },
      { url: `${API}/services`, body: { services: [] } },
      { url: `${API}/clinical-records`, body: { clinical_records: [] } },
    ],
    postPath: '/api/encounters',
    deletePath: '/api/encounters/:id',
    deactivatePath: '/api/encounters/:id/deactivate',
    createLabel: 'Atender cita',
    deactivateAria: 'Dar de baja la atención',
    deleteAria: 'Eliminar atención',
  },
  {
    component: InvoiceList,
    initial: [{ url: `${API}/invoices`, body: { invoices: [] } }],
    postPath: '/api/invoices',
    deletePath: '/api/invoices/:id',
    deactivatePath: '/api/invoices/:id/deactivate',
    createLabel: 'Nueva factura',
    deactivateAria: 'Dar de baja la factura',
    deleteAria: 'Eliminar la factura',
  },
];

describe('RBAC · botones de escritura por pantalla', () => {
  let http: HttpTestingController;

  function configure(): void {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    });
    http = TestBed.inject(HttpTestingController);
  }

  function accessWith(permissions: EffectivePermission[]): void {
    const store = TestBed.inject(SessionStore);
    store.setTokens(TOKENS);
    store.setAccess({
      user: { id: 1, username: 'test', email: 't@b', avatar: null, status: 'active' },
      permissions,
    });
  }

  function flush(screen: ScreenFixture): void {
    for (const step of screen.initial) {
      http.expectOne(step.url).flush(step.body);
    }
  }

  function findByAria(root: Element, aria: string): Element | null {
    return root.querySelector(
      `button[aria-label="${aria}"], a[aria-label="${aria}"]`,
    );
  }

  /** Localiza un botón o ancla por su texto (para crear, que no lleva aria-label). */
  function findByText(root: Element, text: string): Element | null {
    const candidates = [...root.querySelectorAll('button, a')];
    return candidates.find((el) => el.textContent?.trim().includes(text)) ?? null;
  }

  beforeEach(() => {
    localStorage.clear();
    configure();
  });

  afterEach(() => {
    localStorage.clear();
    http.verify();
  });

  for (const screen of SCREENS) {
    describe(screen.component.name, () => {
      it('hides every write button when the role lacks POST/PATCH/DELETE', async () => {
        accessWith([]);
        const fixture = TestBed.createComponent(screen.component);
        flush(screen);
        await fixture.whenStable();
        fixture.detectChanges();
        const root = fixture.nativeElement as Element;

        expect(findByText(root, screen.createLabel)).toBeNull();
        expect(findByAria(root, screen.deactivateAria)).toBeNull();
        expect(findByAria(root, screen.deleteAria)).toBeNull();
      });

      it('shows only the create button when the role has POST but not DELETE', async () => {
        accessWith([perm('POST', screen.postPath)]);
        const fixture = TestBed.createComponent(screen.component);
        flush(screen);
        await fixture.whenStable();
        fixture.detectChanges();
        const root = fixture.nativeElement as Element;

        expect(findByText(root, screen.createLabel)).not.toBeNull();
        expect(findByAria(root, screen.deactivateAria)).toBeNull();
        expect(findByAria(root, screen.deleteAria)).toBeNull();
      });
    });
  }
});
