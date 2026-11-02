import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Patient, PatientPayload } from '../../../core/models/patient.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { PatientApi } from '../patient-api';
import { PatientForm } from '../patient-form/patient-form';

/**
 * Lista de pacientes con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-patient-list',
  imports: [
    ButtonModule,
    DatePipe,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    PatientForm,
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css',
})
export class PatientList {
  private readonly api = inject(PatientApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/patients` solo devuelve `active`). */
  readonly rows = signal<Patient[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (patient) => [
      patient.name,
      patient.document_number,
      patient.document_type,
      patient.contact,
    ]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Patient | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar paciente' : 'Nuevo paciente'));

  constructor() {
    this.load();
  }

  /** `GET /api/patients`: recarga la tabla y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(patient: Patient): void {
    this.editing.set(patient);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   * Si falla, el diálogo sigue abierto para corregir.
   */
  save(payload: PatientPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Paciente actualizado' : 'Paciente creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. El paciente deja de listarse. */
  deactivate(patient: Patient): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar a ${patient.name}? Su estado pasará a inactivo y dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(patient.id).subscribe({
          next: () => {
            this.notify.warn('Paciente desactivado');
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
  remove(patient: Patient): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará a ${patient.name} de la base de datos. Esta acción no se puede deshacer. ` +
        'Si tiene historia clínica o citas, el borrado fallará: usa la baja lógica.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(patient.id).subscribe({
          next: () => {
            this.notify.success('Paciente eliminado');
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
