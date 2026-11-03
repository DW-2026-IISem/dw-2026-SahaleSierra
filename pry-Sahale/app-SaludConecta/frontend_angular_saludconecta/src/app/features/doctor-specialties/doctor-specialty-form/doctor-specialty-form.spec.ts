import { TestBed } from '@angular/core/testing';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorSpecialtyPayload } from '../../../core/models/doctor-specialty.model';
import { Specialty } from '../../../core/models/specialty.model';
import { DoctorSpecialtyForm } from './doctor-specialty-form';

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dra. Camila Torres', description: null, status: 'active' },
  { id: 2, name: 'Dr. Andrés Ramírez', description: null, status: 'active' },
];

const SPECIALTIES: Specialty[] = [
  { id: 1, name: 'Pediatría', description: null, status: 'active' },
  { id: 2, name: 'Cardiología', description: null, status: 'active' },
];

describe('DoctorSpecialtyForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSpecialtyForm],
    }).compileComponents();
  });

  async function render() {
    const fixture = TestBed.createComponent(DoctorSpecialtyForm);
    fixture.componentRef.setInput('doctors', DOCTORS);
    fixture.componentRef.setInput('specialties', SPECIALTIES);
    await fixture.whenStable();

    const emitted: DoctorSpecialtyPayload[] = [];
    fixture.componentInstance.saved.subscribe((payload) => emitted.push(payload));

    return { fixture, component: fixture.componentInstance, emitted };
  }

  it('should start with both selects empty', async () => {
    const { component } = await render();

    expect(component.form.getRawValue()).toEqual({ doctor_id: null, specialty_id: null });
  });

  it('should not emit and should mark both selects as touched when nothing is selected', async () => {
    const { component, emitted } = await render();

    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.controls.doctor_id.touched).toBe(true);
    expect(component.form.controls.specialty_id.touched).toBe(true);
  });

  it('should not emit when only the doctor is selected', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ doctor_id: 1 });

    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.controls.specialty_id.invalid).toBe(true);
  });

  it('should emit the numeric ids without a status', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ doctor_id: 1, specialty_id: 2 });

    component.submit();

    expect(emitted).toEqual([{ doctor_id: 1, specialty_id: 2 }]);
    expect('status' in emitted[0]).toBe(false);
  });

  it('should show the validation messages after a failed submit', async () => {
    const { fixture, component } = await render();

    component.submit();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Selecciona un médico.');
    expect(text).toContain('Selecciona una especialidad.');
  });

  it('should clear the selection when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ doctor_id: 1, specialty_id: 2 });

    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(component.form.getRawValue()).toEqual({ doctor_id: null, specialty_id: null });
  });
});
