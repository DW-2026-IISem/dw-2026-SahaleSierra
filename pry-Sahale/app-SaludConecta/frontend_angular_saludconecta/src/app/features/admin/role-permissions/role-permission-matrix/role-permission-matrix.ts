import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { Resource } from '../../../../core/models/resource.model';
import { Role } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { ResourceApi } from '../../resources/resource-api';
import { ResourceRoleApi } from '../../resource-roles/resource-role-api';
import { RoleApi } from '../../roles/role-api';
import {
  CRUD_COLUMNS,
  CrudOperation,
  MatrixGroup,
  PermissionMatrixRow,
  buildPermissionMatrix,
  idsOf,
} from '../permission-matrix';

/** Rol que el backend no deja editar desde la matriz (409). */
const ADMIN_ROLE = 'ADMIN';

/**
 * Panel «Roles y permisos»: una matriz C/R/U/D por entidad para un rol.
 *
 * - Carga en paralelo `GET /api/roles` y `GET /api/resources`, y después
 *   `GET /api/resource-roles?role_id=` del rol elegido.
 * - Cada casilla agrupa varios recursos (ver `permission-matrix.ts`): marcada,
 *   parcial (`indeterminate`) o desmarcada.
 * - Guardar envía el estado final completo a `POST /api/resource-roles` con
 *   `{ role_id, resource_ids }`; el backend reconcilia en una transacción.
 *
 * Es una herramienta de administración, no de seguridad: quien decide cada
 * petición sigue siendo `authorize` en Express.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-role-permission-matrix',
  imports: [ButtonModule, EmptyState, FormsModule, MessageModule, PageHeader, SelectModule, TagModule],
  templateUrl: './role-permission-matrix.html',
  styleUrl: './role-permission-matrix.css',
})
export class RolePermissionMatrix {
  private readonly roleApi = inject(RoleApi);
  private readonly resourceApi = inject(ResourceApi);
  private readonly api = inject(ResourceRoleApi);
  private readonly notify = inject(NotificationService);
  private readonly session = inject(SessionStore);

  readonly columns = CRUD_COLUMNS;

  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly selectedRoleId = signal<number | null>(null);
  /** Lo que el administrador tiene marcado ahora (lo que se enviará). */
  readonly selectedResourceIds = signal<ReadonlySet<number>>(new Set());
  /** Lo que hay guardado en el backend para el rol (para saber si hay cambios). */
  readonly savedResourceIds = signal<ReadonlySet<number>>(new Set());

  readonly loading = signal(true);
  readonly loadingGrants = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly saveMessage = signal<string | null>(null);

  readonly rows = computed(() => buildPermissionMatrix(this.resources()));

  readonly groups = computed(() => {
    const groups: { name: MatrixGroup; rows: PermissionMatrixRow[] }[] = [];
    for (const name of ['Negocio', 'Seguridad'] as const) {
      const rows = this.rows().filter((row) => row.group === name);
      if (rows.length) {
        groups.push({ name, rows });
      }
    }
    return groups;
  });

  readonly roleOptions = computed(() =>
    this.roles().map((role) => ({
      id: role.id,
      label: role.name === ADMIN_ROLE ? `${role.name} (solo lectura)` : role.name,
    })),
  );

  readonly selectedRole = computed(
    () => this.roles().find((role) => role.id === this.selectedRoleId()) ?? null,
  );

  /** ADMIN conserva siempre el catálogo completo; el backend responde 409 si se intenta. */
  readonly isAdminRole = computed(() => this.selectedRole()?.name === ADMIN_ROLE);

  /** Sin `POST /api/resource-roles` la matriz se puede ver, pero no guardar. */
  readonly canSave = computed(() => this.session.canPermission('POST /api/resource-roles'));

  readonly readOnly = computed(() => this.isAdminRole() || !this.canSave());

  readonly busy = computed(() => this.loading() || this.loadingGrants() || this.saving());

  readonly dirty = computed(() => !sameIds(this.selectedResourceIds(), this.savedResourceIds()));

  readonly selectedCount = computed(() => this.selectedResourceIds().size);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      roles: this.roleApi.list(),
      resources: this.resourceApi.list(),
    }).subscribe({
      next: ({ roles, resources }) => {
        this.roles.set(roles);
        this.resources.set(resources.filter((resource) => resource.status === 'active'));
        this.loading.set(false);

        // Primer rol editable; si solo existe ADMIN, se muestra en solo lectura.
        const first = roles.find((role) => role.name !== ADMIN_ROLE) ?? roles[0];
        if (first) {
          this.selectRole(first.id);
        }
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  selectRole(roleId: number | null): void {
    this.selectedRoleId.set(roleId);
    this.saveMessage.set(null);
    this.error.set(null);
    this.selectedResourceIds.set(new Set());
    this.savedResourceIds.set(new Set());
    if (roleId !== null) {
      this.loadRoleGrants(roleId);
    }
  }

  isGranted(row: PermissionMatrixRow, operation: CrudOperation): boolean {
    const ids = idsOf(row, operation);
    const selected = this.selectedResourceIds();
    return ids.length > 0 && ids.every((id) => selected.has(id));
  }

  isPartial(row: PermissionMatrixRow, operation: CrudOperation): boolean {
    const ids = idsOf(row, operation);
    const selected = this.selectedResourceIds();
    const count = ids.filter((id) => selected.has(id)).length;
    return count > 0 && count < ids.length;
  }

  /** Marcar o desmarcar una casilla mueve **todos** los recursos que agrupa. */
  setOperation(row: PermissionMatrixRow, operation: CrudOperation, checked: boolean): void {
    if (this.readOnly()) {
      return;
    }
    const next = new Set(this.selectedResourceIds());
    for (const id of idsOf(row, operation)) {
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
    }
    this.selectedResourceIds.set(next);
    this.saveMessage.set(null);
  }

  toggleOperation(row: PermissionMatrixRow, operation: CrudOperation, event: Event): void {
    this.setOperation(row, operation, (event.target as HTMLInputElement).checked);
  }

  /** Texto accesible y tooltip de la casilla: operación + entidad y endpoints que cubre. */
  cellTitle(row: PermissionMatrixRow, operation: CrudOperation): string {
    return row.operations[operation].map((resource) => `${resource.method} ${resource.path}`).join('\n');
  }

  markAll(): void {
    if (!this.readOnly()) {
      this.selectedResourceIds.set(new Set(this.resources().map((resource) => resource.id)));
      this.saveMessage.set(null);
    }
  }

  clearAll(): void {
    if (!this.readOnly()) {
      this.selectedResourceIds.set(new Set());
      this.saveMessage.set(null);
    }
  }

  discard(): void {
    this.selectedResourceIds.set(new Set(this.savedResourceIds()));
    this.saveMessage.set(null);
  }

  save(): void {
    const roleId = this.selectedRoleId();
    if (roleId === null || this.readOnly() || this.busy()) {
      return;
    }
    const resourceIds = [...this.selectedResourceIds()].sort((a, b) => a - b);
    const roleName = this.selectedRole()?.name ?? `#${roleId}`;

    this.saving.set(true);
    this.error.set(null);
    this.saveMessage.set(null);

    this.api.reconcileRole(roleId, resourceIds).subscribe({
      next: (result) => {
        this.saving.set(false);
        this.saveMessage.set(
          `Cambios guardados para ${roleName}: ${result.activated} concedidos, ` +
            `${result.deactivated} retirados, ${result.total_active} permisos activos.`,
        );
        this.notify.success('Permisos actualizados');
        this.loadRoleGrants(roleId);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(toApiMessage(error));
        this.notify.error('No se guardaron los permisos', toApiMessage(error));
      },
    });
  }

  private loadRoleGrants(roleId: number): void {
    this.loadingGrants.set(true);
    const catalog = new Set(this.resources().map((resource) => resource.id));

    this.api.list({ role_id: roleId }).subscribe({
      next: (grants) => {
        // Si mientras tanto se eligió otro rol, esta respuesta ya no sirve.
        if (this.selectedRoleId() !== roleId) {
          return;
        }
        const ids = new Set(
          grants
            .filter((grant) => grant.status === 'active' && catalog.has(grant.resource_id))
            .map((grant) => grant.resource_id),
        );
        this.selectedResourceIds.set(ids);
        this.savedResourceIds.set(new Set(ids));
        this.loadingGrants.set(false);
      },
      error: (error: unknown) => {
        if (this.selectedRoleId() !== roleId) {
          return;
        }
        this.error.set(toApiMessage(error));
        this.loadingGrants.set(false);
      },
    });
  }
}

function sameIds(a: ReadonlySet<number>, b: ReadonlySet<number>): boolean {
  return a.size === b.size && [...a].every((id) => b.has(id));
}
