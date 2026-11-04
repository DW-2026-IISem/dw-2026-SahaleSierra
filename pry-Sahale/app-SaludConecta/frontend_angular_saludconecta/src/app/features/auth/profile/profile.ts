import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../core/services/auth';
import { SessionStore } from '../../../core/services/session-store';
import { NotificationService } from '../../../core/services/notification';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

/**
 * Pantalla de perfil: identidad, roles y permisos efectivos.
 * "Actualizar permisos" vuelve a pedir `profile` + `permissions` al backend;
 * "Cerrar sesión" llama a `logout()` y navega a /login.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-profile',
  imports: [ButtonModule, CardModule, PageHeader, TableModule, TagModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);
  readonly session = inject(SessionStore);

  readonly refreshing = signal(false);
  readonly loggingOut = signal(false);

  refresh(): void {
    this.refreshing.set(true);
    this.auth.me().subscribe({
      next: () => {
        this.refreshing.set(false);
        this.notify.success('Sesión sincronizada', 'Perfil y permisos recargados.');
      },
      error: () => this.refreshing.set(false),
    });
  }

  logout(): void {
    this.loggingOut.set(true);
    this.auth.logout().subscribe({
      next: () => {
        this.loggingOut.set(false);
        this.notify.info('Sesión cerrada');
        void this.router.navigate(['/login']);
      },
    });
  }
}
