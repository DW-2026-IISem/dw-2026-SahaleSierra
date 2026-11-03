import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

/** Texto y color de cada estado de negocio que maneja el backend. */
const STATES: Record<string, { label: string; severity: Severity }> = {
  // appointments.state
  scheduled: { label: 'Programada', severity: 'info' },
  attended: { label: 'Atendida', severity: 'success' },
  cancelled: { label: 'Cancelada', severity: 'danger' },
  // encounters.state (ISS-12)
  in_progress: { label: 'En curso', severity: 'warn' },
  completed: { label: 'Completada', severity: 'success' },
  // invoices.state (ISS-13)
  issued: { label: 'Emitida', severity: 'info' },
  paid: { label: 'Pagada', severity: 'success' },
};

/**
 * Muestra el `state` de negocio (ciclo de vida). `StatusTag` muestra `status`
 * (baja lógica); son columnas distintas y no se confunden.
 */
@Component({
  host: { class: 'inline-block' },
  selector: 'app-state-tag',
  imports: [TagModule],
  templateUrl: './state-tag.html',
  styleUrl: './state-tag.css',
})
export class StateTag {
  readonly state = input.required<string>();

  readonly label = computed(() => STATES[this.state()]?.label ?? this.state());
  readonly severity = computed<Severity>(() => STATES[this.state()]?.severity ?? 'secondary');
}
