import { BaseApi } from './BaseApi';
import { NewUser, Role } from '../models/types';

export class UsersApi extends BaseApi {
  list(params: { role?: Role; page?: number; limit?: number; sort?: string } = {}) {
    return this.call('GET', '/api/users', { params });
  }
  get(id: number) {
    return this.call('GET', `/api/users/${id}`);
  }
  create(user: NewUser | Record<string, unknown>) {
    return this.call('POST', '/api/users', { data: user });
  }
  replace(id: number, user: NewUser & { active: boolean }) {
    return this.call('PUT', `/api/users/${id}`, { data: user });
  }
  update(id: number, fields: Partial<NewUser>) {
    return this.call('PATCH', `/api/users/${id}`, { data: fields });
  }
  delete(id: number) {
    return this.call('DELETE', `/api/users/${id}`);
  }
  /** Admin-only endpoint: needs a token of a user with the admin role. */
  adminDelete(id: number) {
    return this.call('DELETE', `/api/admin/users/${id}`);
  }
}
