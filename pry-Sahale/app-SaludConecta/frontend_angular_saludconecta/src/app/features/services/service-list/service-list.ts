import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Service, ServicePayload } from '../../../core/models/service.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ServiceApi } from '../service-api';
import { ServiceForm } from '../service-form/service-form';
import { HasPermissionDirective } from '../../../shared/directives/has-permission';
/**
 * Lista de servicios con todas las operaciones del CRUD.
 *
 * Misma estructura que `PatientList`: estado en signals, `visibleRows` como
 * `computed`, un solo `save` para crear y editar, y confirmación para las bajas.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-service-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    ServiceForm,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    HasPermissionDirective,  
  ],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css',
})
export class ServiceList {
  private readonly api = inject(ServiceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/services` solo devuelve `active`). */
  readonly rows = signal<Service[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [row.name, row.description]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Service | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() =>
    this.editing() ? 'Editar servicio' : 'Nuevo servicio',
  );

  constructor() {
    this.load();
  }

  /** `GET /api/services`: recarga la tabla y limpia el error anterior. */
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

  openEdit(service: Service): void {
    this.editing.set(service);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** Crear y editar comparten manejador: `editing()` decide el verbo. */
  save(payload: ServicePayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Servicio actualizado' : 'Servicio creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. El servicio deja de listarse. */
  deactivate(service: Service): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar «${service.name}»? Su estado pasará a inactivo y dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(service.id).subscribe({
          next: () => {
            this.notify.warn('Servicio desactivado');
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
  remove(service: Service): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará «${service.name}» de la base de datos. Esta acción no se puede deshacer. ` +
        'Si tiene atenciones registradas, el borrado fallará: prefiere la baja lógica.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(service.id).subscribe({
          next: () => {
            this.notify.success('Servicio eliminado');
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
