import { Component, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { watchMediaQuery } from '../../core/utils/media-query';
import { AuthService } from '../../core/services/auth';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

/**
 * Layout persistente de la aplicación.
 *
 * El Header, el Aside y el Footer se montan **una sola vez**; solo la región
 * central cambia con `<router-outlet />`. Reutilizar el layout evita remontar
 * el menú (y perder el scroll o el foco) al navegar.
 *
 * Fase II (ISS-15): el botón de logout del Aside ejecuta `AuthService.logout()`
 * y navega a `/login`. La sesión completa (username, roles, menú filtrado) se
 * conecta en ISS-16.
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

  /** `lg` de Tailwind: desde aquí el Aside es fijo y el botón lo alterna. */
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  /** Escritorio: Aside fijo visible u oculto. */
  readonly sidebarCollapsed = signal(false);

  /** Móvil: Drawer abierto. */
  readonly mobileOpen = signal(false);

  /**
   * Menú de la Fase I: cada ISS agrega su opción. En ISS-16 se arma según los
   * permisos efectivos.
   */
  readonly items: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Pacientes', icon: 'pi pi-users', routerLink: '/patients' },
    { label: 'Especialidades', icon: 'pi pi-heart', routerLink: '/specialties' },
    { label: 'Servicios', icon: 'pi pi-briefcase', routerLink: '/services' },
    { label: 'Médicos', icon: 'pi pi-user', routerLink: '/doctors' },
    {
      label: 'Médicos y especialidades',
      icon: 'pi pi-link',
      routerLink: '/doctor-specialties',
    },
    { label: 'Agendas', icon: 'pi pi-calendar', routerLink: '/agendas' },
    { label: 'Historias clínicas', icon: 'pi pi-file-edit', routerLink: '/clinical-records' },
    { label: 'Citas', icon: 'pi pi-calendar', routerLink: '/appointments' },
    { label: 'Autorizaciones', icon: 'pi pi-check-circle', routerLink: '/authorizations' },
    { label: 'Atenciones', icon: 'pi pi-clipboard', routerLink: '/encounters' },
    { label: 'Facturas', icon: 'pi pi-receipt', routerLink: '/invoices' },
    { label: 'Mi sesión', icon: 'pi pi-user', routerLink: '/profile' },
  ];

  /**
   * Un solo botón, dos disposiciones: en escritorio alterna el Aside fijo; por
   * debajo de `lg` abre el Drawer.
   */
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
        void this.router.navigate(['/login']);
      },
    });
  }
}
