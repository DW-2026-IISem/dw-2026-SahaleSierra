const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * UTC (`2026-11-10T14:00:00.000Z`) → texto local para `<input type="datetime-local">`
 * (`2026-11-10T09:00`). Un valor vacío o inválido devuelve `''`.
 */
export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/**
 * Texto local de `<input type="datetime-local">` → UTC en ISO. Sin zona, `new Date`
 * interpreta el texto en la hora del navegador. Un valor vacío o inválido devuelve `''`.
 */
export function toIsoUtc(local: string | null | undefined): string {
  if (!local) {
    return '';
  }
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

/**
 * UTC → `dd/MM/yyyy HH:mm` en hora local, para textos y etiquetas de selects
 * (no para `<input type="datetime-local">`; para eso está `toLocalInput`).
 * Un valor vacío o inválido devuelve `''`.
 */
export function formatLocal(iso: string | null | undefined): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return (
    `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}
