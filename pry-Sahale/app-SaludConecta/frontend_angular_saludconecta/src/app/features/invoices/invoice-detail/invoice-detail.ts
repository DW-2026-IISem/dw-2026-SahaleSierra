import { CurrencyPipe, DatePipe, Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { toNumber } from '../../../core/models/api.model';
import { Appointment } from '../../../core/models/appointment.model';
import { Encounter } from '../../../core/models/encounter.model';
import { Invoice } from '../../../core/models/invoice.model';
import { Patient } from '../../../core/models/patient.model';
import { Service } from '../../../core/models/service.model';
import { SessionStore } from '../../../core/services/session-store';
import { toApiMessage } from '../../../core/utils/api-error';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StateTag } from '../../../shared/ui/state-tag/state-tag';
import { AppointmentApi } from '../../appointments/appointment-api';
import { EncounterApi } from '../../encounters/encounter-api';
import { PatientApi } from '../../patients/patient-api';
import { ServiceApi } from '../../services/service-api';
import { InvoiceApi } from '../invoice-api';

/**
 * Detalle de una factura: cabecera, totales y las atenciones que agrupa.
 *
 * La API solo entrega ids (`service_id`, `appointment_id`); los nombres se
 * resuelven con `Map` dentro de `computed`, una vez por cambio de datos y no
 * una búsqueda por fila. Es una pantalla de solo lectura.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-invoice-detail',
  imports: [
    ButtonModule,
    CardModule,
    CurrencyPipe,
    DatePipe,
    EmptyState,
    MessageModule,
    PageHeader,
    SkeletonModule,
    StateTag,
    TableModule,
  ],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.css',
})
export class InvoiceDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly invoiceApi = inject(InvoiceApi);
  private readonly encounterApi = inject(EncounterApi);
  private readonly serviceApi = inject(ServiceApi);
  private readonly appointmentApi = inject(AppointmentApi);
  private readonly patientApi = inject(PatientApi);
  private readonly session = inject(SessionStore);

  /** `:id` de la ruta. `Number(null)` es 0 y `Number('abc')` es NaN: ambos inválidos. */
  readonly invoiceId = Number(this.route.snapshot.paramMap.get('id'));

  readonly invoice = signal<Invoice | null>(null);
  readonly lines = signal<Encounter[]>([]);
  readonly services = signal<Service[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly patients = signal<Patient[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** `false` si la factura no trae atenciones y el usuario no puede pedirlas. */
  readonly linesAvailable = signal(true);

  // ───── Visibilidad según permisos (UX; el backend vuelve a validar) ───────

  /** «Servicio» depende de `GET /api/services`. */
  readonly showServiceColumn = computed(() => this.session.canPermission('GET /api/services'));
  /** El paciente se llega por la cita: necesita citas y pacientes. */
  readonly showPatient = computed(
    () =>
      this.session.canPermission('GET /api/appointments') &&
      this.session.canPermission('GET /api/patients'),
  );
  /** Atención, Inicio, Estado, Observaciones y Total siempre; «Servicio» según permisos. */
  readonly columnCount = computed(() => 5 + (this.showServiceColumn() ? 1 : 0));

  readonly title = computed(() => {
    const current = this.invoice();
    return current ? `Factura ${current.number}` : 'Factura';
  });

  /** `computed` devuelve una función: el `Map` se rehace solo si cambian los servicios. */
  readonly serviceName = computed(() => {
    const names = new Map(this.services().map((service) => [service.id, service.name] as const));
    return (id: number) => names.get(id) ?? `Servicio #${id}`;
  });

  /**
   * Todas las atenciones de una factura son del mismo paciente (regla del
   * backend), así que basta resolver el de la primera: atención → cita → paciente.
   */
  readonly patientLabel = computed(() => {
    const first = this.lines()[0];
    if (!first) {
      return null;
    }

    const appointment = this.appointments().find((item) => item.id === first.appointment_id);
    if (!appointment) {
      return null;
    }

    const patient = this.patients().find((item) => item.id === appointment.patient_id);
    return patient ? patient.name : `Paciente #${appointment.patient_id}`;
  });

  /** Los montos DECIMAL pueden llegar como string: `toNumber` los normaliza. */
  readonly subtotal = computed(() => toNumber(this.invoice()?.subtotal));
  readonly tax = computed(() => toNumber(this.invoice()?.tax));
  readonly total = computed(() => toNumber(this.invoice()?.total));
  readonly linesTotal = computed(() =>
    this.lines().reduce((sum, line) => sum + toNumber(line.total), 0),
  );

  constructor() {
    this.load();
  }

  load(): void {
    const id = this.invoiceId;

    // Un `:id` inválido no merece ni una petición: el backend respondería 400.
    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('El identificador de la factura no es válido.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.invoiceApi
      .get(id)
      .pipe(
        switchMap((invoice) =>
          forkJoin({
            // Si el detalle ya trae las atenciones no se pide `/api/encounters`;
            // si no las trae y el usuario no puede leerlas, la tabla no se muestra.
            encounters: invoice.encounters
              ? of(invoice.encounters)
              : this.session.canPermission('GET /api/encounters')
                ? this.encounterApi
                    .list()
                    .pipe(map((all) => all.filter((encounter) => encounter.invoice_id === invoice.id)))
                : of<Encounter[] | null>(null),
            services: this.showServiceColumn() ? this.serviceApi.list() : of<Service[]>([]),
            appointments: this.showPatient() ? this.appointmentApi.list() : of<Appointment[]>([]),
            patients: this.showPatient() ? this.patientApi.list() : of<Patient[]>([]),
          }).pipe(map((rest) => ({ invoice, ...rest }))),
        ),
      )
      .subscribe({
        next: ({ invoice, encounters, services, appointments, patients }) => {
          this.invoice.set(invoice);
          this.lines.set(encounters ?? []);
          this.linesAvailable.set(encounters !== null);
          this.services.set(services);
          this.appointments.set(appointments);
          this.patients.set(patients);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.invoice.set(null);
          this.lines.set([]);
          this.error.set(toApiMessage(error));
          this.loading.set(false);
        },
      });
  }

  back(): void {
    this.location.back();
  }
}
