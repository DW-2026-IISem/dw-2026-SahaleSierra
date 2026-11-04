import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Agenda } from '../../../core/models/agenda.model';
import { Appointment } from '../../../core/models/appointment.model';
import {
  Authorization,
  AuthorizationPayload,
  AuthorizationUpdatePayload,
} from '../../../core/models/authorization.model';
import { Patient } from '../../../core/models/patient.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { formatLocal } from '../../../core/utils/datetime';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StateTag } from '../../../shared/ui/state-tag/state-tag';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { AgendaApi } from '../../agendas/agenda-api';
import { AppointmentApi } from '../../appointments/appointment-api';
import { PatientApi } from '../../patients/patient-api';
import { AuthorizationApi } from '../authorization-api';
import { AppointmentOption, AuthorizationForm } from '../authorization-form/authorization-form';
import { HasPermissionDirective } from '../../../shared/directives/has-permission';
/**
 * Lista de autorizaciones con todas las operaciones del CRUD.
 *
 * Relación 0..1:1 con citas: carga todo en paralelo, resuelve la cita (paciente y
 * hora) con mapas y ofrece al formulario de alta solo las citas sin autorización.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-authorization-list',
  imports: [
    AuthorizationForm,
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StateTag,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    HasPermissionDirective,    
  ],
  templateUrl: './authorization-list.html',
  styleUrl: './authorization-list.css',
})
export class AuthorizationList {
  private readonly api = inject(AuthorizationApi);
  private readonly appointmentsApi = inject(AppointmentApi);
  private readonly patientsApi = inject(PatientApi);
  private readonly agendasApi = inject(AgendaApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Authorization[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly patients = signal<Patient[]>([]);
  readonly agendas = signal<Agenda[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  // ───── Mapas id → dato ────────────────────────────────────────────────────

  private readonly appointmentById = computed(
    () => new Map(this.appointments().map((appointment) => [appointment.id, appointment])),
  );
  private readonly patientById = computed(
    () => new Map(this.patients().map((patient) => [patient.id, patient])),
  );
  private readonly agendaById = computed(
    () => new Map(this.agendas().map((agenda) => [agenda.id, agenda])),
  );

  private readonly patientNameOf = (appointment: Appointment): string =>
    this.patientById().get(appointment.patient_id)?.name ?? `Paciente #${appointment.patient_id}`;

  /** «Paciente · fecha y hora» de una cita; si no está en la lista, `Cita #id`. */
  readonly appointmentLabel = computed(() => {
    const byId = this.appointmentById();
    return (id: number) => {
      const appointment = byId.get(id);
      return appointment
        ? `${this.patientNameOf(appointment)} · ${formatLocal(appointment.start_date)}`
        : `Cita #${id}`;
    };
  });

  readonly appointmentState = computed(() => {
    const byId = this.appointmentById();
    return (id: number) => byId.get(id)?.state ?? '';
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (authorization) => [
      authorization.name,
      authorization.description,
      this.appointmentLabel()(authorization.appointment_id),
    ]),
  );

  // ───── Relación 0..1:1 ────────────────────────────────────────────────────

  private readonly authorizedAppointmentIds = computed(
    () => new Set(this.rows().map((authorization) => authorization.appointment_id)),
  );

  /**
   * Citas sin autorización: lo que se ofrece al crear. Es una ayuda de la UI; la
   * regla «una por cita» la valida el backend.
   */
  readonly availableAppointments = computed(() =>
    this.appointments().filter(
      (appointment) => !this.authorizedAppointmentIds().has(appointment.id),
    ),
  );

  /** Opciones del select de alta: «paciente · hora · agenda». */
  readonly appointmentOptions = computed<AppointmentOption[]>(() =>
    this.availableAppointments().map((appointment) => ({
      id: appointment.id,
      label:
        `${this.appointmentLabel()(appointment.id)} · ` +
        (this.agendaById().get(appointment.agenda_id)?.name ?? `Agenda #${appointment.agenda_id}`),
    })),
  );

  // ───── Diálogo ────────────────────────────────────────────────────────────

  readonly dialogVisible = signal(false);
  readonly editing = signal<Authorization | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar autorización' : 'Nueva autorización'));

  /** Al crear: citas sin autorización. Al editar: ninguna (la cita no se elige). */
  readonly formOptions = computed(() => (this.editing() ? [] : this.appointmentOptions()));

  readonly editingAppointmentLabel = computed(() => {
    const current = this.editing();
    return current ? this.appointmentLabel()(current.appointment_id) : '';
  });

  constructor() {
    this.load();
  }

  /** Carga las cuatro listas en paralelo y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      authorizations: this.api.list(),
      appointments: this.appointmentsApi.list(),
      patients: this.patientsApi.list(),
      agendas: this.agendasApi.list(),
    }).subscribe({
      next: ({ authorizations, appointments, patients, agendas }) => {
        this.rows.set(authorizations);
        this.appointments.set(appointments);
        this.patients.set(patients);
        this.agendas.set(agendas);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.appointments.set([]);
        this.patients.set([]);
        this.agendas.set([]);
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

  openEdit(authorization: Authorization): void {
    this.editing.set(authorization);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** `POST /api/authorizations`. Si falla, el diálogo sigue abierto. */
  create(payload: AuthorizationPayload): void {
    this.saving.set(true);

    this.api.create(payload).subscribe({
      next: () => this.finishSave('Autorización creada'),
      error: (error: unknown) => this.failSave(error),
    });
  }

  /** `PATCH /api/authorizations/:id` con `name` y `description` solamente. */
  update(payload: AuthorizationUpdatePayload): void {
    const current = this.editing();
    if (!current) {
      return;
    }
    this.saving.set(true);

    this.api.update(current.id, payload).subscribe({
      next: () => this.finishSave('Autorización actualizada'),
      error: (error: unknown) => this.failSave(error),
    });
  }

  private finishSave(message: string): void {
    this.saving.set(false);
    this.dialogVisible.set(false);
    this.notify.success(message);
    this.load();
  }

  private failSave(error: unknown): void {
    this.saving.set(false);
    this.notify.error('No se pudo guardar', toApiMessage(error));
  }

  /** Baja lógica: `PATCH /:id/deactivate`. La autorización deja de listarse. */
  deactivate(authorization: Authorization): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la autorización «${authorization.name}»? Dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(authorization.id).subscribe({
          next: () => {
            this.notify.warn('Autorización desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(authorization: Authorization): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará la autorización «${authorization.name}» de la base de datos. ` +
        'Esta acción no se puede deshacer.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(authorization.id).subscribe({
          next: () => {
            this.notify.success('Autorización eliminada');
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
