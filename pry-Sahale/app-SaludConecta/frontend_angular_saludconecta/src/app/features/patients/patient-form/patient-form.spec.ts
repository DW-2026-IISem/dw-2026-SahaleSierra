import { TestBed } from '@angular/core/testing';
import { Patient, PatientPayload } from '../../../core/models/patient.model';
import { PatientForm } from './patient-form';

const PATIENT: Patient = {
  id: 1,
  document_type: 'CC',
  document_number: '1032456789',
  name: 'Laura Gómez',
  birth_date: '1990-05-12',
  contact: '3104567890',
  status: 'active',
};

describe('PatientForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PatientForm] }).compileComponents();
  });

  async function render(patient: Patient | null = null) {
    const fixture = TestBed.createComponent(PatientForm);
    fixture.componentRef.setInput('patient', patient);
    await fixture.whenStable();

    const emitted: PatientPayload[] = [];
    fixture.componentInstance.saved.subscribe((payload) => emitted.push(payload));

    return { fixture, component: fixture.componentInstance, emitted };
  }

  function fillValid(component: PatientForm): void {
    component.form.patchValue({
      document_type: 'CC',
      document_number: ' 1032456789 ',
      name: ' Laura Gómez ',
      birth_date: '1990-05-12',
      contact: '3104567890',
    });
  }

  it('should start empty in create mode with the status enabled', async () => {
    const { component } = await render();

    expect(component.form.getRawValue().name).toBe('');
    expect(component.form.getRawValue().status).toBe('active');
    expect(component.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { component, emitted } = await render();

    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.controls.name.touched).toBe(true);
  });

  it('should emit the trimmed payload with the status when creating', async () => {
    const { component, emitted } = await render();
    fillValid(component);

    component.submit();

    expect(emitted).toEqual([
      {
        document_type: 'CC',
        document_number: '1032456789',
        name: 'Laura Gómez',
        birth_date: '1990-05-12',
        contact: '3104567890',
        status: 'active',
      },
    ]);
  });

  it('should load the patient in edit mode and disable the status', async () => {
    const { component } = await render(PATIENT);

    expect(component.form.getRawValue().name).toBe('Laura Gómez');
    expect(component.form.getRawValue().birth_date).toBe('1990-05-12');
    expect(component.form.controls.status.disabled).toBe(true);
  });

  it('should emit the payload without status when editing', async () => {
    const { component, emitted } = await render(PATIENT);
    component.form.patchValue({ contact: '3200000000' });

    component.submit();

    expect(emitted.length).toBe(1);
    expect(emitted[0].contact).toBe('3200000000');
    expect(emitted[0].status).toBeUndefined();
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ name: 'Texto escrito antes de cancelar' });

    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(component.form.getRawValue().name).toBe('');
  });

  it('should emit cancelled when the Cancelar button is pressed', async () => {
    const { fixture, component } = await render();
    let cancelled = 0;
    component.cancelled.subscribe(() => cancelled++);

    const button = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((b) => b.textContent?.includes('Cancelar')) as HTMLButtonElement;
    button.click();

    expect(cancelled).toBe(1);
  });
});
