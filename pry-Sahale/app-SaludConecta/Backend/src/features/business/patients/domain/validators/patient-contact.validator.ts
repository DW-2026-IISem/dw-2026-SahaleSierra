export function isValidContact(contact: string): boolean {
  const phone = /^\+?[0-9\s-]{7,20}$/;
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return phone.test(contact.trim()) || email.test(contact.trim());
}
