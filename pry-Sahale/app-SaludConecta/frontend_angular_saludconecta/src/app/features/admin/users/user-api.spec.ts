import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { EffectivePermission } from '../../../core/models/auth.model';
import { User } from '../../../core/models/user.model';
import { UserApi } from './user-api';

const BASE = `${environment.apiUrl}/users`;

const USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@saludconecta.local',
  avatar: null,
  status: 'active',
};

const PERMISSIONS: EffectivePermission[] = [
  {
    resource_id: 1,
    method: 'GET',
    path: '/api/users',
    description: 'Listar usuarios',
    role_id: 1,
    role_name: 'ADMIN',
  },
];

describe('UserApi', () => {
  let api: UserApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(UserApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { users } into User[]', () => {
    let result: User[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    http.expectOne(BASE).flush({ users: [USER] });

    expect(result).toEqual([USER]);
  });

  it('should unwrap { user } when getting one by id', () => {
    let result: User | undefined;
    api.get(1).subscribe((row) => (result = row));

    http.expectOne(`${BASE}/1`).flush({ user: USER });

    expect(result).toEqual(USER);
  });

  it('should POST the payload with the password and unwrap the created user', () => {
    const payload = {
      username: 'nuevo',
      email: 'nuevo@saludconecta.local',
      password: 'Nuevo123!',
      avatar: null,
      status: 'active' as const,
    };
    let result: User | undefined;
    api.create(payload).subscribe((row) => (result = row));

    const request = http.expectOne(BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ user: { ...USER, id: 2, username: 'nuevo' } });

    expect(result?.username).toBe('nuevo');
  });

  it('should PATCH only username, email and avatar (no password, no status)', () => {
    api.update(1, { email: 'admin2@saludconecta.local' }).subscribe();

    const request = http.expectOne(`${BASE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ email: 'admin2@saludconecta.local' });
    expect('password' in request.request.body).toBe(false);
    expect('status' in request.request.body).toBe(false);
    request.flush({ user: USER });
  });

  it('should PATCH /:id/password with current and new password', () => {
    const payload = { current_password: 'Admin123!', new_password: 'Nueva456!' };
    api.changePassword(1, payload).subscribe();

    const request = http.expectOne(`${BASE}/1/password`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(payload);
    request.flush({ message: 'Password updated' });
  });

  it('should GET /:id/permissions and unwrap { permissions }', () => {
    let result: EffectivePermission[] | undefined;
    api.permissions(1).subscribe((rows) => (result = rows));

    http.expectOne(`${BASE}/1/permissions`).flush({ permissions: PERMISSIONS });

    expect(result).toEqual(PERMISSIONS);
  });

  it('should deactivate with PATCH /:id/deactivate', () => {
    api.deactivate(1).subscribe();

    const request = http.expectOne(`${BASE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'User deactivated' });
  });
});
