import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { toNumber } from '../../core/models/api.model';
import { Appointment } from '../../core/models/appointment.model';
import { Encounter } from '../../core/models/encounter.model';
import { Invoice } from '../../core/models/invoice.model';
import { Patient } from '../../core/models/patient.model';
import { toApiMessage } from '../../core/utils/api-error';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { StateTag } from '../../shared/ui/state-tag/state-tag';
import { AppointmentApi } from '../appointments/appointment-api';
import { EncounterApi } from '../encounters/encounter-api';
import { InvoiceApi } from '../invoices/invoice-api';
import { PatientApi } from '../patients/patient-api';

/**
 * Panel de la Fase I.
 *
 * La API entrega las listas completas (cuatro `GET` en paralelo con `forkJoin`);
 * todo lo demás se **calcula** con `computed`: pacientes activos, citas
 * programadas, atenciones completadas sin facturar e ingresos facturados. Cada
 * `GET` de colección ya devuelve solo registros `active`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-dashboard',
  imports: [
    ButtonModule,
    CardModule,
    CurrencyPipe,
    DatePipe,
    EmptyState,
    MessageModule,
    PageHeader,
    RouterLink,
    SkeletonModule,
    StateTag,
    TableModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly patientApi = inject(PatientApi);
  private readonly appointmentApi = inject(AppointmentApi);
  private readonly encounterApi = inject(EncounterApi);
  private readonly invoiceApi = inject(InvoiceApi);

  readonly patients = signal<Patient[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly encounters = signal<Encounter[]>([]);
  readonly invoices = signal<Invoice[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** Indicador 1: pacientes activos (el `GET` ya filtra por `active`). */
  readonly activePatients = computed(() => this.patients().length);

  /** Indicador 2: citas con `state = 'scheduled'`. */
  readonly scheduledAppointments = computed(() =>
    this.appointments().filter((appointment) => appointment.state === 'scheduled'),
  );

  /** Indicador 3: atenciones `completed` cuyo `invoice_id` sigue nulo. */
  readonly pendingEncounters = computed(() =>
    this.encounters().filter(
      (encounter) => encounter.state === 'completed' && (encounter.invoice_id ?? null) === null,
    ),
  );

  /** Valor acumulado de lo que falta por facturar. */
  readonly pendingAmount = computed(() =>
    this.pendingEncounters().reduce((sum, encounter) => sum + toNumber(encounter.total), 0),
  );

  /** Facturas que cuentan como ingreso: todas menos las `cancelled`. */
  readonly billedInvoices = computed(() =>
    this.invoices().filter((invoice) => invoice.state !== 'cancelled'),
  );

  /** Indicador 4: ingresos = suma de `invoices.total` no cancelados. */
  readonly revenue = computed(() =>
    this.billedInvoices().reduce((sum, invoice) => sum + toNumber(invoice.total), 0),
  );

  /** Las cinco próximas citas programadas, de la más cercana a la más lejana. */
  readonly upcoming = computed(() => {
    const now = Date.now();
    return this.scheduledAppointments()
      .filter((appointment) => new Date(appointment.start_date).getTime() >= now)
      .sort(
        (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      )
      .slice(0, 5);
  });

  /** Las cinco facturas más recientes por `invoice_date`. */
  readonly latestInvoices = computed(() =>
    [...this.invoices()]
      .sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime())
      .slice(0, 5),
  );

  /** `computed` devuelve una función: el `Map` se rehace solo si cambian los pacientes. */
  readonly patientName = computed(() => {
    const names = new Map(this.patients().map((patient) => [patient.id, patient.name] as const));
    return (id: number) => names.get(id) ?? `Paciente #${id}`;
  });

  constructor() {
    this.load();
  }

  /** Cuatro peticiones independientes en paralelo; la pantalla se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      patients: this.patientApi.list(),
      appointments: this.appointmentApi.list(),
      encounters: this.encounterApi.list(),
      invoices: this.invoiceApi.list(),
    }).subscribe({
      next: ({ patients, appointments, encounters, invoices }) => {
        this.patients.set(patients);
        this.appointments.set(appointments);
        this.encounters.set(encounters);
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.patients.set([]);
        this.appointments.set([]);
        this.encounters.set([]);
        this.invoices.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }
}
