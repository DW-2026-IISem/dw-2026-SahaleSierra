import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../core/models/appointment.model';
import { Encounter } from '../../core/models/encounter.model';
import { Invoice } from '../../core/models/invoice.model';
import { Patient } from '../../core/models/patient.model';
import { Dashboard } from './dashboard';

const API = environment.apiUrl;

function paciente(id: number, name: string): Patient {
  return {
    id,
    document_type: 'CC',
    document_number: `10${id}00000`,
    name,
    birth_date: '1990-01-01',
    contact: '3000000000',
    status: 'active',
  };
}

function cita(id: number, patientId: number, start: string, state: Appointment['state']): Appointment {
  return {
    id,
    agenda_id: 1,
    patient_id: patientId,
    start_date: start,
    end_date: start,
    reason: `Motivo ${id}`,
    state,
    status: 'active',
  };
}

function atencion(
  id: number,
  state: Encounter['state'],
  invoiceId: number | null,
  total: string | number,
): Encounter {
  return {
    id,
    appointment_id: id,
    clinical_record_id: 1,
    service_id: 1,
    start_date: '2026-10-01T13:00:00.000Z',
    end_date: null,
    total,
    state,
    observations: null,
    invoice_id: invoiceId,
    status: 'active',
  };
}

function factura(id: number, state: Invoice['state'], total: string | number, date: string): Invoice {
  return {
    id,
    number: `FV-10000${id}`,
    invoice_date: date,
    subtotal: total,
    tax: 0,
    total,
    state,
    status: 'active',
  };
}

const DATOS = {
  patients: [paciente(1, 'Laura Gómez'), paciente(2, 'Carlos Ruiz'), paciente(3, 'Ana Torres')],
  appointments: [
    cita(1, 1, '2099-01-10T13:00:00.000Z', 'scheduled'),
    cita(2, 2, '2099-01-05T13:00:00.000Z', 'scheduled'),
    cita(3, 1, '2000-01-01T13:00:00.000Z', 'scheduled'),
    cita(4, 3, '2099-02-01T13:00:00.000Z', 'attended'),
    cita(5, 3, '2099-03-01T13:00:00.000Z', 'cancelled'),
  ],
  encounters: [
    atencion(1, 'completed', null, '80000.00'),
    atencion(2, 'completed', 1, 60000),
    atencion(3, 'in_progress', null, 40000),
    atencion(4, 'completed', null, 120000),
  ],
  invoices: [
    factura(1, 'issued', '150000.00', '2026-10-01T15:00:00.000Z'),
    factura(2, 'paid', 250000, '2026-10-10T15:00:00.000Z'),
    factura(3, 'cancelled', 999999, '2026-10-20T15:00:00.000Z'),
  ],
};

describe('Dashboard', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function pedirTodo() {
    return {
      patients: http.expectOne(`${API}/patients`),
      appointments: http.expectOne(`${API}/appointments`),
      encounters: http.expectOne(`${API}/encounters`),
      invoices: http.expectOne(`${API}/invoices`),
    };
  }

  function responderTodo(datos: Partial<typeof DATOS> = {}): void {
    const d = { ...DATOS, ...datos };
    const peticiones = pedirTodo();
    peticiones.patients.flush({ patients: d.patients });
    peticiones.appointments.flush({ appointments: d.appointments });
    peticiones.encounters.flush({ encounters: d.encounters });
    peticiones.invoices.flush({ invoices: d.invoices });
  }

  async function crearPanel(datos: Partial<typeof DATOS> = {}) {
    const fixture = TestBed.createComponent(Dashboard);
    responderTodo(datos);
    await fixture.whenStable();
    fixture.detectChanges();
    const compilado = fixture.nativeElement as HTMLElement;
    return { fixture, panel: fixture.componentInstance, compilado };
  }

  function texto(compilado: HTMLElement, id: string): string {
    return (compilado.querySelector(`[data-testid="${id}"]`)?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  it('should open the four requests in parallel before any of them is answered', () => {
    const fixture = TestBed.createComponent(Dashboard);
    const peticiones = pedirTodo();

    expect(peticiones.patients.request.method).toBe('GET');
    expect(peticiones.appointments.request.method).toBe('GET');
    expect(peticiones.encounters.request.method).toBe('GET');
    expect(peticiones.invoices.request.method).toBe('GET');
    expect(fixture.componentInstance.loading()).toBe(true);

    peticiones.patients.flush({ patients: [] });
    peticiones.appointments.flush({ appointments: [] });
    peticiones.encounters.flush({ encounters: [] });
    peticiones.invoices.flush({ invoices: [] });
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should show the four indicators derived from the lists', async () => {
    const { compilado } = await crearPanel();

    expect(texto(compilado, 'kpi-patients')).toBe('3');
    expect(texto(compilado, 'kpi-scheduled')).toBe('3');
    expect(texto(compilado, 'kpi-pending')).toBe('2');
    expect(texto(compilado, 'kpi-revenue')).toContain('400,000');
  });

  it('should count only completed encounters without an invoice as pending', async () => {
    const { panel, compilado } = await crearPanel();

    expect(panel.pendingEncounters().map((encounter) => encounter.id)).toEqual([1, 4]);
    expect(panel.pendingAmount()).toBe(200000);
    expect(texto(compilado, 'kpi-pending-amount')).toContain('200,000');
  });

  it('should add up revenue excluding cancelled invoices and normalizing DECIMAL strings', async () => {
    const { panel } = await crearPanel();

    expect(panel.billedInvoices().map((invoice) => invoice.id)).toEqual([1, 2]);
    expect(panel.revenue()).toBe(400000);
  });

  it('should list only future scheduled appointments, nearest first', async () => {
    const { panel, compilado } = await crearPanel();

    expect(panel.upcoming().map((appointment) => appointment.id)).toEqual([2, 1]);
    expect(compilado.textContent).toContain('Carlos Ruiz');
    expect(compilado.textContent).toContain('Laura Gómez');
  });

  it('should list the latest invoices with a link to each detail', async () => {
    const { panel, compilado } = await crearPanel();

    expect(panel.latestInvoices().map((invoice) => invoice.id)).toEqual([3, 2, 1]);
    expect(compilado.querySelector('a[href="/invoices/2"]')?.textContent).toContain('FV-100002');
    expect(compilado.textContent).toContain('Cancelada');
  });

  it('should show the error and no indicators when a request fails', async () => {
    const fixture = TestBed.createComponent(Dashboard);
    const peticiones = pedirTodo();
    peticiones.patients.flush(
      { error: 'Internal server error', detail: 'SequelizeConnectionError' },
      { status: 500, statusText: 'Server Error' },
    );
    await fixture.whenStable();
    fixture.detectChanges();

    const compilado = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance.error()).toContain('Internal server error');
    expect(compilado.textContent).toContain('Internal server error');
    expect(compilado.querySelector('[data-testid="kpi-patients"]')).toBeNull();
    expect(fixture.componentInstance.patients()).toEqual([]);
  });

  it('should ask for the four resources again when the user refreshes', async () => {
    const { panel } = await crearPanel();

    panel.load();
    expect(panel.loading()).toBe(true);
    responderTodo({ patients: [paciente(1, 'Laura Gómez')] });

    expect(panel.loading()).toBe(false);
    expect(panel.activePatients()).toBe(1);
  });

  it('should show friendly empty states when there is no data', async () => {
    const { compilado } = await crearPanel({
      patients: [],
      appointments: [],
      encounters: [],
      invoices: [],
    });

    expect(texto(compilado, 'kpi-patients')).toBe('0');
    expect(compilado.textContent).toContain('Sin citas próximas');
    expect(compilado.textContent).toContain('Sin facturas');
  });
});
