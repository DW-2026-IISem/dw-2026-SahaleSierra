import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Encounter } from '../../core/models/encounter.model';
import { Invoice } from '../../core/models/invoice.model';
import { InvoiceApi } from './invoice-api';

const BASE = `${environment.apiUrl}/invoices`;
const ENCOUNTER = { id: 5, total: '85000.00', invoice_id: 9 } as Encounter;
const INVOICE = { id: 9, number: 'FV-100009', subtotal: '85000.00', total: '85000.00' } as Invoice;

describe('InvoiceApi', () => {
  let api: InvoiceApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(InvoiceApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should keep the encounters when they come inside the invoice', () => {
    let result: Invoice | undefined;
    api.create({ number: 'FV-100009', encounter_ids: [5] }).subscribe((r) => (result = r));

    http.expectOne(BASE).flush({ invoice: { ...INVOICE, encounters: [ENCOUNTER] } });

    expect(result?.encounters).toEqual([ENCOUNTER]);
  });

  it('should move the encounters next to the invoice into invoice.encounters', () => {
    let result: Invoice | undefined;
    api.create({ number: 'FV-100009', encounter_ids: [5] }).subscribe((r) => (result = r));

    http.expectOne(BASE).flush({ invoice: INVOICE, encounters: [ENCOUNTER] });

    expect(result?.encounters).toEqual([ENCOUNTER]);
  });
});
