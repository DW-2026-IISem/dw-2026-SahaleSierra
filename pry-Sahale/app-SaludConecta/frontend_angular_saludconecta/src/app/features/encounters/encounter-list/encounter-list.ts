import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { toNumber } from '../../../core/models/api.model';
import { Appointment } from '../../../core/models/appointment.model';
import { ClinicalRecord } from '../../../core/models/clinical-record.model';
import {
  Encounter,
  EncounterPayload,
  EncounterState,
  EncounterUpdatePayload,
} from '../../../core/models/encounter.model';
import { Patient } from '../../../core/models/patient.model';
import { Service } from '../../../core/models/service.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { formatLocal } from '../../../core/utils/datetime';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StateTag } from '../../../shared/ui/state-tag/state-tag';
import { AppointmentApi } from '../../appointments/appointment-api';
import { ClinicalRecordApi } from '../../clinical-records/clinical-record-api';
import { PatientApi } from '../../patients/patient-api';
import { ServiceApi } from '../../services/service-api';
import { EncounterApi } from '../encounter-api';
import { EncounterAppointmentOption, EncounterForm } from '../encounter-form/encounter-form';

/**
 * Lista de atenciones y «Atender cita» (la regla central del enunciado).
 *
 * Carga atenciones, citas, pacientes, servicios e historias en paralelo y resuelve
 * los nombres con mapas. Al crear una atención, el backend pasa la cita a
 * `attended` en la misma transacción y la respuesta trae las dos cosas.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-encounter-list',
  imports: [
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    DialogModule,
    EmptyState,
    EncounterForm,
    FormsModule,
    InputTextModule,
    MessageModule,
    PageHeader,
    SelectModule,
    StateTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './encounter-list.html',
  styleUrl: './encounter-list.css',
})
export class EncounterList {
  private readonly api = inject(EncounterApi);
  private readonly appointmentsApi = inject(AppointmentApi);
  private readonly patientsApi = inject(PatientApi);
  private readonly servicesApi = inject(ServiceApi);
  private readonly recordsApi = inject(ClinicalRecordApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Encounter[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly patients = signal<Patient[]>([]);
  readonly services = signal<Service[]>([]);
  readonly clinicalRecords = signal<ClinicalRecord[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly stateFilter = signal<EncounterState | null>(null);

  /** Para mostrar el total con `toNumber` (puede llegar como texto). */
  readonly money = toNumber;

  readonly stateOptions = [
    { label: 'Todas', value: null },
    { label: 'En curso', value: 'in_progress' },
    { label: 'Completadas', value: 'completed' },
    { label: 'Canceladas', value: 'cancelled' },
  ];

  // ───── Mapas id → dato ────────────────────────────────────────────────────

  private readonly appointmentById = computed(
    () => new Map(this.appointments().map((appointment) => [appointment.id, appointment])),
  );
  private readonly patientById = computed(
    () => new Map(this.patients().map((patient) => [patient.id, patient])),
  );
  private readonly serviceById = computed(
    () => new Map(this.services().map((service) => [service.id, service])),
  );

  /** Pacientes con historia clínica **activa** (`GET /api/clinical-records` solo trae activas). */
  private readonly patientsWithRecord = computed(
    () => new Set(this.clinicalRecords().map((record) => record.patient_id)),
  );

  private readonly patientNameOfAppointment = computed(() => {
    const appointments = this.appointmentById();
    const patients = this.patientById();
    return (appointmentId: number) => {
      const appointment = appointments.get(appointmentId);
      if (!appointment) {
        return `Cita #${appointmentId}`;
      }
      return patients.get(appointment.patient_id)?.name ?? `Paciente #${appointment.patient_id}`;
    };
  });

  /** Paciente de la cita de una atención. */
  readonly patientName = computed(() => this.patientNameOfAppointment());

  readonly serviceName = computed(() => {
    const byId = this.serviceById();
    return (id: number) => byId.get(id)?.name ?? `Servicio #${id}`;
  });

  /** «Paciente · fecha y hora» de una cita. */
  readonly appointmentLabel = computed(() => {
    const appointments = this.appointmentById();
    const nameOf = this.patientNameOfAppointment();
    return (id: number) => {
      const appointment = appointments.get(id);
      return appointment
        ? `${nameOf(id)} · ${formatLocal(appointment.start_date)}`
        : `Cita #${id}`;
    };
  });

  readonly inProgressCount = computed(
    () => this.rows().filter((encounter) => encounter.state === 'in_progress').length,
  );

  /** Completadas sin factura: lo que ISS-13 podrá facturar. */
  readonly unbilledCount = computed(
    () =>
      this.rows().filter(
        (encounter) => encounter.state === 'completed' && encounter.invoice_id === null,
      ).length,
  );

  readonly visibleRows = computed(() => {
    const state = this.stateFilter();
    const byState = state ? this.rows().filter((row) => row.state === state) : this.rows();

    return filterRows(byState, this.filter(), (encounter) => [
      this.patientName()(encounter.appointment_id),
      this.serviceName()(encounter.service_id),
      encounter.observations,
    ]);
  });

  // ───── «Atender cita» ─────────────────────────────────────────────────────

  /** Citas `scheduled`, marcadas con `hasRecord` (aviso previo; el backend es la regla). */
  readonly appointmentOptions = computed<EncounterAppointmentOption[]>(() =>
    this.appointments()
      .filter((appointment) => appointment.state === 'scheduled')
      .map((appointment) => ({
        id: appointment.id,
        label: this.appointmentLabel()(appointment.id),
        hasRecord: this.patientsWithRecord().has(appointment.patient_id),
      })),
  );

  // ───── Diálogo ────────────────────────────────────────────────────────────

  readonly dialogVisible = signal(false);
  readonly editing = signal<Encounter | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar atención' : 'Atender cita'));

  /** Al atender: citas programadas. Al editar: ninguna (la cita no se elige). */
  readonly formOptions = computed(() => (this.editing() ? [] : this.appointmentOptions()));

  readonly editingAppointmentLabel = computed(() => {
    const current = this.editing();
    return current ? this.appointmentLabel()(current.appointment_id) : '';
  });

  constructor() {
    this.load();
  }

  /** Una atención facturada no se puede eliminar (ni cambiar su total). */
  canRemove(encounter: Encounter): boolean {
    return encounter.invoice_id === null;
  }

  /** Solo una atención en curso se puede completar con un clic. */
  canComplete(encounter: Encounter): boolean {
    return encounter.state === 'in_progress';
  }

  /** Carga las cinco listas en paralelo y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      encounters: this.api.list(),
      appointments: this.appointmentsApi.list(),
      patients: this.patientsApi.list(),
      services: this.servicesApi.list(),
      records: this.recordsApi.list(),
    }).subscribe({
      next: ({ encounters, appointments, patients, services, records }) => {
        this.rows.set(encounters);
        this.appointments.set(appointments);
        this.patients.set(patients);
        this.services.set(services);
        this.clinicalRecords.set(records);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.appointments.set([]);
        this.patients.set([]);
        this.services.set([]);
        this.clinicalRecords.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(encounter: Encounter): void {
    this.editing.set(encounter);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * `POST /api/encounters` — «Atender cita». La respuesta trae la atención **y** la
   * cita, que en la misma transacción pasó a `attended`; el aviso usa ese dato.
   */
  create(payload: EncounterPayload): void {
    this.saving.set(true);

    this.api.create(payload).subscribe({
      next: ({ appointment }) => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(
          'Atención registrada',
          appointment.state === 'attended'
            ? `La cita #${appointment.id} pasó a «Atendida».`
            : `La cita #${appointment.id} quedó en estado «${appointment.state}».`,
        );
        this.load();
      },
      error: (error: unknown) => this.failSave(error),
    });
  }

  /** `PATCH /api/encounters/:id` con los campos que cambiaron. */
  update(payload: EncounterUpdatePayload): void {
    const current = this.editing();
    if (!current) {
      return;
    }
    this.saving.set(true);

    this.api.update(current.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Atención actualizada');
        this.load();
      },
      error: (error: unknown) => this.failSave(error),
    });
  }

  /** El formulario no detectó cambios: se cierra sin enviar nada. */
  onUnchanged(): void {
    this.dialogVisible.set(false);
    this.notify.info('Sin cambios', 'No modificaste ningún dato de la atención.');
  }

  private failSave(error: unknown): void {
    this.saving.set(false);
    this.notify.error('No se pudo guardar', toApiMessage(error));
  }

  /** «Completar»: `PATCH { state: 'completed' }`. Deja la atención lista para facturar. */
  complete(encounter: Encounter): void {
    this.api.update(encounter.id, { state: 'completed' }).subscribe({
      next: () => {
        this.notify.success('Atención completada', 'Ya se puede facturar.');
        this.load();
      },
      error: (error: unknown) => {
        this.notify.error('No se pudo completar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. La atención deja de listarse. */
  deactivate(encounter: Encounter): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message:
        `¿Dar de baja la atención de ${this.patientName()(encounter.appointment_id)}? ` +
        'Dejará de listarse.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Dar de baja',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(encounter.id).subscribe({
          next: () => {
            this.notify.warn('Atención dada de baja');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo dar de baja', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Solo atenciones sin factura. */
  remove(encounter: Encounter): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará la atención de ${this.patientName()(encounter.appointment_id)} de la base ` +
        'de datos. Esta acción no se puede deshacer.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(encounter.id).subscribe({
          next: () => {
            this.notify.success('Atención eliminada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
