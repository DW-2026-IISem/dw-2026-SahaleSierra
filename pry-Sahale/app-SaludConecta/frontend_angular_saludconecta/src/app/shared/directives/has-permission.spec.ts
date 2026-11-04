import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../../core/services/session-store';
import { HasPermissionDirective } from './has-permission';

const TOKENS = {
  access_token: 'A',
  token_type: 'Bearer' as const,
  expires_in: 900,
  refresh_token: 'R',
  refresh_expires_in: 604800,
};

const PERMISSIONS = [
  {
    resource_id: 3,
    method: 'POST' as const,
    path: '/api/patients',
    description: 'Crear',
    role_id: 1,
    role_name: 'ADMIN',
  },
];

@Component({
  standalone: true,
  imports: [HasPermissionDirective],
  template: `
    <ng-container *appHasPermission="'POST /api/patients'">
      <button id="create">Nuevo</button>
    </ng-container>
    <ng-container *appHasPermission="'DELETE /api/patients/:id'">
      <button id="delete">Eliminar</button>
    </ng-container>
  `,
})
class HostComponent {}

describe('HasPermissionDirective', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });
  afterEach(() => localStorage.clear());

  async function render() {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    const store = TestBed.inject(SessionStore);
    store.setTokens(TOKENS);
    await fixture.whenStable();
    return { fixture, store };
  }

  it('renders nothing when the session has no permissions', async () => {
    const { fixture, store } = await render();
    store.setAccess({
      user: { id: 1, username: 'medico', email: 'm@b', avatar: null, status: 'active' },
      permissions: [],
    });
    await fixture.whenStable();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('#create')).toBeNull();
    expect(root.querySelector('#delete')).toBeNull();
  });

  it('renders only the parts the session can access', async () => {
    const { fixture, store } = await render();
    store.setAccess({
      user: { id: 1, username: 'medico', email: 'm@b', avatar: null, status: 'active' },
      permissions: PERMISSIONS,
    });
    await fixture.whenStable();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('#create')).toBeTruthy();
    expect(root.querySelector('#delete')).toBeNull();
  });

  it('reacts when permissions change after render', async () => {
    const { fixture, store } = await render();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('#create')).toBeNull();

    store.setAccess({
      user: { id: 1, username: 'admin', email: 'a@b', avatar: null, status: 'active' },
      permissions: PERMISSIONS,
    });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(root.querySelector('#create')).toBeTruthy();
  });
});
