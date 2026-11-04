import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { toNumber } from '../../../core/models/api.model';
import { Appointment } from '../../../core/models/appointment.model';
import { Encounter } from '../../../core/models/encounter.model';
import { Invoice } from '../../../core/models/invoice.model';
import { Patient } from '../../../core/models/patient.model';
import { Service } from '../../../core/models/service.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { AppointmentApi } from '../../appointments/appointment-api';
import { EncounterApi } from '../../encounters/encounter-api';
import { PatientApi } from '../../patients/patient-api';
import { ServiceApi } from '../../services/service-api';
import { InvoiceApi } from '../invoice-api';

/** Opción del select de pacientes: solo los que tienen algo por facturar. */
interface PatientOption {
  id: number;
  label: string;
}

/** Una atención facturable de un paciente, ya con su nombre de servicio y total numérico. */
interface BillableRow {
  id: number;
  serviceName: string;
  startDate: string | null;
  observations: string | null;
  total: number;
}

/**
 * Sugiere el siguiente número de factura a partir de las existentes
 * (`FV-100005` → `FV-100006`). Ignora los números que no siguen el patrón.
 * Es solo una sugerencia: el usuario puede cambiarla y el backend valida que
 * sea único.
 */
export function nextInvoiceNumber(invoices: Invoice[]): string {
  const sequences = invoices
    .map((invoice) => /^FV-(\d+)$/i.exec(invoice.number)?.[1])
    .filter((digits): digits is string => digits !== undefined);

  if (sequences.length === 0) {
    return 'FV-100001';
  }

  const width = Math.max(...sequences.map((digits) => digits.length));
  const next = Math.max(...sequences.map(Number)) + 1;
  return `FV-${next.toString().padStart(width, '0')}`;
}

/**
 * Nueva factura: el **borrador vive en memoria** (signals) y no toca el
 * servidor hasta «Registrar factura».
 *
 * Flujo: elegir paciente → ver sus atenciones `completed` sin factura → marcar
 * las que se facturan → ver subtotal y total calculados con `computed` → un
 * único `POST` con `encounter_ids`. El frontend **no envía** subtotal ni total:
 * los calcula el backend; los de pantalla son una vista previa.
 *
 * No usa `FormGroup`: la selección es un arreglo y los totales son derivados.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-invoice-form',
  imports: [
    ButtonModule,
    CardModule,
    CheckboxModule,
    CurrencyPipe,
    DatePipe,
    EmptyState,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    PageHeader,
    RouterLink,
    SelectModule,
    TableModule,
  ],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.css',
})
export class InvoiceForm {
  private readonly api = inject(InvoiceApi);
  private readonly encounterApi = inject(EncounterApi);
  private readonly appointmentApi = inject(AppointmentApi);
  private readonly patientApi = inject(PatientApi);
  private readonly serviceApi = inject(ServiceApi);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  // Catálogos cargados del servidor.
  readonly encounters = signal<Encounter[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly patients = signal<Patient[]>([]);
  readonly services = signal<Service[]>([]);
  readonly invoices = signal<Invoice[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  // Borrador (solo en memoria).
  readonly patientId = signal<number | null>(null);
  readonly selectedIds = signal<number[]>([]);
  readonly invoiceNumber = signal('');
  readonly tax = signal(0);

  private readonly appointmentById = computed(
    () => new Map(this.appointments().map((appointment) => [appointment.id, appointment])),
  );
  private readonly serviceNames = computed(
    () => new Map(this.services().map((service) => [service.id, service.name])),
  );

  /** Atenciones que se pueden facturar: completadas y sin factura. */
  readonly billable = computed(() =>
    this.encounters().filter(
      (encounter) => encounter.state === 'completed' && encounter.invoice_id === null,
    ),
  );

  /** `Encounter` no trae `patient_id`: se llega por su cita. */
  private patientOf(encounter: Encounter): number | null {
    return this.appointmentById().get(encounter.appointment_id)?.patient_id ?? null;
  }

  /** Pacientes con al menos una atención por facturar, con su conteo. */
  readonly patientOptions = computed<PatientOption[]>(() => {
    const counts = new Map<number, number>();
    for (const encounter of this.billable()) {
      const patientId = this.patientOf(encounter);
      if (patientId !== null) {
        counts.set(patientId, (counts.get(patientId) ?? 0) + 1);
      }
    }

    return this.patients()
      .filter((patient) => counts.has(patient.id))
      .map((patient) => {
        const count = counts.get(patient.id) ?? 0;
        return {
          id: patient.id,
          label:
            `${patient.name} · ${patient.document_type} ${patient.document_number} ` +
            `(${count} ${count === 1 ? 'atención' : 'atenciones'})`,
        };
      });
  });

  /** Atenciones facturables del paciente elegido. */
  readonly rows = computed<BillableRow[]>(() => {
    const patientId = this.patientId();
    if (patientId === null) {
      return [];
    }

    return this.billable()
      .filter((encounter) => this.patientOf(encounter) === patientId)
      .map((encounter) => ({
        id: encounter.id,
        serviceName: this.serviceNames().get(encounter.service_id) ?? `Servicio #${encounter.service_id}`,
        startDate: this.appointmentById().get(encounter.appointment_id)?.start_date ?? null,
        observations: encounter.observations,
        // DECIMAL llega como string ("85000.00"): sin `toNumber` se concatenaría.
        total: toNumber(encounter.total),
      }));
  });

  readonly selectedRows = computed(() => {
    const selected = new Set(this.selectedIds());
    return this.rows().filter((row) => selected.has(row.id));
  });

  readonly subtotal = computed(() =>
    this.selectedRows().reduce((sum, row) => sum + row.total, 0),
  );

  /** Un impuesto vacío, negativo o no numérico cuenta como 0. */
  readonly taxAmount = computed(() => {
    const value = Number(this.tax());
    return Number.isFinite(value) && value > 0 ? value : 0;
  });

  readonly total = computed(() => this.subtotal() + this.taxAmount());

  constructor() {
    this.load();
  }

  /** Cinco `GET` en paralelo; ninguno modifica nada. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      encounters: this.encounterApi.list(),
      appointments: this.appointmentApi.list(),
      patients: this.patientApi.list(),
      services: this.serviceApi.list(),
      invoices: this.api.list(),
    }).subscribe({
      next: ({ encounters, appointments, patients, services, invoices }) => {
        this.encounters.set(encounters);
        this.appointments.set(appointments);
        this.patients.set(patients);
        this.services.set(services);
        this.invoices.set(invoices);
        if (this.invoiceNumber() === '') {
          this.invoiceNumber.set(nextInvoiceNumber(invoices));
        }
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  /** Cambiar de paciente vacía la selección: una factura es de un solo paciente. */
  selectPatient(patientId: number | null): void {
    this.patientId.set(patientId);
    this.selectedIds.set([]);
    this.error.set(null);
  }

  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  toggle(id: number): void {
    this.error.set(null);
    this.selectedIds.update((ids) =>
      ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id],
    );
  }

  selectAll(): void {
    this.selectedIds.set(this.rows().map((row) => row.id));
  }

  clearSelection(): void {
    this.selectedIds.set([]);
  }

  setTax(value: number | null): void {
    this.tax.set(value ?? 0);
  }

  /**
   * Validación preventiva en el cliente y un único `POST`. El backend vuelve a
   * validar (atenciones activas, `completed`, sin factura y del mismo paciente):
   * si algo cambió desde la carga, su mensaje se muestra tal cual.
   */
  save(): void {
    const number = this.invoiceNumber().trim();

    if (number === '') {
      this.error.set('El número de factura es obligatorio.');
      return;
    }
    if (this.patientId() === null) {
      this.error.set('Selecciona el paciente a facturar.');
      return;
    }
    if (this.selectedIds().length === 0) {
      this.error.set('Selecciona al menos una atención para facturar.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.api
      .create({ number, encounter_ids: this.selectedIds(), tax: this.taxAmount() })
      .subscribe({
        next: (invoice) => {
          this.saving.set(false);
          this.notify.success(
            `Factura ${invoice.number} registrada`,
            'Las atenciones quedaron facturadas.',
          );
          void this.router.navigate(['/invoices']);
        },
        error: (error: unknown) => {
          this.saving.set(false);
          const message = toApiMessage(error);
          this.error.set(message);
          this.notify.error('La factura no se registró', message);
        },
      });
  }
}
