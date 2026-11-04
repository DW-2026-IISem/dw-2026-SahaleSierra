import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import {
  HTTP_METHODS,
  HttpMethod,
  Resource,
  ResourcePayload,
} from '../../../../core/models/resource.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission';
import { ResourceApi } from '../resource-api';
import { ResourceForm } from '../resource-form/resource-form';

@Component({
  host: { class: 'block' },
  selector: 'app-resource-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    FormsModule,
    HasPermissionDirective,
    InputTextModule,
    MessageModule,
    PageHeader,
    ResourceForm,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.css',
})
export class ResourceList {
  private readonly api = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly methodFilter = signal<HttpMethod | null>(null);

  readonly methodOptions = [
    { label: 'Todos', value: null as HttpMethod | null },
    ...HTTP_METHODS.map((m) => ({ label: m, value: m as HttpMethod | null })),
  ];

  readonly visibleRows = computed(() => {
    const method = this.methodFilter();
    const base = filterRows(this.rows(), this.filter(), (r) => [
      r.path,
      r.method,
      r.description,
    ]);
    return method ? base.filter((r) => r.method === method) : base;
  });

  readonly countsByMethod = computed(() => {
    const counts = new Map<string, number>();
    for (const row of this.rows()) {
      counts.set(row.method, (counts.get(row.method) ?? 0) + 1);
    }
    return counts;
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<Resource | null>(null);
  readonly resetKey = signal(0);
  readonly title = computed(() => (this.editing() ? 'Editar recurso' : 'Nuevo recurso'));

  constructor() {
    this.load();
  }

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
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  openEdit(resource: Resource): void {
    this.editing.set(resource);
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  save(payload: ResourcePayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Recurso actualizado' : 'Recurso creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  severityFor(method: HttpMethod): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
    switch (method) {
      case 'GET':
        return 'info';
      case 'POST':
        return 'success';
      case 'PUT':
      case 'PATCH':
        return 'warn';
      case 'DELETE':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  deactivate(resource: Resource): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el recurso ${resource.method} ${resource.path}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(resource.id).subscribe({
          next: () => {
            this.notify.warn('Recurso desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  remove(resource: Resource): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el recurso ${resource.method} ${resource.path}. Puede romper concesiones históricas.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(resource.id).subscribe({
          next: () => {
            this.notify.success('Recurso eliminado');
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
