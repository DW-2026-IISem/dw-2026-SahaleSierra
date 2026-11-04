import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Appointment } from '../../../core/models/appointment.model';
import { Encounter } from '../../../core/models/encounter.model';
import { Invoice } from '../../../core/models/invoice.model';
import { Patient } from '../../../core/models/patient.model';
import { Service } from '../../../core/models/service.model';
import { InvoiceForm, nextInvoiceNumber } from './invoice-form';

const API = environment.apiUrl;

const PATIENTS: Patient[] = [
  {
    id: 1,
    document_type: 'CC',
    document_number: '1032456789',
    name: 'Laura Gómez',
    birth_date: '1990-04-12',
    contact: '310 456 7890',
    status: 'active',
  },
  {
    id: 2,
    document_type: 'CC',
    document_number: '1045678123',
    name: 'Carlos Ruiz',
    birth_date: '1979-09-30',
    contact: '300 123 4567',
    status: 'active',
  },
  {
    id: 3,
    document_type: 'CC',
    document_number: '52123456',
    name: 'María Pérez',
    birth_date: '1985-01-22',
    contact: '315 987 6543',
    status: 'active',
  },
];

const SERVICES: Service[] = [
  { id: 1, name: 'Consulta de medicina general', description: null, status: 'active' },
  { id: 2, name: 'Holter 24 horas', description: null, status: 'active' },
];

const appointment = (id: number, patient_id: number): Appointment => ({
  id,
  agenda_id: 1,
  patient_id,
  start_date: `2026-10-${10 + id}T15:00:00.000Z`,
  end_date: `2026-10-${10 + id}T15:30:00.000Z`,
  reason: null,
  state: 'attended',
  status: 'active',
});

const APPOINTMENTS: Appointment[] = [
  appointment(1, 1),
  appointment(2, 1),
  appointment(3, 1),
  appointment(4, 1),
  appointment(5, 2),
  appointment(6, 3),
];

const encounter = (id: number, overrides: Partial<Encounter> = {}): Encounter => ({
  id,
  appointment_id: id,
  clinical_record_id: 1,
  service_id: 1,
  start_date: '2026-10-11T15:00:00.000Z',
  end_date: '2026-10-11T15:30:00.000Z',
  total: '85000.00',
  state: 'completed',
  observations: null,
  invoice_id: null,
  status: 'active',
  ...overrides,
});

const ENCOUNTERS: Encounter[] = [
  encounter(1, { total: '85000.00' }), // Laura, facturable
  encounter(2, { service_id: 2, total: '120000.50' }), // Laura, facturable
  encounter(3, { state: 'in_progress' }), // Laura, aún no completada
  encounter(4, { invoice_id: 7 }), // Laura, ya facturada
  encounter(5, { total: '60000.00' }), // Carlos, facturable
  // María no tiene atenciones facturables
];

const INVOICES: Invoice[] = [
  {
    id: 1,
    number: 'FV-100005',
    invoice_date: '2026-10-20T14:00:00.000Z',
    subtotal: '85000.00',
    tax: '0.00',
    total: '85000.00',
    state: 'issued',
    status: 'active',
  },
];

describe('nextInvoiceNumber', () => {
  const invoice = (number: string): Invoice => ({ ...INVOICES[0], number });

  it('should suggest the number after the highest one', () => {
    expect(nextInvoiceNumber([invoice('FV-100003'), invoice('FV-100005')])).toBe('FV-100006');
  });

  it('should start at FV-100001 when there are no invoices', () => {
    expect(nextInvoiceNumber([])).toBe('FV-100001');
  });

  it('should ignore numbers that do not follow the FV-000000 pattern', () => {
    expect(nextInvoiceNumber([invoice('A-77'), invoice('FV-100002')])).toBe('FV-100003');
  });
});

describe('InvoiceForm', () => {
  let http: HttpTestingController;
  let navigate: ReturnType<typeof vi.spyOn>;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    messages = TestBed.inject(MessageService);
    // Ninguna prueba navega de verdad: el router de prueba no conoce `/invoices`.
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  afterEach(() => http.verify());

  /** Responde los cinco `GET` que lanza `load()`. */
  function flushLoad(): void {
    http.expectOne(`${API}/encounters`).flush({ encounters: ENCOUNTERS });
    http.expectOne(`${API}/appointments`).flush({ appointments: APPOINTMENTS });
    http.expectOne(`${API}/patients`).flush({ patients: PATIENTS });
    http.expectOne(`${API}/services`).flush({ services: SERVICES });
    http.expectOne(`${API}/invoices`).flush({ invoices: INVOICES });
  }

  async function createForm() {
    const fixture = TestBed.createComponent(InvoiceForm);
    flushLoad();
    fixture.detectChanges();
    await fixture.whenStable();
    return {
      fixture,
      form: fixture.componentInstance,
      compiled: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the five sources in parallel and suggest the next invoice number', async () => {
    const { form } = await createForm();

    expect(form.encounters()).toEqual(ENCOUNTERS);
    expect(form.patients()).toEqual(PATIENTS);
    expect(form.loading()).toBe(false);
    expect(form.invoiceNumber()).toBe('FV-100006');
  });

  it('should offer only the patients that have encounters to bill, with their count', async () => {
    const { form } = await createForm();

    expect(form.patientOptions().map((option) => option.id)).toEqual([1, 2]);
    expect(form.patientOptions()[0].label).toBe('Laura Gómez · CC 1032456789 (2 atenciones)');
    expect(form.patientOptions()[1].label).toBe('Carlos Ruiz · CC 1045678123 (1 atención)');
  });

  it('should list only completed encounters without an invoice for the chosen patient', async () => {
    const { form } = await createForm();

    form.selectPatient(1);

    // La 3 está en curso y la 4 ya tiene factura; la 5 es de otro paciente.
    expect(form.rows().map((row) => row.id)).toEqual([1, 2]);
    expect(form.rows()[1].serviceName).toBe('Holter 24 horas');
  });

  it('should treat DECIMAL strings as numbers when adding the totals', async () => {
    const { form } = await createForm();
    form.selectPatient(1);

    form.selectAll();

    // "85000.00" + "120000.50" sumado como texto daría "085000.00120000.50".
    expect(form.rows()[0].total).toBe(85000);
    expect(form.subtotal()).toBe(205000.5);
  });

  it('should update the subtotal and the total without calling the backend', async () => {
    const { form } = await createForm();
    form.selectPatient(1);

    form.toggle(1);
    expect(form.subtotal()).toBe(85000);
    form.toggle(2);
    expect(form.subtotal()).toBe(205000.5);
    form.toggle(1);
    expect(form.subtotal()).toBe(120000.5);

    // El borrador es solo memoria: ninguna petición más.
    http.expectNone(`${API}/invoices`);
  });

  it('should add the tax to the total and treat an empty or negative tax as zero', async () => {
    const { form } = await createForm();
    form.selectPatient(1);
    form.toggle(1);

    form.setTax(16150);
    expect(form.total()).toBe(101150);

    form.setTax(null);
    expect(form.taxAmount()).toBe(0);
    expect(form.total()).toBe(85000);

    form.setTax(-500);
    expect(form.taxAmount()).toBe(0);
  });

  it('should clear the selection when the patient changes', async () => {
    const { form } = await createForm();
    form.selectPatient(1);
    form.selectAll();
    expect(form.selectedIds().length).toBe(2);

    form.selectPatient(2);

    expect(form.selectedIds()).toEqual([]);
    expect(form.rows().map((row) => row.id)).toEqual([5]);
  });

  it('should select all the encounters and clear the selection', async () => {
    const { form } = await createForm();
    form.selectPatient(1);

    form.selectAll();
    expect(form.selectedIds()).toEqual([1, 2]);

    form.clearSelection();
    expect(form.selectedIds()).toEqual([]);
  });

  it('should render one table row per billable encounter of the chosen patient', async () => {
    const { fixture, form, compiled } = await createForm();

    form.selectPatient(1);
    fixture.detectChanges();
    await fixture.whenStable();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(2);
    expect(compiled.textContent).toContain('Holter 24 horas');
  });

  it('should not send anything and ask for the number when it is empty', async () => {
    const { form } = await createForm();
    form.selectPatient(1);
    form.toggle(1);
    form.invoiceNumber.set('   ');

    form.save();

    expect(form.error()).toBe('El número de factura es obligatorio.');
    http.expectNone(`${API}/invoices`);
  });

  it('should not send anything and ask for the patient when none is chosen', async () => {
    const { form } = await createForm();

    form.save();

    expect(form.error()).toBe('Selecciona el paciente a facturar.');
    http.expectNone(`${API}/invoices`);
  });

  it('should not send anything and ask for an encounter when none is selected', async () => {
    const { form } = await createForm();
    form.selectPatient(1);

    form.save();

    expect(form.error()).toBe('Selecciona al menos una atención para facturar.');
    http.expectNone(`${API}/invoices`);
  });

  it('should POST only number, encounter_ids and tax, without subtotal or total', async () => {
    const { form } = await createForm();
    form.selectPatient(1);
    form.selectAll();
    form.invoiceNumber.set('  FV-100006  ');
    form.setTax(0);

    form.save();

    const request = http.expectOne(`${API}/invoices`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      number: 'FV-100006',
      encounter_ids: [1, 2],
      tax: 0,
    });
    expect('subtotal' in request.request.body).toBe(false);
    expect('total' in request.request.body).toBe(false);
    request.flush({ invoice: { ...INVOICES[0], id: 2, number: 'FV-100006' } });
  });

  it('should notify and go back to the list after registering the invoice', async () => {
    const { form } = await createForm();
    const add = vi.spyOn(messages, 'add');
    form.selectPatient(2);
    form.toggle(5);

    form.save();
    http
      .expectOne(`${API}/invoices`)
      .flush({ invoice: { ...INVOICES[0], id: 2, number: 'FV-100006' } });

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success', summary: 'Factura FV-100006 registrada' }),
    );
    expect(navigate).toHaveBeenCalledWith(['/invoices']);
    expect(form.saving()).toBe(false);
  });

  it('should keep the draft and show the backend message when an encounter is already billed', async () => {
    const { form } = await createForm();
    const add = vi.spyOn(messages, 'add');
    form.selectPatient(1);
    form.selectAll();

    form.save();
    http
      .expectOne(`${API}/invoices`)
      .flush(
        { error: 'Encounter already billed: 2' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(form.error()).toBe('Encounter already billed: 2');
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'La factura no se registró',
        detail: 'Encounter already billed: 2',
      }),
    );
    expect(navigate).not.toHaveBeenCalled();
    expect(form.selectedIds()).toEqual([1, 2]);
    expect(form.saving()).toBe(false);
  });

  it('should show the error when a load fails', async () => {
    const fixture = TestBed.createComponent(InvoiceForm);
    http
      .expectOne(`${API}/encounters`)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    // forkJoin cancela las otras cuatro peticiones al fallar la primera.
    http.expectOne(`${API}/appointments`);
    http.expectOne(`${API}/patients`);
    http.expectOne(`${API}/services`);
    http.expectOne(`${API}/invoices`);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.loading()).toBe(false);
  });
});
