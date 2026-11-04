import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccessPayload, EffectivePermission, SessionTokens } from '../models/auth.model';
import { HttpMethod, Resource } from '../models/resource.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

const STORAGE_KEY = 'storelab.session.v1';

interface PersistedSession {
  accessToken: string;
  refreshToken: string;
  user: User | null;
  permissions: EffectivePermission[];
}

/**
 * Única fuente de verdad de la sesión en el cliente.
 * Todo se expone como signals de solo lectura y se deriva con computed().
 *
 * Contrato del backend `backend_express_saludconecta` (confirmado por curl):
 *  - `POST /api/session/login`   → { access_token, token_type, expires_in, refresh_token, refresh_expires_in }
 *  - `POST /api/session/refresh` → mismo shape, rota el refresh
 *  - `POST /api/session/logout`  → { message: "Session closed" }
 *  - `GET  /api/session/profile` → { user }
 *  - `GET  /api/permissions`     → { permissions: EffectivePermission[] }
 *
 * Seguridad: el backend sigue siendo la autoridad. `can()` solo decide qué pintar
 * en la UI; aunque se fuerce el menú, Express responde 401/403.
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  /**
   * Mitad frontal del interruptor de fases.
   * - `false`: guards permisivos, directiva siempre visible, sin `Bearer`.
   * - `true`: Fase II. Debe emparejarse con `AUTH_ENABLED=true` en el backend.
   */
  readonly authEnabled = environment.requireAuth;

  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);
  private readonly _permissions = signal<EffectivePermission[]>([]);

  readonly accessToken = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly user = this._user.asReadonly();
  readonly permissions = this._permissions.asReadonly();

  readonly isAuthenticated = computed(() => this._accessToken() !== null);

  /** Roles derivados de los permisos efectivos (role_name único). */
  readonly roleNames = computed(() =>
    [...new Set(this._permissions().map((permission) => permission.role_name))].sort(),
  );

  /** `Role[]` derivado para plantillas que ya consumían `session.roles()`. */
  readonly roles = computed<Role[]>(() => {
    const byId = new Map<number, Role>();
    for (const permission of this._permissions()) {
      if (!byId.has(permission.role_id)) {
        byId.set(permission.role_id, {
          id: permission.role_id,
          name: permission.role_name,
          description: null,
          status: 'active',
        });
      }
    }
    return [...byId.values()];
  });

  /** `Resource[]` derivado de los permisos efectivos. */
  readonly resources = computed<Resource[]>(() =>
    this._permissions().map((permission) => ({
      id: permission.resource_id,
      method: permission.method,
      path: permission.path,
      description: permission.description,
      status: 'active' as const,
    })),
  );

  /** Set de strings "MÉTODO /api/ruta" para consultas O(1) en la UI. */
  readonly permissionsIndex = computed(
    () => new Set(this._permissions().map((item) => `${item.method} ${item.path}`)),
  );

  readonly permissionCount = computed(() => this._permissions().length);

  constructor() {
    this.restore();
  }

  /** Login y refresh comparten la misma forma: solo tokens. */
  setTokens(tokens: SessionTokens): void {
    this._accessToken.set(tokens.access_token);
    this._refreshToken.set(tokens.refresh_token);
    this.persist();
  }

  /** Perfil + permisos efectivos (login y "Actualizar permisos"). */
  setAccess(access: AccessPayload): void {
    this._user.set(access.user);
    this._permissions.set(access.permissions ?? []);
    this.persist();
  }

  clear(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._user.set(null);
    this._permissions.set([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  /**
   * ¿La sesión tiene un permiso concreto?
   * - Sin auth (fase I) siempre permite.
   * - Compara `MÉTODO` y `path`; soporta `:id` del catálogo Resource.
   */
  can(method: HttpMethod | string, path: string): boolean {
    if (!this.authEnabled) {
      return true;
    }
    const verb = method.toUpperCase();
    const requestPath = path.split('?')[0];
    return this._permissions().some(
      (permission) =>
        permission.method === verb && pathMatches(permission.path, requestPath),
    );
  }

  canPermission(permission: string): boolean {
    if (!this.authEnabled) {
      return true;
    }
    const separator = permission.indexOf(' ');
    if (separator < 0) {
      return false;
    }
    return this.can(permission.slice(0, separator), permission.slice(separator + 1));
  }

  hasRole(name: string): boolean {
    return this.roleNames().includes(name.toUpperCase());
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const data = JSON.parse(raw) as PersistedSession;
      // Sesiones guardadas por una versión anterior (roles/resources) no sirven.
      if (!Array.isArray(data.permissions)) {
        this.clear();
        return;
      }
      this._accessToken.set(data.accessToken ?? null);
      this._refreshToken.set(data.refreshToken ?? null);
      this._user.set(data.user ?? null);
      this._permissions.set(data.permissions ?? []);
    } catch {
      this.clear();
    }
  }

  private persist(): void {
    const data: PersistedSession = {
      accessToken: this._accessToken() ?? '',
      refreshToken: this._refreshToken() ?? '',
      user: this._user(),
      permissions: this._permissions(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* modo privado o cuota llena: la sesión sigue en memoria */
    }
  }
}

/** `/api/patients/:id` debe reconocer `/api/patients/7`. */
function pathMatches(pattern: string, path: string): boolean {
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\/:[^/]+/g, '/[^/]+');
  return new RegExp(`^${escaped}$`).test(path);
}
