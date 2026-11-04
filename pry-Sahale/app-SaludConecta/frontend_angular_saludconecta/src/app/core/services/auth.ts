import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AccessPayload,
  LoginRequest,
  PermissionsPayload,
  ProfilePayload,
  SessionTokens,
} from '../models/auth.model';
import { SessionStore } from './session-store';

/**
 * Cliente del feature Session del backend `backend_express_saludconecta`.
 *
 * | Endpoint | Modalidad | Devuelve |
 * |---|---|---|
 * | `POST /api/session/login`   | OPEN | `SessionTokens` (solo tokens) |
 * | `GET  /api/session/profile` | JWT  | `{ user }` |
 * | `GET  /api/permissions`     | JWT  | `{ permissions }` (permisos efectivos) |
 * | `POST /api/session/refresh` | OPEN (refresh en el body) | `SessionTokens` |
 * | `POST /api/session/logout`  | OPEN (refresh en el body) | `{ message }` |
 *
 * El login NO devuelve usuario ni permisos: tras guardar los tokens se consulta
 * el perfil y la matriz efectiva en dos peticiones JWT (`forkJoin`).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);
  private readonly base = `${environment.apiUrl}/session`;
  private readonly permissionsUrl = `${environment.apiUrl}/permissions`;

  /** Login + carga de identidad/permisos. */
  login(credentials: LoginRequest): Observable<AccessPayload> {
    return this.http.post<SessionTokens>(`${this.base}/login`, credentials).pipe(
      tap((tokens) => this.session.setTokens(tokens)),
      switchMap(() =>
        this.me().pipe(
          // Si perfil o permisos fallan, no dejes una sesión a medias.
          catchError((error: unknown) => {
            this.session.clear();
            return throwError(() => error);
          }),
        ),
      ),
    );
  }

  /**
   * `GET /api/session/profile` + `GET /api/permissions`.
   * Se usa tras el login y en "Actualizar permisos" del menú.
   */
  me(): Observable<AccessPayload> {
    return forkJoin({
      profile: this.http.get<ProfilePayload>(`${this.base}/profile`),
      permissions: this.http.get<PermissionsPayload>(this.permissionsUrl),
    }).pipe(
      map(({ profile, permissions }) => ({
        user: profile.user,
        permissions: permissions.permissions,
      })),
      tap((access) => this.session.setAccess(access)),
    );
  }

  /** Renueva el par de tokens; el refresh anterior queda rotado. */
  refresh(): Observable<SessionTokens> {
    const refresh_token = this.session.refreshToken();
    if (!refresh_token) {
      return throwError(() => new Error('No hay refresh token en la sesión'));
    }
    return this.http
      .post<SessionTokens>(`${this.base}/refresh`, { refresh_token })
      .pipe(tap((tokens) => this.session.setTokens(tokens)));
  }

  /**
   * Cierra la sesión del refresh presente. Siempre limpia el estado local,
   * aunque el backend no responda (por ejemplo, si ya expiró).
   */
  logout(): Observable<unknown> {
    const refresh_token = this.session.refreshToken();
    if (!refresh_token) {
      this.session.clear();
      return of(null);
    }
    return this.http.post(`${this.base}/logout`, { refresh_token }).pipe(
      catchError(() => of(null)),
      finalize(() => this.session.clear()),
    );
  }
}
