import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { User, UserPayload } from '../../../../core/models/user.model';

/**
 * Formulario de usuario, reutilizado para crear y editar.
 *
 * - Al crear: `username`, `email`, `password`, `avatar` opcional.
 * - Al editar: `username`, `email`, `avatar`. **No se envía `password`**
 *   (el backend solo lo acepta en `POST`; para cambiarla existe
 *   `PATCH /api/users/:id/password`, que es una acción aparte del listado) y
 *   **no se envía `status`** (el estado se cambia con `/deactivate`).
 */
@Component({
  host: { class: 'block' },
  selector: 'app-user-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  /** Usuario a editar. `null` deja el formulario en modo creación. */
  readonly user = input<User | null>(null);

  /** Llave para reiniciar el formulario al reabrir el diálogo. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<UserPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8)]],
    avatar: [''],
  });

  constructor() {
    effect(() => {
      const current = this.user();
      // Reabrir el diálogo debe vaciar el formulario aunque `user` siga en null.
      this.resetKey();

      this.form.reset({
        username: current?.username ?? '',
        email: current?.email ?? '',
        password: '',
        avatar: current?.avatar ?? '',
      });

      // La contraseña solo se pide al crear. En edición se deshabilita.
      if (current) {
        this.form.controls.password.disable();
      } else {
        this.form.controls.password.enable();
        this.form.controls.password.setValidators([
          Validators.required,
          Validators.minLength(8),
        ]);
        this.form.controls.password.updateValueAndValidity();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UserPayload = {
      username: value.username.trim(),
      email: value.email.trim(),
      avatar: value.avatar.trim() || null,
    };

    // `password` y `status` solo viajan al crear.
    if (!this.user()) {
      payload.password = value.password;
      payload.status = 'active';
    }

    this.saved.emit(payload);
  }
}
