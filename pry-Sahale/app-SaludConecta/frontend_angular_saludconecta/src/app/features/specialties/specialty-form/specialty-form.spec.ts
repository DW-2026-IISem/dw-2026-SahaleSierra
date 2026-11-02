import { TestBed } from '@angular/core/testing';
import { Specialty, SpecialtyPayload } from '../../../core/models/specialty.model';
import { SpecialtyForm } from './specialty-form';

const SPECIALTY: Specialty = {
  id: 1,
  name: 'Pediatría',
  description: 'Atención de niños y adolescentes',
  status: 'active',
};

describe('SpecialtyForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SpecialtyForm] }).compileComponents();
  });

  async function render(specialty: Specialty | null = null) {
    const fixture = TestBed.createComponent(SpecialtyForm);
    fixture.componentRef.setInput('specialty', specialty);
    await fixture.whenStable();

    const emitted: SpecialtyPayload[] = [];
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
      name: '  Cardiología  ',
      description: ' Corazón y sistema circulatorio ',
    });

    component.submit();

    expect(emitted).toEqual([
      {
        name: 'Cardiología',
        description: 'Corazón y sistema circulatorio',
        status: 'active',
      },
    ]);
  });

  it('should send a blank description as null', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ name: 'Medicina interna', description: '   ' });

    component.submit();

    expect(emitted[0].description).toBeNull();
  });

  it('should load the specialty in edit mode and disable the status', async () => {
    const { component } = await render(SPECIALTY);

    expect(component.form.getRawValue().name).toBe('Pediatría');
    expect(component.form.getRawValue().description).toBe('Atención de niños y adolescentes');
    expect(component.form.controls.status.disabled).toBe(true);
  });

  it('should emit the payload without status when editing', async () => {
    const { component, emitted } = await render(SPECIALTY);
    component.form.patchValue({ name: 'Pediatría general' });

    component.submit();

    expect(emitted.length).toBe(1);
    expect(emitted[0].name).toBe('Pediatría general');
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
