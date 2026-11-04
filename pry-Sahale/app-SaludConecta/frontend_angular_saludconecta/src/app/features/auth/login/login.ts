import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { toApiMessage } from '../../../core/utils/api-error';
import { AuthService } from '../../../core/services/auth';

/**
 * Formulario de inicio de sesión.
 *
 * El backend devuelve SOLO tokens; `AuthService.login()` encadena con `me()`
 * para cargar el perfil y los permisos efectivos antes de emitir. Aquí se
 * navega al `returnUrl` (validado) al completarse.
 */
@Component({
  host: { class: 'flex min-h-screen items-center justify-center bg-slate-100 p-4' },
  selector: 'app-login',
  imports: [ButtonModule, InputTextModule, MessageModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { identifier, password } = this.form.getRawValue();
    this.auth.login({ identifier, password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl(this.safeReturnUrl());
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(toApiMessage(error));
      },
    });
  }

  /** Solo rutas internas; evita open redirects a dominios externos. */
  private safeReturnUrl(): string {
    const requested = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
    return requested.startsWith('/') && !requested.startsWith('/login') ? requested : '/dashboard';
  }
}
