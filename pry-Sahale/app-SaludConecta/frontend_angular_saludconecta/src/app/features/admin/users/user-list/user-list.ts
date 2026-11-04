import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { User, UserPayload } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission';
import { UserApi } from '../user-api';
import { UserForm } from '../user-form/user-form';

@Component({
  host: { class: 'block' },
  selector: 'app-user-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    HasPermissionDirective,
    InputTextModule,
    MessageModule,
    PageHeader,
    ReactiveFormsModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    UserForm,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly api = inject(UserApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly rows = signal<User[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (u) => [u.username, u.email]),
  );

  // ── Diálogo de usuario (crear / editar) ─────────────────────────────────
  readonly dialogVisible = signal(false);
  readonly editing = signal<User | null>(null);
  readonly resetKey = signal(0);
  readonly title = computed(() => (this.editing() ? 'Editar usuario' : 'Nuevo usuario'));

  // ── Diálogo «Ver permisos» ──────────────────────────────────────────────
  readonly permissionsVisible = signal(false);
  readonly permissionsLoading = signal(false);
  readonly permissionsRows = signal<EffectivePermission[]>([]);
  readonly permissionsUser = signal<User | null>(null);
  readonly permissionsRoles = computed(() => {
    const byId = new Map<number, string>();
    for (const permission of this.permissionsRows()) {
      byId.set(permission.role_id, permission.role_name);
    }
    return [...byId.entries()].map(([id, name]) => ({ id, name }));
  });

  // ── Diálogo «Cambiar contraseña» ────────────────────────────────────────
  readonly passwordVisible = signal(false);
  readonly passwordSaving = signal(false);
  readonly passwordUser = signal<User | null>(null);
  readonly passwordForm = this.fb.group({
    current_password: ['', [Validators.required]],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
  });

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

  openEdit(user: User): void {
    this.editing.set(user);
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  save(payload: UserPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Usuario actualizado' : 'Usuario creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  viewPermissions(user: User): void {
    this.permissionsUser.set(user);
    this.permissionsRows.set([]);
    this.permissionsVisible.set(true);
    this.permissionsLoading.set(true);

    this.api.permissions(user.id).subscribe({
      next: (rows) => {
        this.permissionsRows.set(rows);
        this.permissionsLoading.set(false);
      },
      error: (error: unknown) => {
        this.permissionsLoading.set(false);
        this.notify.error('No se pudieron cargar los permisos', toApiMessage(error));
      },
    });
  }

  openPassword(user: User): void {
    this.passwordUser.set(user);
    this.passwordForm.reset({ current_password: '', new_password: '' });
    this.passwordVisible.set(true);
  }

  savePassword(): void {
    const user = this.passwordUser();
    if (!user || this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordSaving.set(true);
    const value = this.passwordForm.getRawValue();

    this.api.changePassword(user.id, value).subscribe({
      next: () => {
        this.passwordSaving.set(false);
        this.passwordVisible.set(false);
        this.notify.success('Contraseña actualizada');
      },
      error: (error: unknown) => {
        this.passwordSaving.set(false);
        this.notify.error('No se pudo cambiar la contraseña', toApiMessage(error));
      },
    });
  }

  deactivate(user: User): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar a «${user.username}»? Su estado pasará a inactivo y dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(user.id).subscribe({
          next: () => {
            this.notify.warn('Usuario desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  remove(user: User): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará a «${user.username}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(user.id).subscribe({
          next: () => {
            this.notify.success('Usuario eliminado');
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
