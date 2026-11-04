import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

/**
 * Pantalla de acceso denegado. Lee el permiso faltante del query param
 * `?permission=…`, que el `permissionGuard` (ISS-16) rellenará.
 */
@Component({
  host: { class: 'flex min-h-screen items-center justify-center bg-slate-100 p-4' },
  selector: 'app-forbidden',
  imports: [ButtonModule],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
})
export class Forbidden {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly permission = this.route.snapshot.queryParamMap.get('permission');

  back(): void {
    void this.router.navigate(['/dashboard']);
  }
}
