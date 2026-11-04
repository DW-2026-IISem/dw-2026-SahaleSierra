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
import { RoleUser } from '../../../../core/models/role-user.model';
import { Role } from '../../../../core/models/role.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission';
import { RoleApi } from '../../roles/role-api';
import { UserApi } from '../../users/user-api';
import { RoleUserApi } from '../role-user-api';

/**
 * Asignaciones usuario ↔ rol (`role_users`).
 *
 * - `GET /api/role-users` devuelve `{ assignments }` (no `role_users`).
 * - `POST` hace **create-or-reactivate**: si el par ya existía inactivo, lo
 *   reactiva. La UI no llama a `/reactivate` a mano.
 * - Solo se retira con `PATCH /:id/deactivate`. No hay DELETE.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-role-user-list',
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
  templateUrl: './role-user-list.html',
  styleUrl: './role-user-list.css',
})
export class RoleUserList {
  private readonly api = inject(RoleUserApi);
  private readonly userApi = inject(UserApi);
  private readonly roleApi = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<RoleUser[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Mapa para resolver username rápido. */
  private readonly userById = computed(
    () => new Map(this.users().map((u) => [u.id, u])),
  );

  /** Mapa para resolver nombre de rol. */
  private readonly roleById = computed(
    () => new Map(this.roles().map((r) => [r.id, r])),
  );

  readonly userName = computed(() => {
    const byId = this.userById();
    return (id: number) => byId.get(id)?.username ?? `Usuario #${id}`;
  });

  readonly userEmail = computed(() => {
    const byId = this.userById();
    return (id: number) => byId.get(id)?.email ?? '';
  });

  readonly roleName = computed(() => {
    const byId = this.roleById();
    return (id: number) => byId.get(id)?.name ?? `Rol #${id}`;
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      this.userName()(row.user_id),
      this.userEmail()(row.user_id),
      this.roleName()(row.role_id),
    ]),
  );

  /** Opciones para el select del diálogo (usuarios y roles activos). */
  readonly userOptions = computed(() =>
    this.users().map((u) => ({ id: u.id, label: `${u.username} · ${u.email}` })),
  );
  readonly roleOptions = computed(() =>
    this.roles().map((r) => ({ id: r.id, label: r.name })),
  );

  // ── Diálogo de asignación ──────────────────────────────────────────────
  readonly dialogVisible = signal(false);
  readonly selectedUserId = signal<number | null>(null);
  readonly selectedRoleId = signal<number | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      assignments: this.api.list(),
      users: this.userApi.list(),
      roles: this.roleApi.list(),
    }).subscribe({
      next: ({ assignments, users, roles }) => {
        this.rows.set(assignments);
        this.users.set(users);
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.users.set([]);
        this.roles.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.selectedUserId.set(null);
    this.selectedRoleId.set(null);
    this.dialogVisible.set(true);
  }

  save(): void {
    const userId = this.selectedUserId();
    const roleId = this.selectedRoleId();
    if (userId === null || roleId === null) {
      return;
    }
    this.saving.set(true);
    this.api.create({ user_id: userId, role_id: roleId }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Rol asignado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo asignar el rol', toApiMessage(error));
      },
    });
  }

  retirar(row: RoleUser): void {
    this.confirmation.confirm({
      header: 'Retirar rol',
      message:
        `¿Retirar el rol «${this.roleName()(row.role_id)}» a ` +
        `«${this.userName()(row.user_id)}»? La asignación pasará a inactiva. ` +
        'Si se vuelve a asignar el mismo rol, el backend la reactivará.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Asignación retirada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo retirar', toApiMessage(error));
          },
        });
      },
    });
  }
}
