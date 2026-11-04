import { TestBed } from '@angular/core/testing';
import { Resource, ResourcePayload } from '../../../../core/models/resource.model';
import { ResourceForm } from './resource-form';

const RESOURCE: Resource = {
  id: 1,
  method: 'GET',
  path: '/api/patients',
  description: 'Listar pacientes',
  status: 'active',
};

describe('ResourceForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ResourceForm] }).compileComponents();
  });

  async function render(resource: Resource | null = null) {
    const fixture = TestBed.createComponent(ResourceForm);
    fixture.componentRef.setInput('resource', resource);
    await fixture.whenStable();
    const emitted: ResourcePayload[] = [];
    fixture.componentInstance.saved.subscribe((p) => emitted.push(p));
    return { fixture, component: fixture.componentInstance, emitted };
  }

  it('should reject a path not starting with /', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ method: 'GET', path: 'api/patients' });
    component.submit();
    expect(component.form.controls.path.invalid).toBe(true);
    expect(emitted.length).toBe(0);
  });

  it('should emit a complete payload when creating', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({
      method: 'POST',
      path: '/api/patients',
      description: 'Crear paciente',
    });
    component.submit();
    expect(emitted[0]).toEqual({
      method: 'POST',
      path: '/api/patients',
      description: 'Crear paciente',
      status: 'active',
    });
  });

  it('should emit without status when editing', async () => {
    const { component, emitted } = await render(RESOURCE);
    component.form.patchValue({ description: 'Ver pacientes' });
    component.submit();
    expect(emitted[0].status).toBeUndefined();
    expect(emitted[0].method).toBe('GET');
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ path: '/x' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();
    expect(component.form.getRawValue().path).toBe('');
  });
});
