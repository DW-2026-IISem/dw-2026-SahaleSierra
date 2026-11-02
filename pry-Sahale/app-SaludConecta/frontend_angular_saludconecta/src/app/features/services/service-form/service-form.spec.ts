import { TestBed } from '@angular/core/testing';
import { Service, ServicePayload } from '../../../core/models/service.model';
import { ServiceForm } from './service-form';

const SERVICE: Service = {
  id: 1,
  name: 'Consulta de medicina general',
  description: 'Valoración médica general',
  status: 'active',
};

describe('ServiceForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ServiceForm] }).compileComponents();
  });

  async function render(service: Service | null = null) {
    const fixture = TestBed.createComponent(ServiceForm);
    fixture.componentRef.setInput('service', service);
    await fixture.whenStable();

    const emitted: ServicePayload[] = [];
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
      name: '  Electrocardiograma  ',
      description: ' Registro de la actividad eléctrica del corazón ',
    });

    component.submit();

    expect(emitted).toEqual([
      {
        name: 'Electrocardiograma',
        description: 'Registro de la actividad eléctrica del corazón',
        status: 'active',
      },
    ]);
  });

  it('should send a blank description as null', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ name: 'Radiografía de tórax', description: '   ' });

    component.submit();

    expect(emitted[0].description).toBeNull();
  });

  it('should load the service in edit mode and disable the status', async () => {
    const { component } = await render(SERVICE);

    expect(component.form.getRawValue().name).toBe('Consulta de medicina general');
    expect(component.form.getRawValue().description).toBe('Valoración médica general');
    expect(component.form.controls.status.disabled).toBe(true);
  });

  it('should emit the payload without status when editing', async () => {
    const { component, emitted } = await render(SERVICE);
    component.form.patchValue({ name: 'Consulta general programada' });

    component.submit();

    expect(emitted.length).toBe(1);
    expect(emitted[0].name).toBe('Consulta general programada');
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
