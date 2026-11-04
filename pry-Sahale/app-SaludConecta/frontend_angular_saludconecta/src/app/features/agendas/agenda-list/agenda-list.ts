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
import { Agenda, AgendaPayload } from '../../../core/models/agenda.model';
import { Doctor } from '../../../core/models/doctor.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { DoctorApi } from '../../doctors/doctor-api';
import { AgendaApi } from '../agenda-api';
import { AgendaForm } from '../agenda-form/agenda-form';
import { HasPermissionDirective } from '../../../shared/directives/has-permission';
/**
 * Lista de agendas con todas las operaciones del CRUD.
 *
 * Cada agenda pertenece a un médico (`doctor_id`). La pantalla carga agendas y
 * médicos activos en paralelo: los médicos alimentan el select del formulario y
 * resuelven el nombre que se muestra en la tabla.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-agenda-list',
  imports: [
    AgendaForm,
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    HasPermissionDirective,  
  ],
  templateUrl: './agenda-list.html',
  styleUrl: './agenda-list.css',
})
export class AgendaList {
  private readonly api = inject(AgendaApi);
  private readonly doctorApi = inject(DoctorApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/agendas` solo devuelve `active`). */
  readonly rows = signal<Agenda[]>([]);
  /** Médicos activos: alimentan el select y resuelven el nombre. */
  readonly doctors = signal<Doctor[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** `Map` id → nombre, reconstruido solo cuando cambian los médicos. */
  readonly doctorName = computed(() => {
    const names = new Map(this.doctors().map((doctor) => [doctor.id, doctor.name]));
    return (id: number) => names.get(id) ?? `Médico #${id}`;
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.name,
      row.description,
      this.doctorName()(row.doctor_id),
    ]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Agenda | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar agenda' : 'Nueva agenda'));

  constructor() {
    this.load();
  }

  /** Dos `GET` en paralelo: la tabla se pinta una sola vez, con el nombre del médico. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      agendas: this.api.list(),
      doctors: this.doctorApi.list(),
    }).subscribe({
      next: ({ agendas, doctors }) => {
        this.rows.set(agendas);
        this.doctors.set(doctors);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.doctors.set([]);
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

  openEdit(agenda: Agenda): void {
    this.editing.set(agenda);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** Crear y editar comparten manejador: `editing()` decide el verbo. */
  save(payload: AgendaPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Agenda actualizada' : 'Agenda creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. La agenda deja de listarse. */
  deactivate(agenda: Agenda): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar «${agenda.name}»? Su estado pasará a inactivo y dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(agenda.id).subscribe({
          next: () => {
            this.notify.warn('Agenda desactivada');
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
  remove(agenda: Agenda): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará «${agenda.name}» de la base de datos. Esta acción no se puede deshacer. ` +
        'Si tiene citas registradas, el borrado fallará: prefiere la baja lógica.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(agenda.id).subscribe({
          next: () => {
            this.notify.success('Agenda eliminada');
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
