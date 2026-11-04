import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Invoice, InvoiceState } from '../../../core/models/invoice.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StateTag } from '../../../shared/ui/state-tag/state-tag';
import { InvoiceApi } from '../invoice-api';

/**
 * Lista de facturas. Crear una factura es otra pantalla (`/invoices/new`):
 * armar el borrador necesita más espacio que un diálogo.
 *
 * Dos conceptos distintos, como en las citas: el **estado de negocio**
 * (`state`: emitida, pagada, anulada) se cambia con `PATCH` y la factura sigue
 * listada; la **baja lógica** (`status`) la saca del listado.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-invoice-list',
  imports: [
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    RouterLink,
    StateTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
})
export class InvoiceList {
  private readonly api = inject(InvoiceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Facturas activas (`GET /api/invoices` solo devuelve `status = active`). */
  readonly rows = signal<Invoice[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [row.number, row.state]),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (invoices) => {
        this.rows.set(invoices);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  /** Solo una factura emitida se puede marcar como pagada. */
  canPay(invoice: Invoice): boolean {
    return invoice.state === 'issued';
  }

  /** Una factura ya anulada no se puede anular otra vez. */
  canCancel(invoice: Invoice): boolean {
    return invoice.state !== 'cancelled';
  }

  markPaid(invoice: Invoice): void {
    this.changeState(invoice, 'paid', 'Factura marcada como pagada');
  }

  /** Anular cambia el `state`; no es la baja lógica. */
  cancel(invoice: Invoice): void {
    this.confirmation.confirm({
      header: 'Anular factura',
      message: `¿Anular la factura «${invoice.number}»? Seguirá en el listado como «Cancelada» y dejará de contar como ingreso.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Anular',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => this.changeState(invoice, 'cancelled', 'Factura anulada'),
    });
  }

  private changeState(invoice: Invoice, state: InvoiceState, message: string): void {
    this.api.update(invoice.id, { state }).subscribe({
      next: () => {
        this.notify.success(message);
        this.load();
      },
      error: (error: unknown) => {
        this.notify.error('No se pudo cambiar el estado', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. La factura deja de listarse. */
  deactivate(invoice: Invoice): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la factura «${invoice.number}»? Su estado pasará a inactivo y dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(invoice.id).subscribe({
          next: () => {
            this.notify.warn('Factura desactivada');
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
  remove(invoice: Invoice): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la factura «${invoice.number}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(invoice.id).subscribe({
          next: () => {
            this.notify.success('Factura eliminada');
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
