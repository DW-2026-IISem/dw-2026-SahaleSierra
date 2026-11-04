import { Component, computed, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { watchMediaQuery } from '../../core/utils/media-query';
import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification';
import { SessionStore } from '../../core/services/session-store';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { NAV, NavGroup } from './nav.config';

/**
 * Layout persistente de la aplicación.
 *
 * Desde ISS-16 se conecta a `SessionStore`:
 *  - pasa usuario, rol y conteo de permisos al Header y al Aside;
 *  - calcula `navGroups()` filtrando `NAV` por `canPermission()`;
 *  - oculta el grupo Seguridad cuando `authEnabled` es `false`;
 *  - conecta el logout del Aside y del menú de usuario.
 *
 * Los ítems de `/admin/*` del grupo Seguridad se añaden en ISS-17.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Aside, Footer, ConfirmDialogModule, DrawerModule, ToastModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);
  private readonly session = inject(SessionStore);

  /** `lg` de Tailwind: desde aquí el Aside es fijo y el botón lo alterna. */
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  readonly sidebarCollapsed = signal(false);
  readonly mobileOpen = signal(false);

  // ─── Sesión expuesta a Header y Aside ────────────────────────────────────

  /** Iniciales para el avatar; dos letras del username en mayúsculas. */
  readonly initials = computed(() => {
    const username = this.session.user()?.username ?? '';
    return username.slice(0, 2).toUpperCase() || 'IN';
  });

  /** Etiqueta del rol principal: el primero de `roleNames()`, o "Sin rol". */
  readonly roleLabel = computed(() => this.session.roleNames()[0] ?? 'Sin rol');

  /** Menú de usuario del Header: Mi sesión + Cerrar sesión. */
  readonly userItems: MenuItem[] = [
    {
      label: 'Mi sesión',
      icon: 'pi pi-user',
      command: () => void this.router.navigate(['/profile']),
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => this.onLogout(),
    },
  ];

  // ─── Menú lateral ────────────────────────────────────────────────────────

  /**
   * Grupos del menú filtrados por los permisos efectivos de la sesión.
   * Si un grupo queda sin hojas visibles, se omite. Los grupos `authOnly` se
   * ocultan cuando `authEnabled` es `false` (modo laboratorio).
   */
  readonly navGroups = computed<MenuItem[]>(() =>
    NAV.filter((group) => !group.authOnly || this.session.authEnabled)
      .map<MenuItem>((group) => ({
        label: group.label,
        icon: group.icon,
        expanded: true,
        items: group.items
          .filter((leaf) => !leaf.permission || this.session.canPermission(leaf.permission))
          .map<MenuItem>((leaf) => ({
            label: leaf.label,
            icon: leaf.icon,
            routerLink: leaf.routerLink,
          })),
      }))
      .filter((group) => (group.items?.length ?? 0) > 0),
  );

  // ─── Disposición ─────────────────────────────────────────────────────────

  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }

  /** Logout solicitado desde el Aside o desde el menú de usuario. */
  protected onLogout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.notify.info('Sesión cerrada');
        void this.router.navigate(['/login']);
      },
    });
  }
}
