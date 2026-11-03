import { Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status, toNumber } from '../../../core/models/api.model';
import {
  Encounter,
  EncounterPayload,
  EncounterState,
  EncounterUpdatePayload,
} from '../../../core/models/encounter.model';
import { Service } from '../../../core/models/service.model';
import { toIsoUtc, toLocalInput } from '../../../core/utils/datetime';

/** Una cita ofrecida en el select. `hasRecord`: su paciente tiene historia clínica activa. */
export interface EncounterAppointmentOption {
  id: number;
  label: string;
  hasRecord: boolean;
}

/** Si hay inicio y fin, el fin debe ser posterior. `YYYY-MM-DDTHH:mm` se compara como texto. */
function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('start_date')?.value as string | undefined;
  const end = group.get('end_date')?.value as string | undefined;
  return start && end && end <= start ? { range: true } : null;
}

/**
 * Formulario de atención, reutilizado para «Atender cita» y para editar.
 *
 * No llama a la API. Recibe `encounter` (o `null` para atender una cita) y los
 * catálogos que necesita, y emite `created`, `updated` o `unchanged`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-encounter-form',
  imports: [
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './encounter-form.html',
  styleUrl: './encounter-form.css',
})
export class EncounterForm {
  /** Atención a editar. `null` deja el formulario en modo «Atender cita». */
  readonly encounter = input<Encounter | null>(null);

  /** Citas `scheduled` que se pueden atender. */
  readonly appointmentOptions = input<EncounterAppointmentOption[]>([]);

  /** Servicios activos para el select. */
  readonly services = input<Service[]>([]);

  /** Texto de la cita de la atención en edición (solo lectura). */
  readonly appointmentLabel = input('');

  /** Llave para reiniciar el formulario al reabrir el diálogo. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly created = output<EncounterPayload>();
  readonly updated = output<EncounterUpdatePayload>();
  /** Se editó sin cambiar nada: el padre no envía ninguna petición. */
  readonly unchanged = output<void>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly serviceOptions = computed(() =>
    this.services().map((service) => ({ id: service.id, label: service.name })),
  );

  /** Al crear solo se ofrecen los dos estados válidos; al editar, los tres. */
  readonly stateOptions = computed(() => {
    const base = [
      { label: 'En curso', value: 'in_progress' as EncounterState },
      { label: 'Completada', value: 'completed' as EncounterState },
    ];
    return this.encounter()
      ? [...base, { label: 'Cancelada', value: 'cancelled' as EncounterState }]
      : base;
  });

  readonly statusOptions = [
    { label: 'Activa', value: 'active' },
    { label: 'Inactiva', value: 'inactive' },
  ];

  readonly form = this.fb.group(
    {
      appointment_id: [null as number | null, [Validators.required]],
      service_id: [null as number | null, [Validators.required]],
      state: ['completed' as EncounterState, [Validators.required]],
      total: [null as number | null, [Validators.min(0)]],
      start_date: [''],
      end_date: [''],
      observations: [''],
      status: ['active' as Status, [Validators.required]],
    },
    { validators: [endAfterStart] },
  );

  /** La atención ya tiene factura: su total no se puede cambiar. */
  readonly billed = computed(() => (this.encounter()?.invoice_id ?? null) !== null);

  private readonly selectedAppointment = toSignal(
    this.form.controls.appointment_id.valueChanges,
    { initialValue: null as number | null },
  );

  /**
   * `true` si la cita elegida es de un paciente sin historia clínica activa. Es un
   * aviso: el backend rechazaría la atención con `Patient must have an active
   * clinical record`.
   */
  readonly missingRecord = computed(() => {
    if (this.encounter()) {
      return false;
    }
    const option = this.appointmentOptions().find(
      (candidate) => candidate.id === this.selectedAppointment(),
    );
    return !!option && !option.hasRecord;
  });

  constructor() {
    effect(() => {
      const current = this.encounter();
      // Reabrir el diálogo debe vaciar el formulario aunque `encounter` siga en null.
      this.resetKey();

      this.form.reset({
        appointment_id: current?.appointment_id ?? null,
        service_id: current?.service_id ?? null,
        state: current?.state ?? 'completed',
        total: current ? toNumber(current.total) : null,
        start_date: toLocalInput(current?.start_date),
        end_date: toLocalInput(current?.end_date),
        observations: current?.observations ?? '',
        status: current?.status ?? 'active',
      });

      // La cita de una atención no cambia y el estado de baja solo cambia con /deactivate.
      if (current) {
        this.form.controls.appointment_id.disable();
        this.form.controls.status.disable();
      } else {
        this.form.controls.appointment_id.enable();
        this.form.controls.status.enable();
      }

      // Atención facturada: el backend no permite cambiar su total.
      if (current && current.invoice_id !== null) {
        this.form.controls.total.disable();
      } else {
        this.form.controls.total.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const observations = value.observations.trim();
    const original = this.encounter();

    if (original) {
      const changes: EncounterUpdatePayload = {};
      if (value.service_id !== null && value.service_id !== original.service_id) {
        changes.service_id = value.service_id;
      }
      // Se compara con el texto local (a minutos) para no inventar cambios por segundos.
      if (value.start_date && value.start_date !== toLocalInput(original.start_date)) {
        changes.start_date = toIsoUtc(value.start_date);
      }
      if (value.end_date !== toLocalInput(original.end_date)) {
        changes.end_date = value.end_date ? toIsoUtc(value.end_date) : null;
      }
      if (!this.billed() && value.total !== null && value.total !== toNumber(original.total)) {
        changes.total = value.total;
      }
      if (value.state !== original.state) {
        changes.state = value.state;
      }
      if (observations !== (original.observations ?? '')) {
        changes.observations = observations || null;
      }

      if (Object.keys(changes).length === 0) {
        this.unchanged.emit();
        return;
      }
      this.updated.emit(changes);
      return;
    }

    if (value.appointment_id === null || value.service_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    // Al crear solo viajan los campos llenados; el estado nunca es `cancelled`.
    const payload: EncounterPayload = {
      appointment_id: value.appointment_id,
      service_id: value.service_id,
      state: value.state === 'in_progress' ? 'in_progress' : 'completed',
      status: value.status,
    };
    if (value.start_date) {
      payload.start_date = toIsoUtc(value.start_date);
    }
    if (value.end_date) {
      payload.end_date = toIsoUtc(value.end_date);
    }
    if (value.total !== null) {
      payload.total = value.total;
    }
    if (observations) {
      payload.observations = observations;
    }
    this.created.emit(payload);
  }
}
