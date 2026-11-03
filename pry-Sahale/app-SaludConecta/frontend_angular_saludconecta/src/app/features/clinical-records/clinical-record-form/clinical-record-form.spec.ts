import { TestBed } from '@angular/core/testing';
import {
  ClinicalRecord,
  ClinicalRecordPayload,
  ClinicalRecordUpdatePayload,
} from '../../../core/models/clinical-record.model';
import { Patient } from '../../../core/models/patient.model';
import { ClinicalRecordForm } from './clinical-record-form';

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

const RECORD: ClinicalRecord = {
  id: 1,
  name: 'HC-1032456789',
  description: 'Control anual',
  patient_id: 1,
  status: 'active',
};

describe('ClinicalRecordForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ClinicalRecordForm] }).compileComponents();
  });

  async function render(options: { record?: ClinicalRecord | null; preset?: number | null } = {}) {
    const fixture = TestBed.createComponent(ClinicalRecordForm);
    fixture.componentRef.setInput('patients', PATIENTS);
    fixture.componentRef.setInput('record', options.record ?? null);
    fixture.componentRef.setInput('presetPatientId', options.preset ?? null);
    fixture.componentRef.setInput('patientLabel', options.record ? 'Laura Gómez' : '');
    await fixture.whenStable();

    const created: ClinicalRecordPayload[] = [];
    const updated: ClinicalRecordUpdatePayload[] = [];
    fixture.componentInstance.created.subscribe((payload) => created.push(payload));
    fixture.componentInstance.updated.subscribe((payload) => updated.push(payload));

    return { fixture, component: fixture.componentInstance, created, updated };
  }

  it('should start empty in create mode with the patient and status enabled', async () => {
    const { component } = await render();

    expect(component.form.getRawValue().name).toBe('');
    expect(component.form.getRawValue().patient_id).toBeNull();
    expect(component.form.controls.patient_id.enabled).toBe(true);
    expect(component.form.controls.status.enabled).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { component, created } = await render();

    component.submit();

    expect(created.length).toBe(0);
    expect(component.form.controls.patient_id.touched).toBe(true);
    expect(component.form.controls.name.touched).toBe(true);
  });

  it('should suggest the HC name from the document and follow the patient change', async () => {
    const { component } = await render();

    component.form.controls.patient_id.setValue(1);
    expect(component.form.getRawValue().name).toBe('HC-1032456789');

    component.form.controls.patient_id.setValue(2);
    expect(component.form.getRawValue().name).toBe('HC-1045678123');
  });

  it('should not overwrite a name typed by the user', async () => {
    const { component } = await render();
    component.form.patchValue({ name: 'Historia especial' });

    component.form.controls.patient_id.setValue(2);

    expect(component.form.getRawValue().name).toBe('Historia especial');
  });

  it('should emit the created payload with a numeric patient_id and a null blank description', async () => {
    const { component, created } = await render();
    component.form.controls.patient_id.setValue(2);
    component.form.patchValue({ description: '   ' });

    component.submit();

    expect(created).toEqual([
      {
        name: 'HC-1045678123',
        description: null,
        patient_id: 2,
        status: 'active',
      },
    ]);
    expect(typeof created[0].patient_id).toBe('number');
  });

  it('should preselect the patient and suggest its name when a preset id arrives', async () => {
    const { component } = await render({ preset: 2 });

    expect(component.form.getRawValue().patient_id).toBe(2);
    expect(component.form.getRawValue().name).toBe('HC-1045678123');
  });

  it('should load the record in edit mode and disable the patient and the status', async () => {
    const { fixture, component } = await render({ record: RECORD });

    expect(component.form.getRawValue().name).toBe('HC-1032456789');
    expect(component.form.getRawValue().description).toBe('Control anual');
    expect(component.form.controls.patient_id.disabled).toBe(true);
    expect(component.form.controls.status.disabled).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('input[readonly]')).toBeTruthy();
  });

  it('should emit only name and description when editing', async () => {
    const { component, created, updated } = await render({ record: RECORD });
    component.form.patchValue({ description: 'Control anual actualizado' });

    component.submit();

    expect(created.length).toBe(0);
    expect(updated).toEqual([{ name: 'HC-1032456789', description: 'Control anual actualizado' }]);
    expect('patient_id' in updated[0]).toBe(false);
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
