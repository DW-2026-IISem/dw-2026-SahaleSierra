import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Appointment } from '../../../core/models/appointment.model';
import { Encounter } from '../../../core/models/encounter.model';
import { Invoice } from '../../../core/models/invoice.model';
import { Patient } from '../../../core/models/patient.model';
import { Service } from '../../../core/models/service.model';
import { InvoiceDetail } from './invoice-detail';

const API = environment.apiUrl;

const PACIENTE: Patient = {
  id: 3,
  document_type: 'CC',
  document_number: '1032456789',
  name: 'Laura Gómez',
  birth_date: '1990-05-12',
  contact: '3001112233',
  status: 'active',
};

const CITA: Appointment = {
  id: 10,
  agenda_id: 7,
  patient_id: 3,
  start_date: '2026-10-01T13:00:00.000Z',
  end_date: '2026-10-01T13:30:00.000Z',
  reason: 'Control',
  state: 'attended',
  status: 'active',
};

const SERVICIOS: Service[] = [
  { id: 1, name: 'Consulta general', description: null, status: 'active' },
  { id: 2, name: 'Holter 24 horas', description: 'Monitoreo cardiaco ambulatorio', status: 'active' },
];

function atencion(id: number, serviceId: number, total: string | number, invoiceId: number | null): Encounter {
  return {
    id,
    appointment_id: 10,
    clinical_record_id: 1,
    service_id: serviceId,
    start_date: '2026-10-01T13:00:00.000Z',
    end_date: '2026-10-01T13:30:00.000Z',
    total,
    state: 'completed',
    observations: id === 1 ? 'Sin novedades' : null,
    invoice_id: invoiceId,
    status: 'active',
  };
}

function factura(encounters?: Encounter[]): Invoice {
  return {
    id: 5,
    number: 'FV-100005',
    invoice_date: '2026-10-02T15:00:00.000Z',
    subtotal: '150000.00',
    tax: '0.00',
    total: '150000.00',
    state: 'issued',
    status: 'active',
    ...(encounters ? { encounters } : {}),
  };
}

describe('InvoiceDetail', () => {
  let http: HttpTestingController;

  async function configurar(id: string): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [InvoiceDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  }

  afterEach(() => http.verify());

  /** Responde las tres lecturas de nombres que siguen al detalle. */
  function responderNombres(pacientes: Patient[] = [PACIENTE]): void {
    http.expectOne(`${API}/services`).flush({ services: SERVICIOS });
    http.expectOne(`${API}/appointments`).flush({ appointments: [CITA] });
    http.expectOne(`${API}/patients`).flush({ patients: pacientes });
  }

  async function crearDetalle(encounters?: Encounter[], pacientes?: Patient[]) {
    const fixture = TestBed.createComponent(InvoiceDetail);
    http.expectOne(`${API}/invoices/5`).flush({ invoice: factura(encounters) });
    if (!encounters) {
      http.expectOne(`${API}/encounters`).flush({
        encounters: [atencion(1, 1, '100000.00', 5), atencion(2, 2, 50000, 5), atencion(3, 1, 80000, null), atencion(4, 1, 20000, 9)],
      });
    }
    responderNombres(pacientes);
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, detalle: fixture.componentInstance, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should use the encounters embedded in the invoice and not request /encounters', async () => {
    await configurar('5');
    const { detalle, compilado } = await crearDetalle([atencion(1, 1, '100000.00', 5), atencion(2, 2, 50000, 5)]);

    http.expectNone(`${API}/encounters`);
    expect(detalle.lines().length).toBe(2);
    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.querySelector('[data-testid="invoice-number"]')?.textContent).toContain('FV-100005');
  });

  it('should filter /encounters by invoice_id when the invoice has no encounters', async () => {
    await configurar('5');
    const { detalle } = await crearDetalle();

    expect(detalle.lines().map((line) => line.id)).toEqual([1, 2]);
  });

  it('should resolve service and patient names from the id maps', async () => {
    await configurar('5');
    const { detalle, compilado } = await crearDetalle([atencion(1, 1, '100000.00', 5), atencion(2, 2, 50000, 5)]);

    expect(detalle.serviceName()(2)).toBe('Holter 24 horas');
    expect(compilado.textContent).toContain('Consulta general');
    expect(compilado.querySelector('[data-testid="invoice-patient"]')?.textContent).toContain('Laura Gómez');
  });

  it('should fall back to readable labels when a name cannot be resolved', async () => {
    await configurar('5');
    const { detalle, compilado } = await crearDetalle([atencion(1, 9, 100000, 5)], []);

    expect(detalle.serviceName()(9)).toBe('Servicio #9');
    expect(compilado.querySelector('[data-testid="invoice-patient"]')?.textContent).toContain('Paciente #3');
  });

  it('should normalize DECIMAL strings with toNumber and sum the listed encounters', async () => {
    await configurar('5');
    const { detalle, compilado } = await crearDetalle([atencion(1, 1, '100000.00', 5), atencion(2, 2, 50000, 5)]);

    expect(detalle.subtotal()).toBe(150000);
    expect(detalle.tax()).toBe(0);
    expect(detalle.total()).toBe(150000);
    expect(detalle.linesTotal()).toBe(150000);
    expect(compilado.querySelector('[data-testid="invoice-total"]')?.textContent).toContain('150,000');
  });

  it('should show the invoice state with its Spanish label', async () => {
    await configurar('5');
    const { compilado } = await crearDetalle([atencion(1, 1, 100000, 5)]);

    expect(compilado.textContent).toContain('Emitida');
    expect(compilado.textContent).toContain('Completada');
  });

  it('should show an empty state when the invoice has no active encounters', async () => {
    await configurar('5');
    const { compilado } = await crearDetalle([]);

    expect(compilado.textContent).toContain('Sin atenciones');
  });

  it('should not call the backend and should explain an invalid id', async () => {
    await configurar('abc');
    const fixture = TestBed.createComponent(InvoiceDetail);
    await fixture.whenStable();
    fixture.detectChanges();

    http.expectNone(`${API}/invoices/abc`);
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.error()).toBe('El identificador de la factura no es válido.');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('no es válido');
  });

  it('should show the backend error when the invoice does not exist', async () => {
    await configurar('5');
    const fixture = TestBed.createComponent(InvoiceDetail);
    http
      .expectOne(`${API}/invoices/5`)
      .flush({ error: 'Invoice not found' }, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.error()).toBe('Invoice not found');
    expect(fixture.componentInstance.invoice()).toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Invoice not found');
  });
});
