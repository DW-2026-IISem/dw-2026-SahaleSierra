import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorSpecialtyPayload } from '../../../core/models/doctor-specialty.model';
import { Specialty } from '../../../core/models/specialty.model';

/**
 * Formulario para asignar una especialidad a un médico.
 *
 * No llama a la API: recibe los catálogos **ya filtrados a activos** por el
 * padre y emite el par de ids con `saved`. Un registro del pivote no tiene más
 * datos que el par, así que aquí solo se crea; para cambiarlo se da de baja y
 * se asigna de nuevo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-doctor-specialty-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, SelectModule],
  templateUrl: './doctor-specialty-form.html',
  styleUrl: './doctor-specialty-form.css',
})
export class DoctorSpecialtyForm {
  /** Médicos activos que ofrece el select. */
  readonly doctors = input<Doctor[]>([]);

  /** Especialidades activas que ofrece el select. */
  readonly specialties = input<Specialty[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nueva asignación». */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<DoctorSpecialtyPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    doctor_id: [null as number | null, [Validators.required]],
    specialty_id: [null as number | null, [Validators.required]],
  });

  constructor() {
    effect(() => {
      // Reabrir el diálogo debe vaciar los selects.
      this.resetKey();
      this.form.reset({ doctor_id: null, specialty_id: null });
    });
  }

  submit(): void {
    const { doctor_id, specialty_id } = this.form.getRawValue();

    if (this.form.invalid || doctor_id === null || specialty_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    // `optionValue="id"` deja un número en el control, no el objeto completo.
    this.saved.emit({ doctor_id, specialty_id });
  }
}
