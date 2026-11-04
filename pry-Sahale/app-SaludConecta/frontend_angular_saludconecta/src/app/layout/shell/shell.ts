import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { watchMediaQuery } from '../../core/utils/media-query';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

/**
 * Layout persistente de la aplicación.
 *
 * El Header, el Aside y el Footer se montan **una sola vez**; solo la región
 * central cambia con `<router-outlet />`. Reutilizar el layout evita remontar el
 * menú (y perder el scroll o el foco) al navegar.
 *
 * Fase I: sin `AuthService` ni `SessionStore`. Las rutas de negocio se agregan
 * como hijas de `Shell` desde ISS-03; la sesión, en ISS-15.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Aside, Footer, ConfirmDialogModule, DrawerModule, ToastModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  /** `lg` de Tailwind: desde aquí el Aside es fijo y el botón lo alterna. */
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  /** Escritorio: Aside fijo visible u oculto. */
  readonly sidebarCollapsed = signal(false);

  /** Móvil: Drawer abierto. */
  readonly mobileOpen = signal(false);

  /**
   * Menú mínimo de ISS-02: solo el prototipo, porque todavía no hay pantallas de
   * negocio. Cada ISS agrega su opción; en ISS-16 el menú se arma según los
   * permisos.
   */
  readonly items: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    {
      label: 'Admisiones',
      icon: 'pi pi-id-card',
      expanded: true,
      items: [
        { label: 'Pacientes', icon: 'pi pi-users', routerLink: '/patients' },
        { label: 'Citas', icon: 'pi pi-calendar', routerLink: '/appointments' },
        { label: 'Autorizaciones', icon: 'pi pi-check-circle', routerLink: '/authorizations' },
      ],
    },
    {
      label: 'Atención clínica',
      icon: 'pi pi-heart',
      expanded: true,
      items: [
        { label: 'Historias clínicas', icon: 'pi pi-file-edit', routerLink: '/clinical-records' },
        { label: 'Atenciones', icon: 'pi pi-clipboard', routerLink: '/encounters' },
      ],
    },
    {
      label: 'Facturación',
      icon: 'pi pi-wallet',
      expanded: true,
      items: [{ label: 'Facturas', icon: 'pi pi-receipt', routerLink: '/invoices' }],
    },
    {
      label: 'Catálogos',
      icon: 'pi pi-book',
      expanded: true,
      items: [
        { label: 'Especialidades', icon: 'pi pi-heart', routerLink: '/specialties' },
        { label: 'Servicios', icon: 'pi pi-briefcase', routerLink: '/services' },
        { label: 'Médicos', icon: 'pi pi-user', routerLink: '/doctors' },
        { label: 'Médicos y especialidades', icon: 'pi pi-link', routerLink: '/doctor-specialties' },
        { label: 'Agendas', icon: 'pi pi-calendar-plus', routerLink: '/agendas' },
      ],
    },
   
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
}
