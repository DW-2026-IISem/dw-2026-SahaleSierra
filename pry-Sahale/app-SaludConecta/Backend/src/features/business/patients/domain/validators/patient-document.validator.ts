export function isValidDocumentNumber(documentNumber: string): boolean {
  return /^[A-Za-z0-9]{5,15}$/.test(documentNumber.trim());
}
