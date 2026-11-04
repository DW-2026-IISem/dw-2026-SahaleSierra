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
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role } from '../../../../core/models/role.model';
import { HttpMethod, Resource } from '../../../../core/models/resource.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission';
import { ResourceApi } from '../../resources/resource-api';
import { RoleApi } from '../../roles/role-api';
import { ResourceRoleApi } from '../resource-role-api';

/**
 * Concesiones rol ↔ recurso (`resource_roles`). Cada fila ES un permiso.
 *
 * - `GET /api/resource-roles` devuelve `{ grants }` (no `resource_roles`).
 * - Filtros por rol y por recurso vía `HttpParams` (`?role_id=&resource_id=`).
 * - `POST` hace **create-or-reactivate** si el par ya existía inactivo.
 * - Solo se revoca con `PATCH /:id/deactivate`. No hay DELETE.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-resource-role-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    FormsModule,
    HasPermissionDirective,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    SelectModule,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './resource-role-list.html',
  styleUrl: './resource-role-list.css',
})
export class ResourceRoleList {
  private readonly api = inject(ResourceRoleApi);
  private readonly roleApi = inject(RoleApi);
  private readonly resourceApi = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<ResourceRole[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  /** Filtros del servidor. */
  readonly filterRoleId = signal<number | null>(null);
  readonly filterResourceId = signal<number | null>(null);
  /** Búsqueda cliente por método/path (por si quieres acotar más). */
  readonly filterText = signal('');

  /** Mapa id → rol y id → recurso para resolver los nombres en la tabla. */
  private readonly roleById = computed(
    () => new Map(this.roles().map((r) => [r.id, r])),
  );
  private readonly resourceById = computed(
    () => new Map(this.resources().map((r) => [r.id, r])),
  );

  readonly roleName = computed(() => {
    const byId = this.roleById();
    return (id: number) => byId.get(id)?.name ?? `Rol #${id}`;
  });

  readonly resourceLabel = computed(() => {
    const byId = this.resourceById();
    return (id: number) => {
      const resource = byId.get(id);
      return resource ? `${resource.method} ${resource.path}` : `Recurso #${id}`;
    };
  });

  /** Si el filtro por texto existe, filtra en cliente; si no, deja lo que trajo el backend. */
  readonly visibleRows = computed(() => {
    const term = this.filterText().trim().toLowerCase();
    if (!term) {
      return this.rows();
    }
    return this.rows().filter((row) => {
      const rol = this.roleName()(row.role_id).toLowerCase();
      const recurso = this.resourceLabel()(row.resource_id).toLowerCase();
      return rol.includes(term) || recurso.includes(term);
    });
  });

  readonly roleOptions = computed(() =>
    this.roles().map((r) => ({ id: r.id, label: r.name })),
  );

  readonly resourceOptions = computed(() =>
    this.resources().map((r) => ({
      id: r.id,
      label: `${r.method} ${r.path}`,
      method: r.method,
      path: r.path,
    })),
  );

  // ── Diálogo de concesión ────────────────────────────────────────────────
  readonly dialogVisible = signal(false);
  readonly selectedRoleId = signal<number | null>(null);
  readonly selectedResourceId = signal<number | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    const filters: { role_id?: number; resource_id?: number } = {};
    if (this.filterRoleId() !== null) {
      filters.role_id = this.filterRoleId()!;
    }
    if (this.filterResourceId() !== null) {
      filters.resource_id = this.filterResourceId()!;
    }

    forkJoin({
      grants: this.api.list(filters),
      roles: this.roleApi.list(),
      resources: this.resourceApi.list(),
    }).subscribe({
      next: ({ grants, roles, resources }) => {
        this.rows.set(grants);
        this.roles.set(roles);
        this.resources.set(resources);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  /** Se llama al cambiar los selects de filtro: pide al servidor con HttpParams. */
  onFilterChange(): void {
    this.load();
  }

  openCreate(): void {
    this.selectedRoleId.set(null);
    this.selectedResourceId.set(null);
    this.dialogVisible.set(true);
  }

  save(): void {
    const roleId = this.selectedRoleId();
    const resourceId = this.selectedResourceId();
    if (roleId === null || resourceId === null) {
      return;
    }
    this.saving.set(true);
    this.api.create({ role_id: roleId, resource_id: resourceId }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Permiso concedido');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo conceder el permiso', toApiMessage(error));
      },
    });
  }

  revocar(row: ResourceRole): void {
    this.confirmation.confirm({
      header: 'Revocar permiso',
      message:
        `¿Revocar «${this.resourceLabel()(row.resource_id)}» al rol ` +
        `«${this.roleName()(row.role_id)}»? La concesión pasará a inactiva. ` +
        'Si se vuelve a conceder el mismo par, el backend lo reactivará.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Revocar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Permiso revocado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo revocar', toApiMessage(error));
          },
        });
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
}
