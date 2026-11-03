import { TestBed } from '@angular/core/testing';
import { Agenda, AgendaPayload } from '../../../core/models/agenda.model';
import { Doctor } from '../../../core/models/doctor.model';
import { AgendaForm } from './agenda-form';

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dra. Camila Torres', description: null, status: 'active' },
  { id: 2, name: 'Dr. Andrés Ramírez', description: null, status: 'active' },
];

const AGENDA: Agenda = {
  id: 1,
  name: 'Consulta externa · mañana',
  description: 'Lunes a viernes, 7:00 a 12:00',
  doctor_id: 1,
  status: 'active',
};

describe('AgendaForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AgendaForm] }).compileComponents();
  });

  async function render(agenda: Agenda | null = null) {
    const fixture = TestBed.createComponent(AgendaForm);
    fixture.componentRef.setInput('agenda', agenda);
    fixture.componentRef.setInput('doctors', DOCTORS);
    await fixture.whenStable();

    const emitted: AgendaPayload[] = [];
    fixture.componentInstance.saved.subscribe((payload) => emitted.push(payload));

    return { fixture, component: fixture.componentInstance, emitted };
  }

  it('should start empty in create mode with the status enabled', async () => {
    const { component } = await render();

    expect(component.form.getRawValue().name).toBe('');
    expect(component.form.getRawValue().doctor_id).toBeNull();
    expect(component.form.getRawValue().status).toBe('active');
    expect(component.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark the name as touched when it is empty', async () => {
    const { component, emitted } = await render();

    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.controls.name.touched).toBe(true);
  });

  it('should not emit when the name has more than 120 characters', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ name: 'a'.repeat(121), doctor_id: 1 });

    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.controls.name.invalid).toBe(true);
  });

  it('should not emit when no doctor is selected', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ name: 'Consulta externa · tarde' });

    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.controls.doctor_id.invalid).toBe(true);
  });

  it('should emit the trimmed payload with a numeric doctor_id and the status when creating', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({
      name: '  Consulta externa · tarde  ',
      description: ' Lunes a viernes, 14:00 a 18:00 ',
      doctor_id: 2,
    });

    component.submit();

    expect(emitted).toEqual([
      {
        name: 'Consulta externa · tarde',
        description: 'Lunes a viernes, 14:00 a 18:00',
        doctor_id: 2,
        status: 'active',
      },
    ]);
  });

  it('should send a blank description as null', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ name: 'Procedimientos', description: '   ', doctor_id: 1 });

    component.submit();

    expect(emitted[0].description).toBeNull();
  });

  it('should load the agenda in edit mode and disable the status', async () => {
    const { component } = await render(AGENDA);

    expect(component.form.getRawValue().name).toBe('Consulta externa · mañana');
    expect(component.form.getRawValue().doctor_id).toBe(1);
    expect(component.form.controls.status.disabled).toBe(true);
  });

  it('should emit the payload without status when editing', async () => {
    const { component, emitted } = await render(AGENDA);
    component.form.patchValue({ doctor_id: 2 });

    component.submit();

    expect(emitted.length).toBe(1);
    expect(emitted[0].doctor_id).toBe(2);
    expect(emitted[0].status).toBeUndefined();
  });

  it('should keep the current doctor as an option when it is no longer active', async () => {
    const { component } = await render({ ...AGENDA, doctor_id: 9 });

    expect(component.doctorOptions().map((option) => option.id)).toEqual([1, 2, 9]);
    expect(component.doctorOptions()[2].name).toBe('Médico #9 (inactivo)');
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ name: 'Texto escrito antes de cancelar', doctor_id: 2 });

    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(component.form.getRawValue().name).toBe('');
    expect(component.form.getRawValue().doctor_id).toBeNull();
  });
});
