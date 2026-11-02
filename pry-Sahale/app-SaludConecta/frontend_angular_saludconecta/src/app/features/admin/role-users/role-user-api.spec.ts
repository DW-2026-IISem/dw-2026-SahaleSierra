import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { RoleUser } from '../../../core/models/role-user.model';
import { RoleUserApi } from './role-user-api';

describe('RoleUserApi', () => {
  let api: RoleUserApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(RoleUserApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { assignments } and not { role_users }', () => {
    const assignment: RoleUser = { id: 1, user_id: 3, role_id: 3, status: 'active' };
    let result: RoleUser[] | undefined;
    api.list().subscribe((rows) => (result = rows));

    http.expectOne(`${environment.apiUrl}/role-users`).flush({ assignments: [assignment] });

    expect(result).toEqual([assignment]);
  });
});
