import { faker } from "@faker-js/faker";
import { Invoice } from "./invoice.model";
import { Encounter } from "../encounter/encounter.model";

/**
 * Seeder del feature Invoice (facturas).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Agrupa atenciones facturables (activas, "completed", sin factura) por paciente
 * (misma historia clínica): una factura por grupo, hasta `count`.
 * Idempotente: si ya hay facturas, no inserta.
 */
export async function seedInvoices(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  invoices: count=0, se omite");
    return 0;
  }

  const existing = await Invoice.count();
  if (existing > 0) {
    console.log(`⏭️  invoices: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const billable = await Encounter.findAll({
    where: { status: "active", state: "completed", invoice_id: null },
  });
  if (billable.length === 0) {
    console.log("⏭️  invoices: no hay atenciones facturables, se omite seeder");
    return 0;
  }

  const groups = new Map<number, Encounter[]>();
  for (const encounter of billable) {
    const list = groups.get(encounter.clinical_record_id) ?? [];
    list.push(encounter);
    groups.set(encounter.clinical_record_id, list);
  }

  const selected = faker.helpers.shuffle(Array.from(groups.values())).slice(0, count);

  let inserted = 0;
  for (const encounters of selected) {
    const subtotal = encounters.reduce((acc, e) => acc + Number(e.total), 0);
    const tax = faker.number.int({ min: 0, max: 5 }) * 1000;
    const invoice = await Invoice.create({
      number: `FV-${String(inserted + 1).padStart(6, "0")}`,
      invoice_date: faker.date.recent({ days: 15 }),
      subtotal,
      tax,
      total: subtotal + tax,
      state: "issued",
      status: "active",
    });
    await Encounter.update(
      { invoice_id: invoice.id },
      { where: { id: encounters.map((e) => e.id) } }
    );
    inserted++;
  }

  console.log(`✅ invoices: insertados ${inserted} registro(s) falsos`);
  return inserted;
}
