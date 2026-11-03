import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import {
  ClinicalRecord,
  ClinicalRecordPayload,
  ClinicalRecordUpdatePayload,
} from '../../../core/models/clinical-record.model';
import { Patient } from '../../../core/models/patient.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { PatientApi } from '../../patients/patient-api';
import { ClinicalRecordApi } from '../clinical-record-api';
import { ClinicalRecordForm } from '../clinical-record-form/clinical-record-form';

/**
 * Lista de historias clínicas con todas las operaciones del CRUD.
 *
 * Primera pantalla con una relación (`ClinicalRecord → Patient`, 1:1): carga las
 * historias y los pacientes en paralelo, resuelve el nombre con un `Map` y ofrece
 * al formulario de alta solo los pacientes que todavía no tienen historia.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-clinical-record-list',
  imports: [
    ButtonModule,
    ClinicalRecordForm,
    DialogModule,
    EmptyState,
    FormsModule,
    InputTextModule,
    MessageModule,
    PageHeader,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './clinical-record-list.html',
  styleUrl: './clinical-record-list.css',
})
export class ClinicalRecordList {
  private readonly api = inject(ClinicalRecordApi);
  private readonly patientsApi = inject(PatientApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Historias activas (`GET /api/clinical-records` solo devuelve `active`). */
  readonly rows = signal<ClinicalRecord[]>([]);

  /** Pacientes activos: para resolver nombres y para el select de alta. */
  readonly patients = signal<Patient[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  // ───── Relación con pacientes ─────────────────────────────────────────────

  /** Mapa `id → paciente`, construido una sola vez por cambio de la lista. */
  private readonly patientById = computed(
    () => new Map(this.patients().map((patient) => [patient.id, patient])),
  );

  /**
   * `patientName()` devuelve una función. Es intencional: el `Map` se reconstruye
   * solo cuando cambian los pacientes y la función resuelve cada fila.
   */
  readonly patientName = computed(() => {
    const byId = this.patientById();
    return (id: number) => byId.get(id)?.name ?? `Paciente #${id}`;
  });

  readonly patientDocument = computed(() => {
    const byId = this.patientById();
    return (id: number) => byId.get(id)?.document_number ?? '';
  });

  /** Ids de pacientes que ya tienen una historia activa. */
  private readonly patientsWithRecord = computed(
    () => new Set(this.rows().map((record) => record.patient_id)),
  );

  /**
   * Pacientes sin historia: lo que se ofrece al crear. Es una ayuda de la UI; la
   * regla 1:1 la sigue validando el backend (una historia dada de baja también
   * bloquea al paciente y aquí no se ve).
   */
  readonly availablePatients = computed(() =>
    this.patients().filter((patient) => !this.patientsWithRecord().has(patient.id)),
  );

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (record) => [
      record.name,
      record.description,
      this.patientName()(record.patient_id),
      this.patientDocument()(record.patient_id),
    ]),
  );

  // ───── Diálogo ────────────────────────────────────────────────────────────

  readonly dialogVisible = signal(false);
  readonly editing = signal<ClinicalRecord | null>(null);
  readonly presetPatientId = signal<number | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() =>
    this.editing() ? 'Editar historia clínica' : 'Nueva historia clínica',
  );

  /** Al crear: solo pacientes sin historia. Al editar: todos (no se elige). */
  readonly formPatients = computed(() =>
    this.editing() ? this.patients() : this.availablePatients(),
  );

  readonly editingPatientLabel = computed(() => {
    const current = this.editing();
    return current ? this.patientName()(current.patient_id) : '';
  });

  // ───── Búsqueda por paciente (ruta extra del backend) ─────────────────────

  readonly lookupPatientId = signal<number | null>(null);
  readonly lookingUp = signal(false);

  readonly lookupOptions = computed(() =>
    this.patients().map((patient) => ({
      id: patient.id,
      label: `${patient.name} · ${patient.document_number}`,
    })),
  );

  constructor() {
    this.load();
  }

  /** Carga historias y pacientes en paralelo y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      records: this.api.list(),
      patients: this.patientsApi.list(),
    }).subscribe({
      next: ({ records, patients }) => {
        this.rows.set(records);
        this.patients.set(patients);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.patients.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(patientId: number | null = null): void {
    this.editing.set(null);
    this.presetPatientId.set(patientId);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(record: ClinicalRecord): void {
    this.editing.set(record);
    this.presetPatientId.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * `GET /api/clinical-records/patient/:id`. Un `404` no es un fallo: significa
   * que el paciente todavía no tiene historia, y se ofrece crearla.
   */
  lookup(): void {
    const patientId = this.lookupPatientId();
    if (patientId === null) {
      return;
    }

    this.lookingUp.set(true);
    this.api.getByPatient(patientId).subscribe({
      next: (record) => {
        this.lookingUp.set(false);
        this.openEdit(record);
      },
      error: (error: unknown) => {
        this.lookingUp.set(false);
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.notify.info(
            'Sin historia clínica',
            'Este paciente todavía no tiene historia clínica. Puedes crearla ahora.',
          );
          this.openCreate(patientId);
          return;
        }
        this.notify.error('No se pudo buscar la historia', toApiMessage(error));
      },
    });
  }

  /** `POST /api/clinical-records`. Si falla, el diálogo sigue abierto. */
  create(payload: ClinicalRecordPayload): void {
    this.saving.set(true);

    this.api.create(payload).subscribe({
      next: () => this.finishSave('Historia clínica creada'),
      error: (error: unknown) => this.failSave(error),
    });
  }

  /** `PATCH /api/clinical-records/:id` con `name` y `description` solamente. */
  update(payload: ClinicalRecordUpdatePayload): void {
    const current = this.editing();
    if (!current) {
      return;
    }
    this.saving.set(true);

    this.api.update(current.id, payload).subscribe({
      next: () => this.finishSave('Historia clínica actualizada'),
      error: (error: unknown) => this.failSave(error),
    });
  }

  private finishSave(message: string): void {
    this.saving.set(false);
    this.dialogVisible.set(false);
    this.notify.success(message);
    this.load();
  }

  private failSave(error: unknown): void {
    this.saving.set(false);
    this.notify.error('No se pudo guardar', toApiMessage(error));
  }

  /** Baja lógica: `PATCH /:id/deactivate`. La historia deja de listarse. */
  deactivate(record: ClinicalRecord): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message:
        `¿Desactivar la historia «${record.name}»? Dejará de listarse, pero el backend seguirá ` +
        'considerando que el paciente ya tiene una historia (no se podrá crear otra) y no se ' +
        'podrán registrar atenciones con ella.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(record.id).subscribe({
          next: () => {
            this.notify.warn('Historia clínica desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(record: ClinicalRecord): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará la historia «${record.name}» de la base de datos. Esta acción no se puede ` +
        'deshacer. Si tiene atenciones asociadas, el borrado fallará: usa la baja lógica.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(record.id).subscribe({
          next: () => {
            this.notify.success('Historia clínica eliminada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
