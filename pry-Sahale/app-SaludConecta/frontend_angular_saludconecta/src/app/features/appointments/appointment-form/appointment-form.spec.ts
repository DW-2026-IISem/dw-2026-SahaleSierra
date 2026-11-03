import { TestBed } from '@angular/core/testing';
import { Agenda } from '../../../core/models/agenda.model';
import {
  Appointment,
  AppointmentPayload,
  AppointmentUpdatePayload,
} from '../../../core/models/appointment.model';
import { Doctor } from '../../../core/models/doctor.model';
import { Patient } from '../../../core/models/patient.model';
import { toIsoUtc, toLocalInput } from '../../../core/utils/datetime';
import { AppointmentForm } from './appointment-form';

const PATIENTS: Patient[] = [
  {
    id: 1,
    document_type: 'CC',
    document_number: '1032456789',
    name: 'Laura Gómez',
    birth_date: '1990-05-12',
    contact: '3104567890',
    status: 'active',
  },
  {
    id: 2,
    document_type: 'CC',
    document_number: '1045678123',
    name: 'Carlos Ruiz',
    birth_date: '1979-11-30',
    contact: '3112223344',
    status: 'active',
  },
];

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dra. Laura Ríos', description: 'Pediatra', status: 'active' },
];

const AGENDAS: Agenda[] = [
  { id: 1, name: 'Agenda pediatría mañana', description: null, doctor_id: 1, status: 'active' },
];

const APPOINTMENT: Appointment = {
  id: 1,
  agenda_id: 1,
  patient_id: 1,
  start_date: '2026-11-10T14:00:00.000Z',
  end_date: '2026-11-10T14:30:00.000Z',
  reason: 'Control de rutina',
  state: 'scheduled',
  status: 'active',
};

describe('AppointmentForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppointmentForm] }).compileComponents();
  });

  async function render(appointment: Appointment | null = null) {
    const fixture = TestBed.createComponent(AppointmentForm);
    fixture.componentRef.setInput('agendas', AGENDAS);
    fixture.componentRef.setInput('doctors', DOCTORS);
    fixture.componentRef.setInput('patients', PATIENTS);
    fixture.componentRef.setInput('appointment', appointment);
    await fixture.whenStable();

    const created: AppointmentPayload[] = [];
    const updated: AppointmentUpdatePayload[] = [];
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

  function fillValid(component: AppointmentForm): void {
    component.form.patchValue({
      agenda_id: 1,
      patient_id: 2,
      start_date: '2026-11-10T09:00',
      end_date: '2026-11-10T09:30',
      reason: ' Control ',
    });
  }

  it('should start empty in create mode with the status enabled', async () => {
    const { component } = await render();

    expect(component.form.getRawValue().agenda_id).toBeNull();
    expect(component.form.getRawValue().start_date).toBe('');
    expect(component.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { component, created } = await render();

    component.submit();

    expect(created.length).toBe(0);
    expect(component.form.controls.agenda_id.touched).toBe(true);
    expect(component.form.controls.start_date.touched).toBe(true);
  });

  it('should not emit when the end is not after the start', async () => {
    const { component, created } = await render();
    fillValid(component);
    component.form.patchValue({ end_date: '2026-11-10T09:00' });

    component.submit();

    expect(component.form.hasError('range')).toBe(true);
    expect(created.length).toBe(0);
  });

  it('should emit the created payload with UTC dates and without state', async () => {
    const { component, created } = await render();
    fillValid(component);

    component.submit();

    expect(created).toEqual([
      {
        agenda_id: 1,
        patient_id: 2,
        start_date: toIsoUtc('2026-11-10T09:00'),
        end_date: toIsoUtc('2026-11-10T09:30'),
        reason: 'Control',
        status: 'active',
      },
    ]);
    expect('state' in created[0]).toBe(false);
  });

  it('should send a blank reason as null', async () => {
    const { component, created } = await render();
    fillValid(component);
    component.form.patchValue({ reason: '   ' });

    component.submit();

    expect(created[0].reason).toBeNull();
  });

  it('should load the appointment in edit mode with local date text and the status disabled', async () => {
    const { component } = await render(APPOINTMENT);

    expect(component.form.getRawValue().agenda_id).toBe(1);
    expect(component.form.getRawValue().start_date).toBe(toLocalInput(APPOINTMENT.start_date));
    expect(component.form.getRawValue().reason).toBe('Control de rutina');
    expect(component.form.controls.status.disabled).toBe(true);
  });

  it('should emit only the fields that changed when editing', async () => {
    const { component, updated } = await render(APPOINTMENT);
    component.form.patchValue({
      end_date: toLocalInput('2026-11-10T15:00:00.000Z'),
      reason: 'Control prioritario',
    });

    component.submit();

    expect(updated).toEqual([
      { end_date: '2026-11-10T15:00:00.000Z', reason: 'Control prioritario' },
    ]);
  });

  it('should emit unchanged and no update when nothing was edited', async () => {
    const { component, updated, unchangedCount } = await render(APPOINTMENT);

    component.submit();

    expect(updated.length).toBe(0);
    expect(unchangedCount()).toBe(1);
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ reason: 'Texto escrito antes de cancelar' });

    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(component.form.getRawValue().reason).toBe('');
  });
});
