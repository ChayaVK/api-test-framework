import { expect } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class AuthApi extends BaseApi {
  login(username: string, password: string) {
    return this.call('POST', '/api/auth/login', { data: { username, password } });
  }

  /** Logs in and returns only the token; fails the test at once if the login does not work. */
  async getToken(username: string, password: string): Promise<string> {
    const res = await this.login(username, password);
    expect(res.status(), `login as ${username}`).toBe(200);
    return (await res.json()).token;
  }

  me() {
    return this.call('GET', '/api/auth/me');
  }
}
