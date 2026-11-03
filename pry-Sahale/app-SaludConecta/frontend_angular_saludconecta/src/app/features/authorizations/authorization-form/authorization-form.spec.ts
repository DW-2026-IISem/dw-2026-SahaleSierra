import { TestBed } from '@angular/core/testing';
import {
  Authorization,
  AuthorizationPayload,
  AuthorizationUpdatePayload,
} from '../../../core/models/authorization.model';
import { AppointmentOption, AuthorizationForm } from './authorization-form';

const OPTIONS: AppointmentOption[] = [
  { id: 2, label: 'Carlos Ruiz · 11/11/2026 10:00 · Agenda pediatría mañana' },
  { id: 3, label: 'Laura Gómez · 12/11/2026 11:00 · Agenda pediatría mañana' },
];

const AUTHORIZATION: Authorization = {
  id: 1,
  name: 'AUT-00012345',
  description: 'Autorización EPS Sura',
  appointment_id: 1,
  status: 'active',
};

describe('AuthorizationForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AuthorizationForm] }).compileComponents();
  });

  async function render(
    options: { authorization?: Authorization | null; appointments?: AppointmentOption[] } = {},
  ) {
    const fixture = TestBed.createComponent(AuthorizationForm);
    fixture.componentRef.setInput('appointmentOptions', options.appointments ?? OPTIONS);
    fixture.componentRef.setInput('authorization', options.authorization ?? null);
    fixture.componentRef.setInput(
      'appointmentLabel',
      options.authorization ? 'Laura Gómez · 10/11/2026 09:00' : '',
    );
    await fixture.whenStable();

    const created: AuthorizationPayload[] = [];
    const updated: AuthorizationUpdatePayload[] = [];
    fixture.componentInstance.created.subscribe((payload) => created.push(payload));
    fixture.componentInstance.updated.subscribe((payload) => updated.push(payload));

    return { fixture, component: fixture.componentInstance, created, updated };
  }

  it('should start empty in create mode with the appointment and status enabled', async () => {
    const { component } = await render();

    expect(component.form.getRawValue().name).toBe('');
    expect(component.form.getRawValue().appointment_id).toBeNull();
    expect(component.form.controls.appointment_id.enabled).toBe(true);
    expect(component.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { component, created } = await render();

    component.submit();

    expect(created.length).toBe(0);
    expect(component.form.controls.appointment_id.touched).toBe(true);
    expect(component.form.controls.name.touched).toBe(true);
  });

  it('should emit the created payload with a numeric appointment_id and a null blank description', async () => {
    const { component, created } = await render();
    component.form.patchValue({ name: ' AUT-00067890 ', appointment_id: 2, description: '   ' });

    component.submit();

    expect(created).toEqual([
      { name: 'AUT-00067890', description: null, appointment_id: 2, status: 'active' },
    ]);
    expect(typeof created[0].appointment_id).toBe('number');
  });

  it('should warn when there are no appointments left without an authorization', async () => {
    const { fixture } = await render({ appointments: [] });

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Todas las citas activas ya tienen autorización.',
    );
  });

  it('should load the authorization in edit mode and disable the appointment and the status', async () => {
    const { fixture, component } = await render({ authorization: AUTHORIZATION });

    expect(component.form.getRawValue().name).toBe('AUT-00012345');
    expect(component.form.controls.appointment_id.disabled).toBe(true);
    expect(component.form.controls.status.disabled).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('input[readonly]')).toBeTruthy();
  });

  it('should emit only name and description when editing', async () => {
    const { component, created, updated } = await render({ authorization: AUTHORIZATION });
    component.form.patchValue({ description: 'EPS Sura – plan complementario' });

    component.submit();

    expect(created.length).toBe(0);
    expect(updated).toEqual([
      { name: 'AUT-00012345', description: 'EPS Sura – plan complementario' },
    ]);
    expect('appointment_id' in updated[0]).toBe(false);
    expect('status' in updated[0]).toBe(false);
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ name: 'Texto escrito antes de cancelar' });

    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(component.form.getRawValue().name).toBe('');
  });
});
