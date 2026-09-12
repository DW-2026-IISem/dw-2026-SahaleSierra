import { InvoiceModel } from '../models/invoice.model.js';

export async function seedInvoices(): Promise<void> {
  const count = await InvoiceModel.count();
  if (count > 0) return;

  await InvoiceModel.create({
    number: 'FAC-0001',
    date: new Date().toISOString().slice(0, 10),
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'PENDIENTE',
  });
}
