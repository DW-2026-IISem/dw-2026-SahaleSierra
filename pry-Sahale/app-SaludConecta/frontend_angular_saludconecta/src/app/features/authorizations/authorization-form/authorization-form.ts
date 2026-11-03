import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import {
  Authorization,
  AuthorizationPayload,
  AuthorizationUpdatePayload,
} from '../../../core/models/authorization.model';

/** Una cita ofrecida en el select: el padre arma el texto (paciente · hora · agenda). */
export interface AppointmentOption {
  id: number;
  label: string;
}

/**
 * Formulario de autorización, reutilizado para crear y editar.
 *
 * No llama a la API. Recibe `authorization` (o `null` para crear) y las citas que
 * se pueden elegir, y emite `created` o `updated`. El padre decide el verbo HTTP.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-authorization-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './authorization-form.html',
  styleUrl: './authorization-form.css',
})
export class AuthorizationForm {
  /** Autorización a editar. `null` deja el formulario en modo creación. */
  readonly authorization = input<Authorization | null>(null);

  /** Citas que se pueden elegir al crear (las que todavía no tienen autorización). */
  readonly appointmentOptions = input<AppointmentOption[]>([]);

  /** Texto de la cita de la autorización en edición (solo lectura). */
  readonly appointmentLabel = input('');

  /** Llave para reiniciar el formulario al reabrir el diálogo. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly created = output<AuthorizationPayload>();
  readonly updated = output<AuthorizationUpdatePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activa', value: 'active' },
    { label: 'Inactiva', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    description: [''],
    appointment_id: [null as number | null, [Validators.required]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.authorization();
      // Reabrir el diálogo debe vaciar el formulario aunque `authorization` siga en null.
      this.resetKey();

      this.form.reset({
        name: current?.name ?? '',
        description: current?.description ?? '',
        appointment_id: current?.appointment_id ?? null,
        status: current?.status ?? 'active',
      });

      // La cita de una autorización no cambia y el estado solo cambia con /deactivate.
      if (current) {
        this.form.controls.appointment_id.disable();
        this.form.controls.status.disable();
      } else {
        this.form.controls.appointment_id.enable();
        this.form.controls.status.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const name = value.name.trim();
    const description = value.description.trim() || null;

    // Edición: solo `name` y `description`.
    if (this.authorization()) {
      this.updated.emit({ name, description });
      return;
    }

    if (value.appointment_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.created.emit({
      name,
      description,
      appointment_id: value.appointment_id,
      status: value.status,
    });
  }
}
