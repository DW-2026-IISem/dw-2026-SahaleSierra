import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Invoice } from '../../../core/models/invoice.model';
import { InvoiceList } from './invoice-list';

const BASE = `${environment.apiUrl}/invoices`;

const INVOICES: Invoice[] = [
  {
    id: 1,
    number: 'FV-100001',
    invoice_date: '2026-10-20T14:00:00.000Z',
    subtotal: '205000.00',
    tax: '0.00',
    total: '205000.00',
    state: 'issued',
    status: 'active',
  },
  {
    id: 2,
    number: 'FV-100002',
    invoice_date: '2026-10-25T14:00:00.000Z',
    subtotal: '120000.00',
    tax: '0.00',
    total: '120000.00',
    state: 'paid',
    status: 'active',
  },
  {
    id: 3,
    number: 'FV-100003',
    invoice_date: '2026-10-28T14:00:00.000Z',
    subtotal: '85000.00',
    tax: '0.00',
    total: '85000.00',
    state: 'cancelled',
    status: 'active',
  },
];

describe('InvoiceList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    confirmation = TestBed.inject(ConfirmationService);
    messages = TestBed.inject(MessageService);
  });

  afterEach(() => http.verify());

  /** Crea la pantalla y responde la carga inicial. */
  async function createList(invoices: Invoice[] = INVOICES) {
    const fixture = TestBed.createComponent(InvoiceList);
    http.expectOne(BASE).flush({ invoices });
    fixture.detectChanges();
    await fixture.whenStable();
    return {
      fixture,
      list: fixture.componentInstance,
      compiled: fixture.nativeElement as HTMLElement,
    };
  }

  /** Espía que acepta la confirmación de inmediato. `confirm` devuelve el servicio. */
  function acceptConfirmation(): void {
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      options.accept?.();
      return confirmation;
    });
  }

  it('should load the active invoices on start', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(INVOICES);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(InvoiceList);
    http
      .expectOne(BASE)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should render one table row per invoice with the number and the state', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(INVOICES.length);
    expect(compiled.textContent).toContain('FV-100002');
    expect(compiled.textContent).toContain('Pagada');
    expect(compiled.textContent).toContain('Cancelada');
  });

  it('should filter by number or state without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.filter.set('100002');
    fixture.detectChanges();
    expect(list.visibleRows().map((row) => row.id)).toEqual([2]);

    list.filter.set('issued');
    fixture.detectChanges();
    expect(list.visibleRows().map((row) => row.id)).toEqual([1]);

    http.expectNone(BASE);
  });

  it('should allow paying only issued invoices and cancelling only the not cancelled ones', async () => {
    const { list } = await createList();

    expect(list.canPay(INVOICES[0])).toBe(true);
    expect(list.canPay(INVOICES[1])).toBe(false);
    expect(list.canPay(INVOICES[2])).toBe(false);
    expect(list.canCancel(INVOICES[0])).toBe(true);
    expect(list.canCancel(INVOICES[1])).toBe(true);
    expect(list.canCancel(INVOICES[2])).toBe(false);
  });

  it('should PATCH state paid when marking an invoice as paid and reload', async () => {
    const { list } = await createList();

    list.markPaid(INVOICES[0]);

    const change = http.expectOne(`${BASE}/1`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual({ state: 'paid' });
    change.flush({ invoice: { ...INVOICES[0], state: 'paid' } });

    http.expectOne(BASE).flush({
      invoices: [{ ...INVOICES[0], state: 'paid' }, ...INVOICES.slice(1)],
    });
    expect(list.rows()[0].state).toBe('paid');
  });

  it('should PATCH state cancelled (not the logical delete) after the confirmation is accepted', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.cancel(INVOICES[1]);

    const change = http.expectOne(`${BASE}/2`);
    expect(change.request.method).toBe('PATCH');
    expect(change.request.body).toEqual({ state: 'cancelled' });
    change.flush({ invoice: { ...INVOICES[1], state: 'cancelled' } });
    http.expectOne(BASE).flush({ invoices: INVOICES });

    http.expectNone(`${BASE}/2/deactivate`);
  });

  it('should show the backend message when the state change fails', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.markPaid(INVOICES[0]);
    http
      .expectOne(`${BASE}/1`)
      .flush({ error: 'Invoice not found' }, { status: 404, statusText: 'Not Found' });

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'No se pudo cambiar el estado',
        detail: 'Invoice not found',
      }),
    );
  });

  it('should call deactivate after the confirmation is accepted and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(INVOICES[0]);

    const deactivation = http.expectOne(`${BASE}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Invoice deactivated (logical delete)' });
    http.expectOne(BASE).flush({ invoices: INVOICES.slice(1) });

    expect(list.rows().map((row) => row.id)).toEqual([2, 3]);
  });

  it('should call DELETE after the confirmation is accepted and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(INVOICES[2]);

    const deletion = http.expectOne(`${BASE}/3`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Invoice permanently deleted', id: 3 });
    http.expectOne(BASE).flush({ invoices: INVOICES.slice(0, 2) });

    expect(list.rows().length).toBe(2);
  });
});
