import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Agenda, AgendaPayload } from '../../../core/models/agenda.model';
import { Doctor } from '../../../core/models/doctor.model';

/** Opción del select de médicos. */
interface DoctorOption {
  id: number;
  name: string;
}

/**
 * Formulario de agenda, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `agenda` (o `null` para crear) y los **médicos
 * activos** que ofrece el select, y emite el payload con `saved`. El padre
 * decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-agenda-form',
  imports: [
    MessageModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './agenda-form.html',
  styleUrl: './agenda-form.css',
})
export class AgendaForm {
  /** Agenda a editar. `null` deja el formulario en modo creación. */
  readonly agenda = input<Agenda | null>(null);

  /** Médicos activos que ofrece el select. */
  readonly doctors = input<Doctor[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nueva agenda». */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<AgendaPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /**
   * Médicos activos y, al editar, el médico actual de la agenda aunque ya esté
   * inactivo: sin esa opción el select quedaría en blanco y parecería que la
   * agenda no tiene médico.
   */
  readonly doctorOptions = computed<DoctorOption[]>(() => {
    const options: DoctorOption[] = this.doctors().map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
    }));
    const current = this.agenda();

    if (current && !options.some((option) => option.id === current.doctor_id)) {
      options.push({ id: current.doctor_id, name: `Médico #${current.doctor_id} (inactivo)` });
    }
    return options;
  });

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    doctor_id: [null as number | null, [Validators.required]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.agenda();
      // Reabrir el diálogo debe vaciar el formulario aunque `agenda` siga en null.
      this.resetKey();

      this.form.reset({
        name: current?.name ?? '',
        description: current?.description ?? '',
        doctor_id: current?.doctor_id ?? null,
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
    const value = this.form.getRawValue();

    if (this.form.invalid || value.doctor_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: AgendaPayload = {
      name: value.name.trim(),
      description: value.description.trim() || null,
      doctor_id: value.doctor_id,
    };

    // `status` solo se envía al crear.
    this.saved.emit(this.agenda() ? payload : { ...payload, status: value.status });
  }
}
