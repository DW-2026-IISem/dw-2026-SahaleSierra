import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Specialty, SpecialtyPayload } from '../../../core/models/specialty.model';

/**
 * Formulario de especialidad, reutilizado para crear y editar.
 *
 * Misma forma que `PatientForm`: no llama a la API; recibe `specialty` (o `null`
 * para crear) y emite el payload con `saved`. El padre decide entre `POST` y
 * `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-specialty-form',
  imports: [
    MessageModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './specialty-form.html',
  styleUrl: './specialty-form.css',
})
export class SpecialtyForm {
  /** Especialidad a editar. `null` deja el formulario en modo creación. */
  readonly specialty = input<Specialty | null>(null);

  /** Llave para reiniciar el formulario al reabrir «Nueva especialidad». */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<SpecialtyPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.specialty();
      // Reabrir el diálogo debe vaciar el formulario aunque `specialty` siga en null.
      this.resetKey();

      this.form.reset({
        name: current?.name ?? '',
        description: current?.description ?? '',
        status: current?.status ?? 'active',
      });

      // El estado solo cambia con PATCH /deactivate: en edición no se ofrece.
      if (current) {
        this.form.controls.status.disable();
      } else {
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
    const payload: SpecialtyPayload = {
      name: value.name.trim(),
      description: value.description.trim() || null,
    };

    // `status` solo se envía al crear.
    this.saved.emit(this.specialty() ? payload : { ...payload, status: value.status });
  }
}
