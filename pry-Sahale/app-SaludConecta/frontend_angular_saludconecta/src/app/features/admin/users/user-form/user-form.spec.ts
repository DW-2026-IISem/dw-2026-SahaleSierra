import { TestBed } from '@angular/core/testing';
import { User, UserPayload } from '../../../../core/models/user.model';
import { UserForm } from './user-form';

const USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@saludconecta.local',
  avatar: null,
  status: 'active',
};

describe('UserForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UserForm] }).compileComponents();
  });

  async function render(user: User | null = null) {
    const fixture = TestBed.createComponent(UserForm);
    fixture.componentRef.setInput('user', user);
    await fixture.whenStable();
    const emitted: UserPayload[] = [];
    fixture.componentInstance.saved.subscribe((p) => emitted.push(p));
    return { fixture, component: fixture.componentInstance, emitted };
  }

  it('should require password in create mode and emit it', async () => {
    const { component, emitted } = await render();
    expect(component.form.controls.password.enabled).toBe(true);
    component.form.patchValue({ username: 'nuevo', email: 'nuevo@b', password: 'Abc12345' });
    component.submit();
    expect(emitted[0].password).toBe('Abc12345');
    expect(emitted[0].status).toBe('active');
  });

  it('should not emit when password is missing in create mode', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({ username: 'nuevo', email: 'nuevo@b' });
    component.submit();
    expect(emitted.length).toBe(0);
  });

  it('should disable password in edit mode', async () => {
    const { component } = await render(USER);
    expect(component.form.controls.password.disabled).toBe(true);
  });

  it('should emit without password and without status in edit mode', async () => {
    const { component, emitted } = await render(USER);
    component.form.patchValue({ email: 'admin2@b' });
    component.submit();
    expect(emitted[0].email).toBe('admin2@b');
    expect(emitted[0].password).toBeUndefined();
    expect(emitted[0].status).toBeUndefined();
  });

  it('should trim username and avatar, and emit null avatar when blank', async () => {
    const { component, emitted } = await render();
    component.form.patchValue({
      username: '  nuevo  ',
      email: 'nuevo@b',
      password: 'Abc12345',
      avatar: '   ',
    });
    component.submit();
    expect(emitted[0].username).toBe('nuevo');
    expect(emitted[0].avatar).toBeNull();
  });

  it('should clear the form when resetKey changes', async () => {
    const { fixture, component } = await render();
    component.form.patchValue({ username: 'algo' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();
    expect(component.form.getRawValue().username).toBe('');
  });
});
