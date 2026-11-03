import { HttpErrorResponse } from '@angular/common/http';

const UNIQUE_MESSAGE =
  'Ya existe un registro con esos datos únicos (por ejemplo, el mismo número de documento).';
const FOREIGN_KEY_MESSAGE =
  'No se puede completar la operación: el registro tiene datos relacionados (historia clínica, citas…). Usa la baja lógica.';

/**
 * Traduce el error HTTP del backend a un texto para el usuario.
 * Express responde `{ error, detail? }` (en inglés); los 403 de RBAC son opacos
 * a propósito. Los mensajes se muestran tal cual, salvo los dos errores de base
 * de datos más comunes (duplicado y clave foránea), que se traducen aquí y
 * nunca dispersos por los componentes.
 */
export function toApiMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: string; detail?: string } | string | null;

    if (error.status === 0) {
      return 'No se pudo conectar con el backend. Verifica que esté en http://localhost:4000.';
    }
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object' && body.error) {
      
            // Una historia clínica por paciente: el 400 trae el id y el estado de la existente.
      const existing = /Patient already has a clinical record \(id (\d+), status (\w+)\)/.exec(
        body.error,
      );
      if (existing) {
        return `Este paciente ya tiene una historia clínica (id ${existing[1]}, estado ${existing[2]}).`;
      }

      const detail = body.detail ?? '';
      if (detail.includes('UniqueConstraint')) {
        return UNIQUE_MESSAGE;
      }
      if (detail.includes('ForeignKeyConstraint')) {
        return FOREIGN_KEY_MESSAGE;
      }
      return detail ? `${body.error} — ${detail}` : body.error;
    }
    return error.message;
  }
  return error instanceof Error ? error.message : 'Error inesperado';
}
