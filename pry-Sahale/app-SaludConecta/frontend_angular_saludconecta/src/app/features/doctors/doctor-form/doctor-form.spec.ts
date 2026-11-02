import { TestBed } from '@angular/core/testing';
import { Doctor, DoctorPayload } from '../../../core/models/doctor.model';
import { DoctorForm } from './doctor-form';

const DOCTOR: Doctor = {
  id: 1,
  name: 'Dra. Camila Torres',
  description: 'Registro médico RM-10234',
  status: 'active',
};

describe('DoctorForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DoctorForm] }).compileComponents();
  });

  async function render(doctor: Doctor | null = null) {
    const fixture = TestBed.createComponent(DoctorForm);
    fixture.componentRef.setInput('doctor', doctor);
    await fixture.whenStable();

    const emitted: DoctorPayload[] = [];
    fixture.componentInstance.saved.subscribe((payload) => emitted.push(payload));

    return { fixture, component: fixture.componentInstance, emitted };
  }

  it('should start empty in create mode with the status enabled', async () => {
    const { component } = await render();

    expect(component.form.getRawValue().name).toBe('');
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
    component.form.patchValue({ name: 'a'.repeat(121) });

    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed payload with the status when creating', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({
      name: '  Dr. Andrés Ramírez  ',
      description: ' Registro médico RM-20871 ',
    });

    component.submit();

    expect(emitted).toEqual([
      {
        name: 'Dr. Andrés Ramírez',
        description: 'Registro médico RM-20871',
        status: 'active',
      },
    ]);
  });

  it('should send a blank description as null', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ name: 'Dra. Laura Pineda', description: '   ' });

    component.submit();

    expect(emitted[0].description).toBeNull();
  });

  it('should load the doctor in edit mode and disable the status', async () => {
    const { component } = await render(DOCTOR);

    expect(component.form.getRawValue().name).toBe('Dra. Camila Torres');
    expect(component.form.getRawValue().description).toBe('Registro médico RM-10234');
    expect(component.form.controls.status.disabled).toBe(true);
  });

  it('should emit the payload without status when editing', async () => {
    const { component, emitted } = await render(DOCTOR);
    component.form.patchValue({ name: 'Dra. Camila Torres Ruiz' });

    component.submit();

    expect(emitted.length).toBe(1);
    expect(emitted[0].name).toBe('Dra. Camila Torres Ruiz');
    expect(emitted[0].status).toBeUndefined();
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ name: 'Texto escrito antes de cancelar' });

    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(component.form.getRawValue().name).toBe('');
  });
});
