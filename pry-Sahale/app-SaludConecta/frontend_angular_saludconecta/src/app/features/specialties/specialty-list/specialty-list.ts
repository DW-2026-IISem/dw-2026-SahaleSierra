import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Specialty, SpecialtyPayload } from '../../../core/models/specialty.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { SpecialtyApi } from '../specialty-api';
import { SpecialtyForm } from '../specialty-form/specialty-form';
import { HasPermissionDirective } from '../../../shared/directives/has-permission';
/**
 * Lista de especialidades con todas las operaciones del CRUD.
 *
 * Misma estructura que `PatientList`: estado en signals, `visibleRows` como
 * `computed`, un solo `save` para crear y editar, y confirmación para las bajas.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-specialty-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    SpecialtyForm,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    HasPermissionDirective,  
  ],
  templateUrl: './specialty-list.html',
  styleUrl: './specialty-list.css',
})
export class SpecialtyList {
  private readonly api = inject(SpecialtyApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/specialties` solo devuelve `active`). */
  readonly rows = signal<Specialty[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [row.name, row.description]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Specialty | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() =>
    this.editing() ? 'Editar especialidad' : 'Nueva especialidad',
  );

  constructor() {
    this.load();
  }

  /** `GET /api/specialties`: recarga la tabla y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
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

  openEdit(specialty: Specialty): void {
    this.editing.set(specialty);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** Crear y editar comparten manejador: `editing()` decide el verbo. */
  save(payload: SpecialtyPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Especialidad actualizada' : 'Especialidad creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. La especialidad deja de listarse. */
  deactivate(specialty: Specialty): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar «${specialty.name}»? Su estado pasará a inactivo y dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(specialty.id).subscribe({
          next: () => {
            this.notify.warn('Especialidad desactivada');
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
  remove(specialty: Specialty): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará «${specialty.name}» de la base de datos. Esta acción no se puede deshacer. ` +
        'Si está asignada a médicos, el borrado puede fallar o quitar esas asignaciones: ' +
        'prefiere la baja lógica.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(specialty.id).subscribe({
          next: () => {
            this.notify.success('Especialidad eliminada');
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
