import { Component, effect, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../core/models/api.model';
import { Patient, PatientPayload } from '../../../core/models/patient.model';

/** Fecha local de hoy como `YYYY-MM-DD` (sin pasar por UTC). */
function today(): string {
  return new Date().toLocaleDateString('en-CA');
}

/** La fecha de nacimiento no puede ser futura. `YYYY-MM-DD` se compara como texto. */
function notFuture(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && control.value > today() ? { future: true } : null;
}

/**
 * Formulario de paciente, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `patient` (o `null` para crear) y emite el payload
 * con `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo, así
 * que este componente sirve igual dentro de un Dialog que en una página.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-patient-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css',
})
export class PatientForm {
  /** Paciente a editar. `null` deja el formulario en modo creación. */
  readonly patient = input<Patient | null>(null);

  /**
   * Cambia cada vez que el padre abre el diálogo.
   *
   * Sin esto, reabrir «Nuevo paciente» tras cancelar conservaría lo escrito:
   * `patient` sigue siendo `null`, así que el `effect()` no volvería a correr.
   * Es una llave explícita para reiniciar, no un estado duplicado.
   */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<PatientPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** Máximo del campo de fecha: hoy. */
  protected readonly maxBirthDate = today();

  readonly documentTypes = [
    { label: 'CC · Cédula de ciudadanía', value: 'CC' },
    { label: 'TI · Tarjeta de identidad', value: 'TI' },
    { label: 'CE · Cédula de extranjería', value: 'CE' },
    { label: 'RC · Registro civil', value: 'RC' },
    { label: 'PA · Pasaporte', value: 'PA' },
  ];

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    document_type: ['CC', [Validators.required]],
    document_number: ['', [Validators.required, Validators.maxLength(30)]],
    name: ['', [Validators.required, Validators.maxLength(120)]],
    birth_date: ['', [Validators.required, notFuture]],
    contact: ['', [Validators.required, Validators.maxLength(60)]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    // `effect()` reacciona al input `patient()`: el mismo formulario sirve para
    // crear y editar sin `ngOnChanges` ni comparar objetos a mano.
    effect(() => {
      const current = this.patient();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el
      // formulario aunque `patient` siga siendo `null`.
      this.resetKey();

      this.form.reset({
        document_type: current?.document_type ?? 'CC',
        document_number: current?.document_number ?? '',
        name: current?.name ?? '',
        birth_date: current?.birth_date ?? '',
        contact: current?.contact ?? '',
        status: current?.status ?? 'active',
      });

      // El backend solo cambia `status` con PATCH /deactivate. Si el campo
      // siguiera habilitado, el formulario prometería algo que no hace.
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
    const payload: PatientPayload = {
      document_type: value.document_type,
      document_number: value.document_number.trim(),
      name: value.name.trim(),
      birth_date: value.birth_date,
      contact: value.contact.trim(),
    };

    // `status` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.patient() ? payload : { ...payload, status: value.status });
  }
}
