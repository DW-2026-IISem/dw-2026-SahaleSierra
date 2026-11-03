import { Component, computed, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import {
  ClinicalRecord,
  ClinicalRecordPayload,
  ClinicalRecordUpdatePayload,
} from '../../../core/models/clinical-record.model';
import { Patient } from '../../../core/models/patient.model';

/**
 * Formulario de historia clínica, reutilizado para crear y editar.
 *
 * No llama a la API. Recibe `record` (o `null` para crear) y los pacientes que
 * puede elegir, y emite `created` o `updated`. El padre decide el verbo HTTP y
 * controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-clinical-record-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './clinical-record-form.html',
  styleUrl: './clinical-record-form.css',
})
export class ClinicalRecordForm {
  /** Historia a editar. `null` deja el formulario en modo creación. */
  readonly record = input<ClinicalRecord | null>(null);

  /**
   * Pacientes que se pueden elegir al crear. El padre entrega solo los que **no**
   * tienen historia; en edición el paciente no se elige.
   */
  readonly patients = input<Patient[]>([]);

  /** Nombre del paciente de la historia en edición (solo lectura). */
  readonly patientLabel = input('');

  /** Paciente preseleccionado al crear (viene de la búsqueda por paciente). */
  readonly presetPatientId = input<number | null>(null);

  /** Llave para reiniciar el formulario al reabrir el diálogo. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly created = output<ClinicalRecordPayload>();
  readonly updated = output<ClinicalRecordUpdatePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** Última sugerencia de nombre, para reemplazarla si cambia el paciente. */
  private lastSuggestion = '';

  readonly statusOptions = [
    { label: 'Activa', value: 'active' },
    { label: 'Inactiva', value: 'inactive' },
  ];

  /** Opciones del select: `id` numérico + texto legible. */
  readonly patientOptions = computed(() =>
    this.patients().map((patient) => ({
      id: patient.id,
      label: `${patient.name} · ${patient.document_number}`,
    })),
  );

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    patient_id: [null as number | null, [Validators.required]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.record();
      const preset = this.presetPatientId();
      // Reabrir el diálogo debe vaciar el formulario aunque `record` siga en null.
      this.resetKey();

      this.form.reset({
        name: current?.name ?? '',
        description: current?.description ?? '',
        patient_id: current?.patient_id ?? preset,
        status: current?.status ?? 'active',
      });

      // El paciente de una historia no cambia y el estado solo cambia con /deactivate.
      if (current) {
        this.form.controls.patient_id.disable();
        this.form.controls.status.disable();
      } else {
        this.form.controls.patient_id.enable();
        this.form.controls.status.enable();
      }
    });

    // Al elegir paciente se sugiere el nombre `HC-<documento>`. Se suscribe a los
    // cambios del control (no a un effect) para no reiniciar el formulario cada
    // vez que cambie la lista de pacientes.
    this.form.controls.patient_id.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((patientId) => this.suggestName(patientId));
  }

  /** Sugiere el nombre sin pisar lo que el usuario escribió. */
  private suggestName(patientId: number | null): void {
    if (patientId === null || this.record()) {
      return;
    }

    const control = this.form.controls.name;
    const typed = control.value.trim();
    if (typed && typed !== this.lastSuggestion) {
      return;
    }

    const patient = this.patients().find((candidate) => candidate.id === patientId);
    if (!patient) {
      return;
    }

    this.lastSuggestion = `HC-${patient.document_number}`;
    control.setValue(this.lastSuggestion);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const name = value.name.trim();
    const description = value.description.trim() || null;

    // Edición: solo `name` y `description`. `patient_id` no cambia y `status` lo
    // gobierna /deactivate.
    if (this.record()) {
      this.updated.emit({ name, description });
      return;
    }

    if (value.patient_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.created.emit({
      name,
      description,
      patient_id: value.patient_id,
      status: value.status,
    });
  }
}
