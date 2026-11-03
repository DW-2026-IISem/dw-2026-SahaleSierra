import { Component, computed, effect, inject, input, output } from '@angular/core';
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
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Agenda } from '../../../core/models/agenda.model';
import {
  Appointment,
  AppointmentPayload,
  AppointmentUpdatePayload,
} from '../../../core/models/appointment.model';
import { Doctor } from '../../../core/models/doctor.model';
import { Patient } from '../../../core/models/patient.model';
import { toIsoUtc, toLocalInput } from '../../../core/utils/datetime';

/** El fin debe ser posterior al inicio. `YYYY-MM-DDTHH:mm` se compara como texto. */
function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('start_date')?.value as string | undefined;
  const end = group.get('end_date')?.value as string | undefined;
  return start && end && end <= start ? { range: true } : null;
}

/**
 * Formulario de cita, reutilizado para programar y editar.
 *
 * No llama a la API. Recibe `appointment` (o `null` para programar) y los
 * catálogos que necesita para los selects, y emite `created`, `updated` o
 * `unchanged`. El padre decide el verbo HTTP y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-appointment-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm {
  /** Cita a editar. `null` deja el formulario en modo creación. */
  readonly appointment = input<Appointment | null>(null);

  /** Catálogos para los selects (solo activos, como los devuelve el backend). */
  readonly agendas = input<Agenda[]>([]);
  readonly doctors = input<Doctor[]>([]);
  readonly patients = input<Patient[]>([]);

  /** Llave para reiniciar el formulario al reabrir el diálogo. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly created = output<AppointmentPayload>();
  readonly updated = output<AppointmentUpdatePayload>();
  /** Se editó sin cambiar nada: el padre no envía ninguna petición. */
  readonly unchanged = output<void>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activa', value: 'active' },
    { label: 'Inactiva', value: 'inactive' },
  ];

  /** Agenda + su médico, para que la recepcionista sepa con quién agenda. */
  readonly agendaOptions = computed(() => {
    const doctorById = new Map(this.doctors().map((doctor) => [doctor.id, doctor.name]));
    return this.agendas().map((agenda) => ({
      id: agenda.id,
      label: `${agenda.name} · ${doctorById.get(agenda.doctor_id) ?? `Médico #${agenda.doctor_id}`}`,
    }));
  });

  readonly patientOptions = computed(() =>
    this.patients().map((patient) => ({
      id: patient.id,
      label: `${patient.name} · ${patient.document_number}`,
    })),
  );

  readonly form = this.fb.group(
    {
      agenda_id: [null as number | null, [Validators.required]],
      patient_id: [null as number | null, [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      reason: [''],
      status: ['active' as Status, [Validators.required]],
    },
    { validators: [endAfterStart] },
  );

  constructor() {
    effect(() => {
      const current = this.appointment();
      // Reabrir el diálogo debe vaciar el formulario aunque `appointment` siga en null.
      this.resetKey();

      this.form.reset({
        agenda_id: current?.agenda_id ?? null,
        patient_id: current?.patient_id ?? null,
        start_date: toLocalInput(current?.start_date),
        end_date: toLocalInput(current?.end_date),
        reason: current?.reason ?? '',
        status: current?.status ?? 'active',
      });

      // El estado de baja solo cambia con PATCH /deactivate.
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
    const original = this.appointment();
    const reason = value.reason.trim();

    if (original) {
      const changes: AppointmentUpdatePayload = {};
      if (value.agenda_id !== null && value.agenda_id !== original.agenda_id) {
        changes.agenda_id = value.agenda_id;
      }
      if (value.patient_id !== null && value.patient_id !== original.patient_id) {
        changes.patient_id = value.patient_id;
      }
      // Se compara con el texto local (a minutos) para no inventar cambios por segundos.
      if (value.start_date !== toLocalInput(original.start_date)) {
        changes.start_date = toIsoUtc(value.start_date);
      }
      if (value.end_date !== toLocalInput(original.end_date)) {
        changes.end_date = toIsoUtc(value.end_date);
      }
      if (reason !== (original.reason ?? '')) {
        changes.reason = reason || null;
      }

      if (Object.keys(changes).length === 0) {
        this.unchanged.emit();
        return;
      }
      this.updated.emit(changes);
      return;
    }

    if (value.agenda_id === null || value.patient_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    // La cita nace `scheduled`: no se envía `state`.
    this.created.emit({
      agenda_id: value.agenda_id,
      patient_id: value.patient_id,
      start_date: toIsoUtc(value.start_date),
      end_date: toIsoUtc(value.end_date),
      reason: reason || null,
      status: value.status,
    });
  }
}
