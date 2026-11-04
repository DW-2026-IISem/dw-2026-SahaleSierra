import { DatePipe } from '@angular/common';
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
import { Agenda } from '../../../core/models/agenda.model';
import {
  Appointment,
  AppointmentPayload,
  AppointmentState,
  AppointmentUpdatePayload,
} from '../../../core/models/appointment.model';
import { Doctor } from '../../../core/models/doctor.model';
import { Patient } from '../../../core/models/patient.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StateTag } from '../../../shared/ui/state-tag/state-tag';
import { AgendaApi } from '../../agendas/agenda-api';
import { DoctorApi } from '../../doctors/doctor-api';
import { PatientApi } from '../../patients/patient-api';
import { AppointmentApi } from '../appointment-api';
import { AppointmentForm } from '../appointment-form/appointment-form';
import { HasPermissionDirective } from '../../../shared/directives/has-permission';
/**
 * Lista de citas con todas las operaciones del CRUD y la cancelación.
 *
 * Carga citas, agendas, médicos y pacientes en paralelo y resuelve los nombres
 * con `Map`. Cancelar una cita (`state = 'cancelled'`) no es lo mismo que darla
 * de baja (`status = 'inactive'`): la cancelada sigue en la tabla.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-appointment-list',
  imports: [
    AppointmentForm,
    ButtonModule,
    DatePipe,
    DialogModule,
    EmptyState,
    FormsModule,
    InputTextModule,
    MessageModule,
    PageHeader,
    SelectModule,
    StateTag,
    TableModule,
    TagModule,
    TooltipModule,
    HasPermissionDirective,    
  ],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
})
export class AppointmentList {
  private readonly api = inject(AppointmentApi);
  private readonly agendasApi = inject(AgendaApi);
  private readonly doctorsApi = inject(DoctorApi);
  private readonly patientsApi = inject(PatientApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Appointment[]>([]);
  readonly agendas = signal<Agenda[]>([]);
  readonly doctors = signal<Doctor[]>([]);
  readonly patients = signal<Patient[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly stateFilter = signal<AppointmentState | null>(null);

  readonly stateOptions = [
    { label: 'Todas', value: null },
    { label: 'Programadas', value: 'scheduled' },
    { label: 'Atendidas', value: 'attended' },
    { label: 'Canceladas', value: 'cancelled' },
  ];

  // ───── Mapas id → dato (uno por relación, construidos una sola vez) ───────

  private readonly patientById = computed(
    () => new Map(this.patients().map((patient) => [patient.id, patient])),
  );
  private readonly agendaById = computed(
    () => new Map(this.agendas().map((agenda) => [agenda.id, agenda])),
  );
  private readonly doctorById = computed(
    () => new Map(this.doctors().map((doctor) => [doctor.id, doctor])),
  );

  readonly patientName = computed(() => {
    const byId = this.patientById();
    return (id: number) => byId.get(id)?.name ?? `Paciente #${id}`;
  });

  readonly patientDocument = computed(() => {
    const byId = this.patientById();
    return (id: number) => byId.get(id)?.document_number ?? '';
  });

  /** «Agenda · médico»; si falta alguno se muestra el id. */
  readonly agendaLabel = computed(() => {
    const agendas = this.agendaById();
    const doctors = this.doctorById();
    return (id: number) => {
      const agenda = agendas.get(id);
      if (!agenda) {
        return `Agenda #${id}`;
      }
      const doctor = doctors.get(agenda.doctor_id)?.name ?? `Médico #${agenda.doctor_id}`;
      return `${agenda.name} · ${doctor}`;
    };
  });

  readonly scheduledCount = computed(
    () => this.rows().filter((appointment) => appointment.state === 'scheduled').length,
  );

  /** Filtro por estado y luego el buscador por motivo, paciente, documento o agenda. */
  readonly visibleRows = computed(() => {
    const state = this.stateFilter();
    const byState = state ? this.rows().filter((row) => row.state === state) : this.rows();

    return filterRows(byState, this.filter(), (appointment) => [
      appointment.reason,
      this.patientName()(appointment.patient_id),
      this.patientDocument()(appointment.patient_id),
      this.agendaLabel()(appointment.agenda_id),
    ]);
  });

  // ───── Diálogo ────────────────────────────────────────────────────────────

  readonly dialogVisible = signal(false);
  readonly editing = signal<Appointment | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar cita' : 'Programar cita'));

  constructor() {
    this.load();
  }

  /** Solo las citas programadas se editan o cancelan; el backend manda. */
  canChange(appointment: Appointment): boolean {
    return appointment.state === 'scheduled';
  }

  /** Carga las cuatro listas en paralelo y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      appointments: this.api.list(),
      agendas: this.agendasApi.list(),
      doctors: this.doctorsApi.list(),
      patients: this.patientsApi.list(),
    }).subscribe({
      next: ({ appointments, agendas, doctors, patients }) => {
        this.rows.set(appointments);
        this.agendas.set(agendas);
        this.doctors.set(doctors);
        this.patients.set(patients);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.agendas.set([]);
        this.doctors.set([]);
        this.patients.set([]);
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

  openEdit(appointment: Appointment): void {
    this.editing.set(appointment);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** `POST /api/appointments`. Si falla (p. ej. cruce de horario), el diálogo sigue abierto. */
  create(payload: AppointmentPayload): void {
    this.saving.set(true);

    this.api.create(payload).subscribe({
      next: () => this.finishSave('Cita programada'),
      error: (error: unknown) => this.failSave(error),
    });
  }

  /** `PATCH /api/appointments/:id` con los campos que cambiaron. */
  update(payload: AppointmentUpdatePayload): void {
    const current = this.editing();
    if (!current) {
      return;
    }
    this.saving.set(true);

    this.api.update(current.id, payload).subscribe({
      next: () => this.finishSave('Cita actualizada'),
      error: (error: unknown) => this.failSave(error),
    });
  }

  /** El formulario no detectó cambios: se cierra sin enviar nada. */
  onUnchanged(): void {
    this.dialogVisible.set(false);
    this.notify.info('Sin cambios', 'No modificaste ningún dato de la cita.');
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

  /**
   * Cancelar = `PATCH { state: 'cancelled' }`. La cita sigue activa y sigue en la
   * tabla, con su etiqueta roja; no es la baja lógica.
   */
  cancelAppointment(appointment: Appointment): void {
    this.confirmation.confirm({
      header: 'Cancelar cita',
      message:
        `¿Cancelar la cita de ${this.patientName()(appointment.patient_id)}? Quedará en estado ` +
        '«Cancelada» y seguirá visible en la tabla.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cancelar cita',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.update(appointment.id, { state: 'cancelled' }).subscribe({
          next: () => {
            this.notify.warn('Cita cancelada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo cancelar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. La cita deja de listarse. */
  deactivate(appointment: Appointment): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message:
        `¿Dar de baja la cita de ${this.patientName()(appointment.patient_id)}? Dejará de ` +
        'listarse. Para solo marcarla como cancelada usa «Cancelar cita».',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Dar de baja',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(appointment.id).subscribe({
          next: () => {
            this.notify.warn('Cita dada de baja');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo dar de baja', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(appointment: Appointment): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará la cita de ${this.patientName()(appointment.patient_id)} de la base de ` +
        'datos. Esta acción no se puede deshacer. Si tiene autorización o atención asociada, ' +
        'el borrado fallará: usa la baja lógica.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(appointment.id).subscribe({
          next: () => {
            this.notify.success('Cita eliminada');
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
