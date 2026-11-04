import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { SessionStore } from '../../core/services/session-store';

/**
 * Directiva estructural: pinta el contenido solo si la sesión tiene el permiso.
 *
 *   <ng-container *appHasPermission="'POST /api/patients'">
 *     <button pButton label="Nuevo paciente"></button>
 *   </ng-container>
 *
 * Reacciona al cambio de `permissions()` mediante `effect`, así que tras
 * "Actualizar permisos" los botones se ajustan sin recargar. Con
 * `authEnabled=false` pinta siempre: en modo laboratorio no hay permisos.
 */
@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly session = inject(SessionStore);

  /** Permiso en el formato `'METHOD /api/path'`. */
  readonly appHasPermission = input.required<string>();

  private visible = false;

  constructor() {
    effect(() => {
      const allowed = this.session.canPermission(this.appHasPermission());
      if (allowed === this.visible) {
        return;
      }
      this.visible = allowed;

      if (allowed) {
        this.vcr.createEmbeddedView(this.tpl);
      } else {
        this.vcr.clear();
      }
    });
  }
}
