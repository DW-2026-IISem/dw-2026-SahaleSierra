import { TestBed } from '@angular/core/testing';
import {
  Encounter,
  EncounterPayload,
  EncounterUpdatePayload,
} from '../../../core/models/encounter.model';
import { Service } from '../../../core/models/service.model';
import { toIsoUtc, toLocalInput } from '../../../core/utils/datetime';
import { EncounterAppointmentOption, EncounterForm } from './encounter-form';

const SERVICES: Service[] = [
  { id: 1, name: 'Consulta de medicina general', description: null, status: 'active' },
  { id: 2, name: 'Electrocardiograma', description: null, status: 'active' },
];

const OPTIONS: EncounterAppointmentOption[] = [
  { id: 1, label: 'Laura Gómez · 10/11/2026 09:00', hasRecord: true },
  { id: 2, label: 'Carlos Ruiz · 11/11/2026 10:00', hasRecord: false },
];

const ENCOUNTER: Encounter = {
  id: 1,
  appointment_id: 1,
  clinical_record_id: 1,
  service_id: 1,
  start_date: '2026-11-10T14:00:00.000Z',
  end_date: '2026-11-10T14:30:00.000Z',
  total: '85000.00',
  state: 'completed',
  observations: 'Sin novedades',
  invoice_id: null,
  status: 'active',
};

describe('EncounterForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EncounterForm] }).compileComponents();
  });

  async function render(encounter: Encounter | null = null) {
    const fixture = TestBed.createComponent(EncounterForm);
    fixture.componentRef.setInput('appointmentOptions', OPTIONS);
    fixture.componentRef.setInput('services', SERVICES);
    fixture.componentRef.setInput('encounter', encounter);
    fixture.componentRef.setInput('appointmentLabel', encounter ? 'Laura Gómez · 10/11/2026 09:00' : '');
    await fixture.whenStable();

    const created: EncounterPayload[] = [];
    const updated: EncounterUpdatePayload[] = [];
    let unchanged = 0;
    fixture.componentInstance.created.subscribe((payload) => created.push(payload));
    fixture.componentInstance.updated.subscribe((payload) => updated.push(payload));
    fixture.componentInstance.unchanged.subscribe(() => unchanged++);

    return {
      fixture,
      component: fixture.componentInstance,
      created,
      updated,
      unchangedCount: () => unchanged,
    };
  }

  it('should start empty in create mode with the completed state and the selects enabled', async () => {
    const { component } = await render();

    expect(component.form.getRawValue().appointment_id).toBeNull();
    expect(component.form.getRawValue().state).toBe('completed');
    expect(component.form.controls.appointment_id.enabled).toBe(true);
    expect(component.form.controls.status.enabled).toBe(true);
    expect(component.stateOptions().map((option) => option.value)).toEqual([
      'in_progress',
      'completed',
    ]);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { component, created } = await render();

    component.submit();

    expect(created.length).toBe(0);
    expect(component.form.controls.appointment_id.touched).toBe(true);
    expect(component.form.controls.service_id.touched).toBe(true);
  });

  it('should not emit when the end is not after the start', async () => {
    const { component, created } = await render();
    component.form.patchValue({
      appointment_id: 1,
      service_id: 1,
      start_date: '2026-11-10T09:00',
      end_date: '2026-11-10T09:00',
    });

    component.submit();

    expect(component.form.hasError('range')).toBe(true);
    expect(created.length).toBe(0);
  });

  it('should emit the minimal created payload without the optional fields', async () => {
    const { component, created } = await render();
    component.form.patchValue({ appointment_id: 1, service_id: 2, total: 85000 });

    component.submit();

    expect(created).toEqual([
      { appointment_id: 1, service_id: 2, total: 85000, state: 'completed', status: 'active' },
    ]);
  });

  it('should emit UTC dates and trimmed observations when they are filled', async () => {
    const { component, created } = await render();
    component.form.patchValue({
      appointment_id: 1,
      service_id: 1,
      state: 'in_progress',
      start_date: '2026-11-10T09:00',
      end_date: '2026-11-10T09:30',
      observations: ' Control en 15 días ',
    });

    component.submit();

    expect(created[0].state).toBe('in_progress');
    expect(created[0].start_date).toBe(toIsoUtc('2026-11-10T09:00'));
    expect(created[0].end_date).toBe(toIsoUtc('2026-11-10T09:30'));
    expect(created[0].observations).toBe('Control en 15 días');
    expect('total' in created[0]).toBe(false);
  });

  it('should warn before sending when the patient of the appointment has no active clinical record', async () => {
    const { fixture, component } = await render();

    component.form.controls.appointment_id.setValue(2);
    fixture.detectChanges();

    expect(component.missingRecord()).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'no tiene una historia clínica activa',
    );
  });

  it('should not warn when the patient has an active clinical record', async () => {
    const { component } = await render();

    component.form.controls.appointment_id.setValue(1);

    expect(component.missingRecord()).toBe(false);
  });

  it('should load the encounter in edit mode and disable the appointment and the status', async () => {
    const { fixture, component } = await render(ENCOUNTER);

    expect(component.form.getRawValue().service_id).toBe(1);
    expect(component.form.getRawValue().total).toBe(85000);
    expect(component.form.getRawValue().start_date).toBe(toLocalInput(ENCOUNTER.start_date));
    expect(component.form.controls.appointment_id.disabled).toBe(true);
    expect(component.form.controls.status.disabled).toBe(true);
    expect(component.stateOptions().length).toBe(3);
    expect((fixture.nativeElement as HTMLElement).querySelector('input[readonly]')).toBeTruthy();
  });

  it('should disable the total when the encounter is already billed', async () => {
    const { component } = await render({ ...ENCOUNTER, invoice_id: 9 });

    expect(component.billed()).toBe(true);
    expect(component.form.controls.total.disabled).toBe(true);
  });

  it('should emit only the fields that changed when editing', async () => {
    const { component, updated } = await render(ENCOUNTER);
    component.form.patchValue({ state: 'in_progress', observations: 'Control en 15 días' });

    component.submit();

    expect(updated).toEqual([{ state: 'in_progress', observations: 'Control en 15 días' }]);
  });

  it('should emit unchanged and no update when nothing was edited', async () => {
    const { component, updated, unchangedCount } = await render(ENCOUNTER);

    component.submit();

    expect(updated.length).toBe(0);
    expect(unchangedCount()).toBe(1);
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ observations: 'Texto escrito antes de cancelar' });

    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(component.form.getRawValue().observations).toBe('');
  });
});
