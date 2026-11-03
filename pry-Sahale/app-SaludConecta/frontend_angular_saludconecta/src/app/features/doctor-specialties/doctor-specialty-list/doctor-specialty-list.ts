import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Doctor } from '../../../core/models/doctor.model';
import {
  DoctorSpecialty,
  DoctorSpecialtyPayload,
} from '../../../core/models/doctor-specialty.model';
import { Specialty } from '../../../core/models/specialty.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { DoctorApi } from '../../doctors/doctor-api';
import { SpecialtyApi } from '../../specialties/specialty-api';
import { DoctorSpecialtyForm } from '../doctor-specialty-form/doctor-specialty-form';
import { DoctorSpecialtyApi } from '../doctor-specialty-api';

/**
 * Asignaciones médico ↔ especialidad (pivote N:M).
 *
 * El pivote solo guarda dos ids; para mostrar nombres la pantalla carga en
 * paralelo las asignaciones, los médicos y las especialidades, y resuelve cada
 * id con un `Map` construido una sola vez en un `computed`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-doctor-specialty-list',
  imports: [
    ButtonModule,
    DialogModule,
    DoctorSpecialtyForm,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './doctor-specialty-list.html',
  styleUrl: './doctor-specialty-list.css',
})
export class DoctorSpecialtyList {
  private readonly api = inject(DoctorSpecialtyApi);
  private readonly doctorApi = inject(DoctorApi);
  private readonly specialtyApi = inject(SpecialtyApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Asignaciones activas (`GET /api/doctor-specialties` solo devuelve `active`). */
  readonly rows = signal<DoctorSpecialty[]>([]);
  /** Catálogos activos: alimentan los selects y resuelven los nombres. */
  readonly doctors = signal<Doctor[]>([]);
  readonly specialties = signal<Specialty[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /**
   * `computed` que devuelve una función: el `Map` se reconstruye solo cuando
   * cambian los médicos, y la función resuelve cada fila en O(1).
   */
  readonly doctorName = computed(() => {
    const names = new Map(this.doctors().map((doctor) => [doctor.id, doctor.name]));
    return (id: number) => names.get(id) ?? `Médico #${id}`;
  });

  readonly specialtyName = computed(() => {
    const names = new Map(this.specialties().map((specialty) => [specialty.id, specialty.name]));
    return (id: number) => names.get(id) ?? `Especialidad #${id}`;
  });

  /** Se busca por los nombres que ve el usuario, no por los ids. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      this.doctorName()(row.doctor_id),
      this.specialtyName()(row.specialty_id),
    ]),
  );

  readonly dialogVisible = signal(false);
  readonly resetKey = signal(0);

  constructor() {
    this.load();
  }

  /** Tres `GET` en paralelo: la tabla se pinta una sola vez, con nombres. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      links: this.api.list(),
      doctors: this.doctorApi.list(),
      specialties: this.specialtyApi.list(),
    }).subscribe({
      next: ({ links, doctors, specialties }) => {
        this.rows.set(links);
        this.doctors.set(doctors);
        this.specialties.set(specialties);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.doctors.set([]);
        this.specialties.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * `POST /api/doctor-specialties`. Si el par ya existe el backend responde
   * `400 Doctor already has this specialty (id N)`: el diálogo queda abierto y
   * el mensaje se muestra tal cual en un toast.
   */
  save(payload: DoctorSpecialtyPayload): void {
    this.saving.set(true);

    this.api.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Especialidad asignada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. La asignación deja de listarse. */
  deactivate(row: DoctorSpecialty): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message:
        `¿Quitar «${this.specialtyName()(row.specialty_id)}» a ` +
        `«${this.doctorName()(row.doctor_id)}»? La asignación pasará a inactiva y dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Asignación desactivada');
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
  remove(row: DoctorSpecialty): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message:
        `Se borrará la asignación «${this.doctorName()(row.doctor_id)} · ` +
        `${this.specialtyName()(row.specialty_id)}» de la base de datos. ` +
        'Esta acción no se puede deshacer.',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Asignación eliminada');
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
