import { TestBed } from '@angular/core/testing';
import { Role, RolePayload } from '../../../../core/models/role.model';
import { RoleForm } from './role-form';

const ROLE: Role = { id: 1, name: 'ADMIN', description: 'Acceso total', status: 'active' };

describe('RoleForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RoleForm] }).compileComponents();
  });

  async function render(role: Role | null = null) {
    const fixture = TestBed.createComponent(RoleForm);
    fixture.componentRef.setInput('role', role);
    await fixture.whenStable();
    const emitted: RolePayload[] = [];
    fixture.componentInstance.saved.subscribe((p) => emitted.push(p));
    return { fixture, component: fixture.componentInstance, emitted };
  }

  it('should normalize the name to uppercase when creating', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ name: '  admin  ', description: '  ' });
    component.submit();
    expect(emitted[0]).toEqual({ name: 'ADMIN', description: null, status: 'active' });
  });

  it('should not emit when the name is empty', async () => {
    const { component, emitted } = await render();
    component.submit();
    expect(emitted.length).toBe(0);
  });

  it('should emit without status when editing', async () => {
    const { component, emitted } = await render(ROLE);
    component.form.patchValue({ description: 'Acceso completo' });
    component.submit();
    expect(emitted[0].status).toBeUndefined();
    expect(emitted[0].name).toBe('ADMIN');
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ name: 'algo' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();
    expect(component.form.getRawValue().name).toBe('');
  });
});
